from . import bp
from flask import current_app, render_template, request, session
from app.models.bookings import Bookings
from app.models.clients import Clients, Address
from app.extensions import db
from app.utils import is_valid_csrf_token
from dotenv import load_dotenv
from square.client import Square
from square.environment import SquareEnvironment
from square.core.api_error import ApiError
from datetime import datetime
from zoneinfo import ZoneInfo
import json, os, uuid


load_dotenv()


def square_credentials():
    ENV = os.getenv("APP_ENV", "dev")

    if ENV == "dev":
        return {
            "app_id": current_app.config["SANDBOX_APP_ID"],
            "location_id": current_app.config[
                "SANDBOX_LOCATION_ID"
            ],
            "access_token": current_app.config[
                "SANDBOX_ACCESS_TOKEN"
            ],
            "checkout_url": "https://sandbox.web.squarecdn.com/v1/square.js",
            "env": "sandbox",
        }

    return {
        "app_id": current_app.config["PROD_APP_ID"],
        "location_id": current_app.config["PROD_LOCATION_ID"],
        "access_token": current_app.config["PROD_ACCESS_TOKEN"],
        "checkout_url": "https://web.squarecdn.com/v1/square.js",
        "env": "production",
    }


@bp.route("/payments", methods=["GET", "POST"])
def payments():

    squareup = square_credentials()

    if request.method == "POST":
        if not is_valid_csrf_token(
            request.headers.get("X-CSRFToken") or
            request.cookies.get("csrf_token")
        ):
            return {
                "type": "warning",
                "title": "Page Expired",
                "msg": "Your payment page has expired due to inactivity. Kindly refresh to fix it.",
            }, 400

        data = request.get_json()
        nonce = data.get("nonce")
        cleaning_booking = Bookings.query.filter_by(
            booking_id=session.get("booking_id", None)
        ).first()
        if cleaning_booking is None:
            return {
                "type": "info",
                "title": "Booking Not Found",
                "msg": "We couldn’t locate your booking. Please click the booking link on your email to continue.",
            }, 200

        if cleaning_booking.is_paid:
            formatted_date = cleaning_booking.paid_at.strftime("%a, %b %d, %Y at %I:%M %p")
            return {
                "type": "info",
                "title": "Payment Already Processed",
                "msg": f"This booking was already paid on {formatted_date}.",
            },200
        
        client = Square(
            token=squareup.get("access_token"),
            environment=(
                SquareEnvironment.PRODUCTION
                if squareup.get("env") == "production"
                else SquareEnvironment.SANDBOX
            ),
        )

        # payment_ref = f"PAYREF-{uuid.uuid4().hex[:12].upper()}"
        str_amount = data.get("bookingDetails").get("amount")

        try:
            resp = client.payments.create(
                source_id=nonce,
                idempotency_key=cleaning_booking.idempotency_key,
                amount_money={
                    "amount": round(
                        float(str_amount) * 100
                    ),
                    "currency": "CAD",
                },
                location_id=squareup.get("location_id"),
                reference_id=cleaning_booking.booking_id,
                app_fee_money={"amount": round(0.01*100), "currency": "CAD"},
            )
            
            result = resp.model_dump()

        except ApiError as err:
            current_app.logger.error(err.errors)
            for e in err.errors:
                err_msg = e.detail.replace("_", " ")
                err_title = e.code.replace("_", " ")
            return {
                "type": "error",
                "title": f"Square: {err_title}",
                "msg": err_msg,
            }, 400

        cleaning_booking.payment_status = "paid"
        cleaning_booking.booking_status = "confirmed"
        
        cleaning_booking.square_order_id = result["payment"]["order_id"]
        cleaning_booking.paid_at = datetime.now(ZoneInfo("America/Toronto"))
        cleaning_booking.is_paid = True
        cleaning_booking.charged_amount = result["payment"]["total_money"]["amount"]
        
        db.session.commit()

        current_app.logger.info(
            "Sqaure Client Payment: %s",
            json.dumps(result, indent=2),
        )
        
        session.pop("booking_id", None)
        
        return {
            "type": "success",
            "title": "Payment Successful",
            "status": "completed",
            "msg": "Booking Payment completed successfully",
            "receipt_url": result["payment"]["receipt_url"]
        }, 200

    # GET REQUEST
    booking_id = request.args.get("booking_id")
    cleaning_booking = Bookings.query.filter_by(
        booking_id=booking_id
    ).first()
    if cleaning_booking is None:
        return render_template("invalid-booking.html")
    if cleaning_booking.idempotency_key is None:
        idempotency_key = uuid.uuid4()
        cleaning_booking.idempotency_key = idempotency_key
        db.session.commit()

    client = Clients.query.filter_by(
        email=cleaning_booking.client_email
    ).first()

    client_address = Address.query.filter_by(
        client_email=cleaning_booking.client_email
    ).first()

    session["booking_id"] = cleaning_booking.booking_id
    
    return render_template(
        "square-payments.html",
        booking_price=f"{cleaning_booking.price:,.2f}",
        charge_amount=f"{cleaning_booking.price * 0.6:,.2f}",
        client=client,
        address=client_address,
        square_app_id=squareup.get("app_id"),
        square_location_id=squareup.get("location_id"),
        checkout_url=squareup.get("checkout_url"),
        is_paid=cleaning_booking.is_paid,
    )
