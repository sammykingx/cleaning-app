from app.extensions import db
from app.models.bookings import Bookings
from app.models.services import Services
from datetime import datetime, timedelta
from typing import Tuple
from faker import Faker


def format_datetime(dt:datetime) ->Tuple[str]:
    day_name = dt.strftime("%A")
    day_num = dt.day
    hour_min = dt.strftime("%I%p").lower()

    # Handle ordinal (1st, 2nd, 3rd, etc)
    if 10 <= day_num % 100 <= 20:
        suffix = 'th'
    else:
        suffix = {1: 'st', 2: 'nd', 3: 'rd'}.get(day_num % 10, 'th')

    return f"{day_name} {day_num}{suffix}", hour_min

fake = Faker()
# Helper to create cleaning_date
def get_cleaning_datetime(days_from_now, hour):
    date = datetime.today().replace(hour=hour, minute=0, second=0, microsecond=0)
    return date + timedelta(days=days_from_now)


def cleaning_app_demo_data():
    # Sample client email and service ID
    client_email = "test@example.com"
    # service_id = Services.query.filter_by(name="Standard Cleaning").first().id


    # Create bookings (simulate slots being filled)
    demo_bookings = [
        # Sunday: 8-11, 11-1 and 1-3 booking
        Bookings(client_email=client_email, service="Regular House Cleaning", category="Residential Cleaning",
                cleaning_date=get_cleaning_datetime(0, 8), price=100.0, booking_id=fake.bothify(text="KSP-########")),
        Bookings(client_email=client_email, service="Deep Cleaning", category="Residential Cleaning",
                cleaning_date=get_cleaning_datetime(0, 11), price=100.0, booking_id=fake.bothify(text="KSP-########")),
        Bookings(client_email=client_email, service="Deep Cleaning", category="Residential Cleaning",
                cleaning_date=get_cleaning_datetime(0, 13), price=100.0, booking_id=fake.bothify(text="KSP-########")),

        # Monday: 4 bookings (full)
        Bookings(client_email=client_email, service="Small Office Cleaning", category="Commercial Cleaning",
                cleaning_date=get_cleaning_datetime(1, 8), price=100.0, booking_id=fake.bothify(text="KSP-########")),
        Bookings(client_email=client_email, service="Medium Office Cleaning", category="Commercial Cleaning",
                cleaning_date=get_cleaning_datetime(1, 11), price=100.0, booking_id=fake.bothify(text="KSP-########")),
        Bookings(client_email=client_email, service="Large Office Cleaning", category="Commercial Cleaning",
                cleaning_date=get_cleaning_datetime(1, 13), price=100.0, booking_id=fake.bothify(text="KSP-########")),
        Bookings(client_email=client_email, service="Post Renovation Cleaning", category="Commercial Cleaning",
                cleaning_date=get_cleaning_datetime(1, 15), price=100.0, booking_id=fake.bothify(text="KSP-########")),

        # Tuesday: 3 bookings in 1-3 slot
        Bookings(client_email=client_email, service="Small Office Cleaning", category="Commercial Cleaning",
                cleaning_date=get_cleaning_datetime(2, 11), price=100.0, booking_id=fake.bothify(text="KSP-########")),
        Bookings(client_email=client_email, service="Large Office Cleaning", category="Commercial Cleaning",
                cleaning_date=get_cleaning_datetime(2, 13), price=100.0, booking_id=fake.bothify(text="KSP-########")),
        Bookings(client_email=client_email, service="Deep Cleaning", category="Residential Cleaning",
                cleaning_date=get_cleaning_datetime(2, 15), price=100.0, booking_id=fake.bothify(text="KSP-########")),
    ]

    services = [
        Services(name="Regular House Cleaning", category="Residential", description="General house cleaning", price=100.0),
        Services(name="Deep Cleaning", category="Residential", description="Intensive cleaning service", price=200.0),
        Services(name="Small Office Cleaning", category="Commercial", description="Cleaning for offices", price=150.0)
    ]

    for booking in demo_bookings:
        db.session.add(booking)

    for service in services:
        db.session.add(service)
        
    db.session.commit()
