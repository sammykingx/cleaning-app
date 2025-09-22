from app.extensions import db
from faker import Faker

COLOR_RESET = "\033[0m"
COLOR_GREEN = "\033[92m"
COLOR_BLUE = "\033[94m"


class Services(db.Model):
    """Model for services."""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(
        db.String(100), nullable=False, unique=True
    )
    category = db.Column(db.String(30))
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)

    def __repr__(self) -> str:
        return f"<Service (id={self.id}, name={self.name}, price={self.price})>"

    def to_dict(self) -> dict:
        """Convert the service instance to a dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "price": self.price,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Services":
        """Create a service instance from a dictionary."""
        return cls(
            id=data.get("id"),
            name=data.get("name"),
            category=data.get("description"),
            price=data.get("price"),
        )


class ServiceAddons(db.Model):
    """Model for service addons."""

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(
        db.Integer, db.ForeignKey("services.id"), nullable=False
    )
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)

    def __repr__(self) -> str:
        return (
            f"<ServiceAddon (id={self.id}, service_id={self.service_id}, "
            f"name={self.name}, price={self.price})>"
        )

    def to_dict(self) -> dict:
        """Convert the service addon instance to a dictionary."""
        return {
            "id": self.id,
            "service_id": self.service_id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "ServiceAddons":
        """Create a service addon instance from a dictionary."""
        return cls(
            id=data.get("id"),
            service_id=data.get("service_id"),
            name=data.get("name"),
            description=data.get("description"),
            price=data.get("price"),
        )


def create_demo_services():
    """Create demo services and addons."""
    fake = Faker()
    demo_services = [
        Services(
            name=fake.word(),
            category=fake.random_element(
                elements=("cleaning", "maintenance")
            ),
            description=fake.sentence(),
            price=fake.random_number(digits=3, fix_len=True),
        )
        for _ in range(10)  # Create 5 demo services
    ]
    demo_addons = [
        ServiceAddons(
            service_id=fake.random_int(min=1, max=5),
            name=fake.word(),
            description=fake.sentence(),
            price=fake.random_number(digits=2, fix_len=True),
        )
        for _ in range(10)  # Create 10 demo addons
    ]
    db.session.bulk_save_objects(demo_services + demo_addons)
    db.session.commit()
    print(
        f"{COLOR_BLUE}Demo services and addons created successfully.{COLOR_RESET}"
    )
