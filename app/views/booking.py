from . import bp
from flask import jsonify, request
from app.extensions import db
from flask_wtf.csrf import CSRFError, validate_csrf
from app.models.bookings import Bookings
from app.models.services import Services
from app.views import serializers
from app.services.booking_service import BookingService
from collections import defaultdict
from datetime import datetime, timedelta


TIME_SLOTS = ["8:00", "11:00", "13:00", "15:00",]

MAX_BOOKINGS_PER_SLOT = 4

SERVICE_ADDONS = [
    {"name": "Fridge Cleaning", "unitCost": 20, "count": 1},
    {"name": "Oven Cleaning", "unitCost": 30, "count": 3},
    {"name": "Window Exterior", "unitCost": 30, "count": 3},
    {"name": "Window Interior", "unitCost": 30, "count": 3},
    {"name": "Carpet/Rug Cleaning", "unitCost": 30, "count": 3},
    {"name": "Deep Carpet/Rug", "unitCost": 30, "count": 3},
    {"name": "Bed Making", "unitCost": 30, "count": 3},
    {"name": "Org. Services", "unitCost": 30, "count": 3},
    {"name": "Dry Cleaning", "unitCost": 30, "count": 3},
    {"name": "Pick up & Drop Off", "unitCost": 30, "count": 3},
]


"""_summary_


Returns:
     _type_: _description_
"""

@bp.route("/booking", methods=["POST"])
def booking():
    """place booking"""
    
    try:
        csrf_token = request.headers.get('X-CSRFToken')
        validate_csrf(csrf_token)
    
        data = serializers.serialize_booking(request.get_json())
        Booking = BookingService(data)
        booked_service = Booking.place_booking()

    except CSRFError as e:
        print("validation error")
      #return jsonify({'status': 'error', 'message': 'CSRF validation failed', "err": e}), 403
        return "", 403
  
    except Exception as e:
        return "internal error", 500
    
    return jsonify(
        {
            'status': 'success',
            'message': 'Booking saved',
            'id': booked_service.booking_id, # compulsory
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
def get_available_slots():
    """Generate sample availability for the next 45 days."""
    today = datetime.today().date()
    end_date = today + timedelta(days=45)

    # Fetch all bookings within the next 45 days
    bookings = (
        db.session.query(Bookings.cleaning_date)
        .filter(Bookings.cleaning_date >= today, Bookings.cleaning_date <= end_date)
        .all()
    )

    # Group booked time slots by date
    booked_slots_by_date = defaultdict(set)
    for booking in bookings:
        dt = booking.cleaning_date
        date_str = dt.date().isoformat()
        time_str = dt.strftime("%H:%M")
        booked_slots_by_date[date_str].add(time_str)

    # Build availability
    availability = {}
    for i in range(46):
        day = today + timedelta(days=i)
        date_str = day.isoformat()
        booked_times = booked_slots_by_date.get(date_str, set())
        available_times = [t for t in TIME_SLOTS if t not in booked_times]
        availability[date_str] = available_times

    return availability


@bp.route("/availability/next_45_days")
def get_availability():
    from app.helpers.generate_availability import generate_sample_availability
    return jsonify(generate_sample_availability())
# {
#   "2025-07-06": ["11:00 AM", "1:00 PM", "3:00 PM"],
#   "2025-07-07": ["8:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
#   "2025-07-08": ["8:00 AM", "1:00 PM", "3:00 PM"],

# }

from faker import Faker
 
fake = Faker(locale="en_CA")   
DEMO_DATA = {
    'service': {'name': 'Wash & Fold'},
    'category': 'Laundry',
    'cleaning_date': datetime.now(),
    'additional_info': 'eneter additional info',
    'client_info': {
        'first_name': fake.first_name(),
        'last_name': fake.last_name(),
        'email': fake.email(),
        'phone': fake.phone_number(),
    },
    'address': {
        'street': fake.street_address(),
        'city': fake.city(),
        'state': fake.administrative_unit(),
    },
    'price': 69.678234,
    'add_ons': SERVICE_ADDONS
}