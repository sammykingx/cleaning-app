from flask import render_template
from app.extensions import db
from app.models.bookings import Bookings
from app.models.clients import Clients, Address
from app.services.notification_service import NotificationService
from time import time
import json

class BookingService:
    def __init__(self, data:dict) -> None:
        self.booking_info:dict = self.serialize_booking(data)
        self.client_info:dict = data.get("client_info", {})
        self.address:dict = data.get("address", {})
        # self.booking_info["recurring"] = True if self.booking_info.get("frequency") != "one-off" else False
        self.booking:Bookings = None
        self.client:Clients = None

    def create_or_get_client(self):
        """Creates or returns a new Clients if not already exists."""
        
        # gets Clients record by email if the Clients object is not set
        if not self.client:
            self.client = Clients.query.filter_by(email=self.client_info.get("email")).first()
            
            # if user does not exist in the db, create a new one
            if not self.client:
                self.client = Clients(**self.client_info)
                db.session.add(self.client)
                db.session.commit()

        return self.client
    
    def save_user_address(self):
        """Creates or returns a new address for the user."""
        
        self.address = Address(
            **self.address,
            client_email=self.client_info.get("email"),
        )
            
        db.session.add(self.address)
        db.session.commit()

        return self.address
    
    def save_booking(self):
        """Creates the booking record in the database."""
        
        # Check if booking object already exists
        if not self.booking:
            self.user = self.create_or_get_client()
            self.save_user_address()
            timestamp = int(time())
            self.booking = Bookings(
                **self.booking_info,
                booking_id=f"KSP-{timestamp}",
            )
            db.session.add(self.booking)
            db.session.commit()

        return self.booking

    def process_payment(self):
        """Handle optional payment processing."""

        # if not self.booking.price > 0:
        #     raise ValueError("Booking price must be greater than zero for payment processing.")
        #     # 
        #     # result = payment.charge_user(payment_gateway=None)  # Replace None with actual payment gateway
            
        # elif self.booking.frequency != "one-off":
        #     # it's a recurring service payment
        #     # update the recurring booking table
        #     pass
            
        # else:
        #     # it's a one-off service payment
        #     payment = PaymentService(self.booking)
        #     response = payment.charge_user(self.user)
        #     if not response:
        #         raise Exception("Payment processing failed.")
            
        #     # Update booking status and payment status
        #     self.booking.status = "approved"
        #     self.booking.payment_status = "paid"
        #     db.session.add(self.booking)
        #     db.session.commit()
        
        # return response
        return "Not configured yet"

    def notify(self):
        """Send mail notifications."""
        
        from app.constants import APP_NAME, APP_SUPPORT_EMAIL
        
        email_message =  render_template(
            "email/payment-confirmation.html",
            client_name=f"{self.user.full_name()}",
            client_email= self.user.email,
            amount=self.booking.price,
            service_type=self.booking.service,
            payment_date=self.booking.booking_date,
            app_name= APP_NAME,
            app_support_email=APP_SUPPORT_EMAIL,
            partner_name="Kleen & Spotless",
            partner_support_email="contact@kleenspotless.com",
            footer_comp_name="Divgm Technologies",
        )
        print("email_message ready for sending")
        
        mail_service = NotificationService(
            user=self.user,
            subject=f"Booking Confirmation - {APP_NAME}",
            message=email_message
        )
        mail_service.send_to_customer()
        # NotificationService.send_to_customer(self.booking)
        # NotificationService.send_to_admin(self.booking)
        return True
    
    def place_booking(self):
        """Run the entire booking flow."""
        #self.validate()
        self.save_booking()
        
        # self.process_payment()
        
        # self.notify()
        
        return self.booking
    
    # passed
    def serialize_booking(self, data):
        """serialize the data for db entry on the booking table"""
        
        return {
            "service": data["service"]["name"],
            "client_email": data["client_info"]["email"],
            "category": data["category"],
            "max_bedroom": data.get("service", {}).get("bedrooms", 0),
            "max_bathroom": data.get("service", {}).get("bedrooms", 0),
            "extra_bedroom": data.get("service", {}).get("extra_bedroom", 0),
            "extra_bathroom": data.get("service", {}).get("extra_bathroom", 0),
            "add_ons": json.dumps(data["add_ons"]) if data.get("add_ons") else "",
            "notes": data.get("additional_info", ""),
            "cleaning_date": data["cleaning_date"],
            "price": data["price"],
        }