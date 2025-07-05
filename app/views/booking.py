from . import bp
from flask import jsonify, request
from app.extensions import db
from flask_wtf.csrf import CSRFError, validate_csrf
from app.models.bookings import Bookings
from app.models.services import Services
from app.models.clients import Clients
from app.views import serializers
from app.services.booking_service import BookingService
from collections import defaultdict
from datetime import datetime, timedelta


TIME_SLOTS = [
    ("8:00 AM - 11:00 AM", 8, 11),
    ("11:00 AM - 1:00 PM", 11, 13),
    ("1:00 PM - 3:00 PM", 13, 15),
    ("3:00 PM - 6:00 PM", 15, 18),
]

MAX_BOOKINGS_PER_SLOT = 4


@bp.route("/booking", methods=["POST"])
def booking():
    """place booking"""
    
    try:
        csrf_token = request.headers.get('X-CSRFToken')
        validate_csrf(csrf_token)
    
        data = serializers.serialize_booking(request.get_json())
        print(data)
        # cleaned_data = ValidateBookingData(**data)
        Booking = BookingService(data)
        # booked_service = Booking.place_booking()

    except CSRFError as e:
      return jsonify({'status': 'error', 'message': 'CSRF validation failed', "err": e}), 403
    #   return "", 403
    from time import time
    timestamp = int(time())
    return jsonify(
        {
            'status': 'success',
            'message': 'Booking saved',
            'id': f"KS-{timestamp}",
            'data': data,
            # 'data': booked_service.to_dict() if booked_service else None,
        }
    )


@bp.route("/all_bookings")
def all_bookings():
    """Fetch all bookings."""
    bookings = Bookings.query.all()
    booking_list = [booking.to_dict() for booking in bookings]
    return jsonify(booking_list)


@bp.route("/booking/<int:booking_id>")
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
def get_availability():
    """Returns available time slots for the current week."""
    today = datetime.today()
    start_of_week = today - timedelta(days=today.weekday()) # always start at monday
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0) # resets to 00:00:00 on monday
    end_of_week = start_of_week + timedelta(days=6, hours=23, minutes=59, seconds=59)

    # Fetch all bookings for the week
    bookings = db.session.query(Bookings.cleaning_date).filter(
        Bookings.cleaning_date >= start_of_week,
        Bookings.cleaning_date <= end_of_week
    ).all()

    # Track booked slots
    booked_slots = defaultdict(set)  # { "Friday": {"8:00 AM - 11:00 AM", ...}, ... }

    for (cleaning_date,) in bookings:
        day_name = cleaning_date.strftime("%A")
        hour = cleaning_date.hour

        for label, start_hr, end_hr in TIME_SLOTS:
            if start_hr <= hour < end_hr:
                booked_slots[day_name].add(label)
                break

    # Build availability: exclude booked slots
    availability = {}
    for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]:
        available_slots = [
            label for label, _, _ in TIME_SLOTS
            if label not in booked_slots.get(day, set())
        ]
        availability[day] = available_slots

    return jsonify(availability)

    # availability = {
    #     'Monday': ['8:00 AM - 11:00 AM', '1:00 PM - 3:00 PM'],
    #     'Tuesday': ['8:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '1:00 PM - 3:00 PM'],
    #     'Wednesday': ['3:00 PM - 6:00 PM'],
    #     'Thursday': ['8:00 AM - 11:00 AM', '11:00 AM - 1:00 PM'],
    #     'Friday': [],
    #     'Saturday': ['8:00 AM - 11:00 AM'],
    #     'Sunday': ['11:00 AM - 1:00 PM', '3:00 PM - 6:00 PM']
    # }