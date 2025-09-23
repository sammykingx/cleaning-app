from flask import render_template, url_for
from app.extensions import db
from app.models.bookings import Bookings
from app.models.clients import Clients, Address
from app.models.email import EmailLogs
from app.services.notification_service import (
    NotificationService,
)
from time import time, sleep
from typing import Dict
import json


class BookingService:
    def __init__(self, data: dict) -> None:
        self.booking_info: dict = self.serialize_booking(data)
        self.client_info: dict = data.get("client_info", {})
        self.address: dict = data.get("address", {})
        self.booking: Bookings = None
        self.client: Clients = None
        self.client_address = None
        self.email_subj = None

    def place_booking(self):
        """Run the entire booking flow."""

        self.save_booking()
        email_msg = self.load_email_message()
        self.update_email_log(email_msg)
        self.notify(email_msg)

        return self.booking

    def save_booking(self):
        """Creates the booking record in the database."""

        # Check if booking object already exists
        if not self.booking:

            self.user = self.create_or_get_client()
            self.save_client_address()
            timestamp = int(time())
            self.booking = Bookings(
                **self.booking_info,
                booking_id=f"KSP-{timestamp}",
            )
            db.session.add(self.booking)
            db.session.commit()

        return self.booking

    def create_or_get_client(self):
        """Creates or returns a new Clients if not already exists."""

        # gets Clients record by email if the Clients object is not set
        if not self.client:
            self.client = Clients.query.filter_by(
                email=self.client_info.get("email")
            ).first()

            # if user does not exist in the db, create a new one
            if not self.client:
                self.client = Clients(**self.client_info)
                db.session.add(self.client)
                db.session.commit()

        return self.client

    def save_client_address(self):
        """Creates or returns a new address for the user."""

        self.client_address = Address(
            **self.address,
            client_email=self.client_info.get("email"),
        )

        db.session.add(self.client_address)
        db.session.commit()

        return self.client_address

    def load_email_message(self) -> str:
        """Load the email message template for booking confirmation."""

        if not self.booking:
            raise ValueError(
                "Booking record not found. Please save the booking first."
            )
        if not self.client:
            raise ValueError(
                "Client record not found. Please create or get the client first."
            )
        if not self.client_address:
            raise ValueError(
                "Client address not found. Please save the client address first."
            )

        # Prepare the email message

        clean_date_time = self.booking_info.get("cleaning_date")
        clean_date = clean_date_time.strftime(
            "%A, %B %d"
        ).replace(" 0", " ")
        cleaning_time = (
            clean_date_time.strftime("%I:%M%p")
            .lstrip("0")
            .lower()
        )
        cleaning_addons = json.loads(
            self.booking.add_ons or "[]"
        )
        self.email_subj = (
            "Booking Confirmation - Kleenspotless.com"
        )
        try:
            msg = render_template(
                "email/confirmed-booking.html",
                f_name=self.client.first_name,
                date=clean_date,
                time=cleaning_time,
                phone=self.client.phone,
                booking_id=self.booking.booking_id,
                category=self.booking.category,
                service=self.booking.service,
                notes=self.booking.notes,
                street=self.client_address.street,
                city=self.client_address.city,
                state=self.client_address.state,
                bedrooms=self.booking.max_bedroom,
                bathrooms=self.booking.max_bathroom,
                extra_bed=self.booking.extra_bedroom,
                extra_bath=self.booking.extra_bathroom,
                s_total=self.booking.price
                - (self.booking.price * 0.15),
                tax=self.booking.price * 0.15,
                price=self.booking.price,
                addons=cleaning_addons,
                frequency=self.booking.frequency,
                checkout_url=url_for("main.payments", booking_id=self.booking.booking_id, _external=True),
            )

        except Exception as err:
            print(err)

        return msg

    def notify(self, email_msg):
        """sends the client email notification"""

        notification = NotificationService(
            user_email=self.booking.client_email,
            subject=self.email_subj,
            message=email_msg,
        )

        notification.send_to_client()
        return True

    def update_email_log(self, email_msg) -> bool:
        """Update email record to be used by server cron job"""

        email_record = EmailLogs(
            client_email=self.booking.client_email,
            booking_id=self.booking.booking_id,
            subject=self.email_subj,
            message=email_msg,
        )
        db.session.add(email_record)
        db.session.commit()

        return True

    def process_payment(self) -> str:
        """Handle optional payment processing."""

        return "Not configured yet"

    def serialize_booking(self, data) -> Dict[str, str]:
        """serialize the data for db entry on the booking table"""

        return {
            "service": data["service"]["name"],
            "client_email": data["client_info"]["email"],
            "category": data["category"],
            "max_bedroom": data.get("service", {}).get(
                "bedrooms", 0
            ),
            "max_bathroom": data.get("service", {}).get(
                "bedrooms", 0
            ),
            "extra_bedroom": data.get("service", {}).get(
                "extra_bedroom", 0
            ),
            "extra_bathroom": data.get("service", {}).get(
                "extra_bathroom", 0
            ),
            "add_ons": (
                json.dumps(data["add_ons"])
                if data.get("add_ons")
                else ""
            ),
            "notes": data.get("additional_info", ""),
            "cleaning_date": data["cleaning_date"],
            "price": data["price"],
            "frequency": data.get("frequency", "one-time"),
        }
