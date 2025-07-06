from app.extensions import db
from sqlalchemy import func
from faker import Faker

COLOR_RESET = "\033[0m"
COLOR_GREEN = "\033[92m"
COLOR_BLUE = "\033[94m"


class Clients(db.Model):
    """Model for clients."""

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, index=True)
    first_name = db.Column(db.String(25), nullable=False)
    last_name = db.Column(db.String(25), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    timestamp = db.Column(db.DateTime, server_default=func.now())

    def __repr__(self) -> str:
        return (
            f"<Client (email={self.email}, "
            f"first_name={self.first_name}, "
            f"last_name={self.last_name}, "
            f"phone={self.phone})>"
        )

    def __str__(self) -> str:
        return str(
            dict(
                name=f"{self.first_name} {self.last_name}",
                email=self.email,
                phone=self.phone,
            )
        )

    def to_dict(self) -> dict:
        """Convert the client instance to a dictionary."""
        return {
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Clients":
        """Create a client instance from a dictionary."""
        return cls(
            email=data.get("email"),
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            phone=data.get("phone"),
        )


class Address(db.Model):
    """Model for client addresses."""

    id = db.Column(db.Integer, primary_key=True)
    client_email = db.Column(
        db.String(120),
        nullable=False,
    )
    street = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=func.now())

    def __repr__(self) -> str:
        return (
            f"<Address (id={self.id}, client_email={self.client_email}, "
            f"street={self.street}, city={self.city}, "
            f"state={self.state})>"
        )

    def to_dict(self) -> dict:
        """Convert the address instance to a dictionary."""
        return {
            "id": self.id,
            "client_email": self.client_email,
            "street": self.address_line1,
            "city": self.city,
            "state": self.state,
        }


def create_demo_clients():
    """Create demo clients for testing purposes."""
    fake = Faker()
    demo_clients = [
        Clients(
            email=fake.email(),
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            phone=fake.phone_number(),
        )
        for _ in range(10)  # Create 10 demo clients
    ]
    db.session.bulk_save_objects(demo_clients)
    db.session.commit()
    print(
        f"{COLOR_GREEN}Demo clients created successfully.{COLOR_RESET}"
    )


def create_demo_addresses():
    """Create demo addresses for testing purposes."""
    fake = Faker()
    demo_addresses = [
        Address(
            client_email=fake.email(),
            street=fake.street_address(),
            city=fake.city(),
            state=fake.state(),
        )
        for _ in range(10)  # Create 10 demo addresses
    ]
    db.session.bulk_save_objects(demo_addresses)
    db.session.commit()
    print(
        f"{COLOR_GREEN}Demo addresses created successfully.{COLOR_RESET}"
    )


def create_demo_data():
    """Create demo data for clients and addresses."""
    create_demo_clients()
    create_demo_addresses()
    print(
        f"{COLOR_BLUE}Demo model data created successfully.{COLOR_RESET}"
    )
