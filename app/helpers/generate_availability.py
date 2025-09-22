from datetime import datetime, timedelta
from app.constants import (
    ALLOWED_FREQUENCIES,
    TIME_SLOTS,
    SERVICE_ADDONS,
)
from faker import Faker
import random

fake = Faker(locale="en_CA")


def generate_sample_availability():
    today = datetime.today().date()
    availability = {}

    for i in range(46):  # 0 to 45
        date = today + timedelta(days=i)
        date_str = date.isoformat()

        # Simulate some slots being booked
        available = TIME_SLOTS.copy()
        booked_count = random.randint(0, 3)
        booked = random.sample(available, k=booked_count)
        for b in booked:
            available.remove(b)

        availability[date_str] = available

    return availability


def generate_demo_booking_data():
    """Generates demo booking data for testing purposes."""

    # Generate a random future date and time
    future_date = datetime.today().date() + timedelta(
        days=random.randint(1, 30)
    )
    cleaning_time = random.choice(TIME_SLOTS)
    cleaning_datetime = datetime.strptime(
        f"{future_date} {cleaning_time}", "%Y-%m-%d %H:%M"
    )

    return {
        "service": {
            "name": random.choice(
                [
                    "Regular House Cleaning",
                    "Deep Cleaning",
                    "Small Office Cleaning",
                ]
            )
        },
        "category": random.choice(
            ["Residential Cleaning", "Commercial Cleaning"]
        ),
        "cleaning_date": cleaning_datetime,
        "additional_info": fake.sentence(nb_words=8),
        "client_info": {
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "email": fake.email(),
            "phone": fake.phone_number(),
        },
        "address": {
            "street": fake.street_address(),
            "city": fake.city(),
            "state": fake.administrative_unit(),
        },
        "price": 69.678234,
        "add_ons": random.sample(
            SERVICE_ADDONS, k=random.randint(1, 3)
        ),
        "frequency": random.choice(ALLOWED_FREQUENCIES),
    }
