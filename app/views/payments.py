from . import bp
from flask  import current_app, flash, render_template, request
from app.models.bookings import Bookings
from app.models.clients import Clients, Address
from dotenv import load_dotenv
from app.extensions import csrf
from flask_wtf.csrf import CSRFError, validate_csrf
from square import Square
from square.core.api_error import ApiError
import os, uuid


load_dotenv()

def square_credentials():
    ENV = os.getenv("APP_ENV", "dev")
    
    if ENV == "dev":
        return {
            "app_id": current_app.config["SANDBOX_APP_ID"], 
            "location_id": current_app.config["SANDBOX_LOCATION_ID"],
            "access_token": current_app.config["SANDBOX_ACCESS_TOKEN"],
            "env": "sandbox"
        }
        
    return {
            "app_id": current_app.config["PROD_APP_ID"], 
            "location_id": current_app.config["PROD_LOCATION_ID"],
            "access_token": current_app.config["PROD_ACCESS_TOKEN"],
            "env": "production"
    }
    

@bp.route("/payments", methods=["GET", "POST"])
@csrf.exempt
def payments():
    
    squareup = square_credentials()
    
    if request.method == "POST":
        try:
            csrf_token = request.headers.get('X-CSRFToken')
            validate_csrf(csrf_token)


        except CSRFError as e:
            flash("corrupt payment session", "warning")
            print("csrf token")
            return "", 403
        
    
        data = request.get_json()
        nonce = data.get("nonce")
        
        current_app.logger.info("Request Data: %s", data)

        client = Square(
            token=squareup.get("access_token"),
            environment=squareup.get("env")
        )
        idempotency_key = uuid.uuid4()
        current_app.logger.info("Sqaure Client: %s", client)
        current_app.logger.info("Request Data: %s", data)

        result = client.payments.create_payment(
            body={
                "source_id": nonce,
                "idempotency_key": idempotency_key,
                "amount_money": {"amount": 1000, "currency": "USD"},  # $10.00
            }
        )
        
        current_app.logger.info("Sqaure Client Result: %s", result)
        
        return {
            "status": "successfull",
            "msg": "Payment processed",
        }
    
    booking_id = request.args.get("booking_id")
    
    if not booking_id:
        print("Missing Booking Information")
    
    cleaning_booking = Bookings.query.filter_by(booking_id=booking_id).first()
    client = Clients.query.filter_by(email=cleaning_booking.client_email).first()
    client_address = Address.query.filter_by(client_email=cleaning_booking.client_email).first()
    current_app.logger.info(f"{client.first_name} {client.last_name}")
    
    return render_template(
        "square-payments.html",
        booking_price=cleaning_booking.price,
        client=client,
        address=client_address,
        square_app_id=squareup.get("app_id"),
        square_location_id=squareup.get("location_id")
    )
