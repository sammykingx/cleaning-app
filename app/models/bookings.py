from app.extensions import db
from datetime import datetime
from faker import Faker

COLOR_RESET = "\033[0m"
COLOR_GREEN = "\033[92m"
COLOR_BLUE = "\033[94m"


class Bookings(db.Model):
    """Model for bookings."""

    id = db.Column(db.Integer, primary_key=True)
    client_email = db.Column(
        db.String(120),
        db.ForeignKey("clients.id"),
        nullable=False,
        index=True,
    )
    service_type = db.Column(db.String(100), nullable=False)
    service_info = db.Column(
        db.Integer,
        db.ForeignKey("services.id"),
        nullable=False,
        index=True,
    )
    addons = db.Column(
        db.Integer,
        db.ForeignKey("service_addons.id"),
        index=True,
    )
    frequency = db.Column(
        db.Enum("one-time", "weekly", "bi-weekly", "monthly"),
        default="one-time",
        nullable=False,
    )
    notes = db.Column(db.Text)
    booking_date = db.Column(
        db.DateTime, default=datetime.now(), nullable=False
    )
    cleaning_date = db.Column(db.DateTime, nullable=False)
    booking_status = db.Column(
        db.String(20), default="pending", nullable=False
    )
    payment_status = db.Column(
        db.String(20), default="unpaid", nullable=False
    )
    price = db.Column(db.Float, nullable=False)

    def __repr__(self) -> str:
        return (
            f"<Booking (id={self.id}, client_email={self.client_email}, "
            f"service_type={self.service_type}, booking_date={self.booking_date}, "
            f"status={self.status})>"
        )

    def to_dict(self) -> dict:
        """Convert the booking instance to a dictionary."""
        return {
            "id": self.id,
            "client_email": self.client_email,
            "service_type": self.service_type,
            "service_info": self.service_info,
            "addons": self.addons,
            "frequency": self.frequency,
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
            service_type=fake.random_element(
                elements=("cleaning", "maintenance")
            ),
            service_info=fake.random_int(min=1, max=10),
            addons=fake.random_int(min=1, max=5),
            frequency=fake.random_element(
                elements=(
                    "one-time",
                    "weekly",
                    "bi-weekly",
                    "monthly",
                )
            ),
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
