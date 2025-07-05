from app.extensions import db
from app.models.bookings import Bookings
from app.models.services import Services
from datetime import datetime, timedelta


# Helper to create cleaning_date
def get_cleaning_datetime(days_from_now, hour):
    date = datetime.today().replace(hour=hour, minute=0, second=0, microsecond=0)
    return date + timedelta(days=days_from_now)


# Sample client email and service ID
client_email = "test@example.com"
# service_id = Services.query.filter_by(name="Standard Cleaning").first().id


# Create bookings (simulate slots being filled)
demo_bookings = [
    # Friday: 8-11, 11-1 and 1-3 booking
    Bookings(client_email=client_email, service="Regular House Cleaning", category="Residential Cleaning",
             cleaning_date=get_cleaning_datetime(0, 8), price=100.0),
    Bookings(client_email=client_email, service="Deep Cleaning", category="Residential Cleaning",
             cleaning_date=get_cleaning_datetime(0, 11), price=100.0),
    Bookings(client_email=client_email, service="Deep Cleaning", category="Residential Cleaning",
             cleaning_date=get_cleaning_datetime(0, 13), price=100.0),

    # Saturday: 4 bookings in 8-11 slot (full)
    Bookings(client_email=client_email, service="Small Office Cleaning", category="Commercial Cleaning",
             cleaning_date=get_cleaning_datetime(1, 8), price=100.0),
    Bookings(client_email=client_email, service="Medium Office Cleaning", category="Commercial Cleaning",
             cleaning_date=get_cleaning_datetime(1, 11), price=100.0),
    Bookings(client_email=client_email, service="Large Office Cleaning", category="Commercial Cleaning",
             cleaning_date=get_cleaning_datetime(1, 13), price=100.0),
    Bookings(client_email=client_email, service="Post Renovation Cleaning", category="Commercial Cleaning",
             cleaning_date=get_cleaning_datetime(1, 16), price=100.0),

    # Sunday: 3 bookings in 1-3 slot
    Bookings(client_email=client_email, service="Small Office Cleaning", category="Commercial Cleaning",
             cleaning_date=get_cleaning_datetime(2, 11), price=100.0),
    Bookings(client_email=client_email, service="Large Office Cleaning", category="Commercial Cleaning",
             cleaning_date=get_cleaning_datetime(2, 13), price=100.0),
    Bookings(client_email=client_email, service="Deep Cleaning", category="Residential Cleaning",
             cleaning_date=get_cleaning_datetime(2, 16), price=100.0),
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
