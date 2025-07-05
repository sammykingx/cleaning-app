from app.extensions import db
from sqlalchemy import func
from faker import Faker
import json

COLOR_RESET = "\033[0m"
COLOR_GREEN = "\033[92m"
COLOR_BLUE = "\033[94m"


class Bookings(db.Model):
    """Model for bookings."""

    id = db.Column(db.Integer, primary_key=True)
    client_email = db.Column(
        db.String(120),
        nullable=False,
        index=True,
    )
    service = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    max_bedroom = db.Column(db.Integer, default=0)
    max_bathroom = db.Column(db.Integer, default=0)
    extra_bedroom = db.Column(db.Integer, default=0)
    extra_bathroom = db.Column(db.Integer, default=0)
    add_ons = db.Column(db.Text)
    notes = db.Column(db.Text)
    booking_date = db.Column(
        db.DateTime, server_default=func.now(), nullable=False
    )
    cleaning_date = db.Column(db.DateTime, nullable=False)
    booking_status = db.Column(
        db.String(20), default="pending", nullable=False
    )
    payment_status = db.Column(
        db.String(20), default="unpaid", nullable=False
    )
    price = db.Column(db.Float, nullable=False)
    updated_at = db.Column(db.DateTime, server_default=func.now(), server_onupdate=func.now())

    def __repr__(self) -> str:
        return (
            f"<Booking (id={self.id}, client_email={self.client_email}, "
            f"service_type={self.service_type}, booking_date={self.booking_date}, "
            f"status={self.status})>"
        )

    def set_add_ons(self, add_ons_list):
        self.add_ons = json.dumps(add_ons_list)
    
    def get_add_ons(self):
        return json.loads(self.add_ons) if self.add_ons else []
    
    def to_dict(self) -> dict:
        """Convert the booking instance to a dictionary."""
        return {
            "id": self.id,
            "client_email": self.client_email,
            "service": self.service,
            "category": self.category,
            "addons": self.add_ons,
            "notes": self.notes,
            "booking_date": self.booking_date.isoformat(),
            "cleaning_date": self.cleaning_date.isoformat(),
            "booking_status": self.booking_status,
            "payment_status": self.payment_status,
            "price": self.price,
        }


def create_demo_bookings():
    """Create demo bookings for testing purposes."""

    fake = Faker()
    demo_bookings = [
        Bookings(
            client_email=fake.email(),
            service=fake.random_element(
                elements=("Regular House Cleaning", "Deep Cleaning", "Small Office Cleaning")
            ),
            category=fake.random_element(
                elements=("Residential Cleaning", "Commercial Cleaning",)
            ),
            addons=fake.random_int(min=1, max=5),
            notes=fake.text(max_nb_chars=200),
            booking_date=fake.date_time_this_year(),
            cleaning_date=fake.date_time_this_year(),
            booking_status=fake.random_element(
                elements=("pending", "confirmed", "cancelled")
            ),
            payment_status=fake.random_element(
                elements=("unpaid", "paid")
            ),
            price=fake.random_number(digits=3, fix_len=True),
        )
        for _ in range(10)  # Create 10 demo bookings
    ]
    db.session.bulk_save_objects(demo_bookings)
    db.session.commit()
    print(
        f"{COLOR_BLUE}Demo bookings created successfully.{COLOR_RESET}"
    )
