from . import bp
from flask import (
    jsonify,
    request,
    render_template,
    render_template_string,
)
from app.extensions import db
from flask_wtf.csrf import CSRFError, validate_csrf
from app.models.bookings import Bookings
from app.models.services import Services
from app.views import serializers
from app.services.booking_service import BookingService
from app.constants import SERVICE_ADDONS, TIME_SLOTS
from app.utils import is_windows, is_valid_csrf_token
from collections import defaultdict
from datetime import datetime, timedelta


"""_summary_


Returns:
     _type_: _description_
"""


@bp.route("/booking", methods=["POST"])
def booking():
    """place booking"""

    if not is_valid_csrf_token(
        request.headers.get("X-CSRFToken")
    ):
        return "", 403

    try:
        data = serializers.serialize_booking(request.get_json())
        Booking = BookingService(data)
        booked_service = Booking.place_booking()

    except Exception as e:
        print("An error occurred while placing the booking:", e)
        return "internal error", 500

    return jsonify(
        {
            "status": "success",
            "message": "Booking saved",
            "id": booked_service.booking_id,  # compulsory
            # 'data': booked_service.to_dict() if booked_service else None,
        }
    )


@bp.route("/service-addons")
def view_template():
    return jsonify(SERVICE_ADDONS)


@bp.route("/all_bookings")
def all_bookings():
    """Fetch all bookings."""
    bookings = Bookings.query.all()
    booking_list = [booking.to_dict() for booking in bookings]
    return jsonify(booking_list)


@bp.route("/booking/<booking_id>")
def booking_detail(booking_id):
    """Fetch a specific booking by ID."""

    booking = Bookings.query.get_or_404(booking_id)
    return jsonify(booking.to_dict())


@bp.route("/all_services")
def all_services():
    """Fetch all services."""

    services = Services.query.all()
    service_list = [service.to_dict() for service in services]
    return jsonify(service_list)


@bp.route("/availability")
def get_available_slots():
    """Generate sample availability for the next 45 days."""

    today = datetime.today().date()
    end_date = today + timedelta(days=45)

    # Fetch all bookings within the next 46 days
    bookings = (
        db.session.query(Bookings.cleaning_date)
        .filter(
            Bookings.cleaning_date >= today,
            Bookings.cleaning_date <= end_date,
        )
        .all()
    )

    # Group booked time slots by date
    booked_by_date = defaultdict(set)
    for (cleaning_dt,) in bookings:
        date_str = cleaning_dt.date().isoformat()
        time_str = (
            cleaning_dt.strftime("%-H:%M")
            if not is_windows()
            else cleaning_dt.strftime("%#H:%M")
        )
        booked_by_date[date_str].add(time_str)

    # Build availability dict
    availability = {}
    for i in range(46):
        day = today + timedelta(days=i)
        date_str = day.isoformat()
        booked_times = booked_by_date.get(date_str, set())
        available_times = [
            slot
            for slot in TIME_SLOTS
            if slot not in booked_times
        ]
        availability[date_str] = available_times

    return availability


@bp.route("/booking_details/<b_id>")
def email_details(b_id=None):
    """Render email template with booking details."""

    b_id = b_id or "KSP-1754177741"
    from app.models.email import EmailLogs

    email_reocrd = EmailLogs.query.filter_by(
        booking_id=b_id
    ).first()
    if not email_reocrd:
        return jsonify({"error": "Email record not found"}), 404

    return render_template_string(email_reocrd.message)


# Example response format for availability
# {
#   "2025-07-06": ["11:00", "13:00", "15:00"],
#   "2025-07-07": ["8:00", "11:00", "13:00", "15:00"],
#   "2025-07-08": ["8:00", "1:00", "15:00"],
# }
