from . import bp
from flask import jsonify
from app.models.bookings import Bookings
from app.models.services import Services
from app.models.clients import Clients


@bp.route("/booking")
def booking():
    return "Booking Page"


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
