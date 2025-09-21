from . import bp
from flask import current_app, render_template
from flask_login import login_required
from sqlalchemy import func
from app.models.bookings import Bookings
from app.models.clients import Clients


@bp.route("/dashboard")
@login_required
def admin_dashboard():
    bookings = Bookings.query.order_by(Bookings.booking_date).limit(7)
    total_bookings = Bookings.query.count()
    # total_booking_amount = Bookings.query(func.sum(Bookings.price))\
    #     .filter_by(payment_status="unpaid")\
    #     .scalar() or 0.0
    
    unpaid_bookings = Bookings.query \
        .with_entities(func.sum(Bookings.price)) \
        .filter_by(payment_status="unpaid") \
        .scalar() or 0.0
    
    clients = Clients.query.all()
    total_clients = Clients.query.count()

    #current_app.logger.info("Booking Amount: CA$%s", total_booking_amount)
    current_app.logger.info("Total Unpaid Bookings: %s", unpaid_bookings)
    return render_template(
        "accounts/base_dashboard.html",
        bookings=bookings,
        total_bookings=total_bookings,
        clients=clients,
        total_clients=total_clients,
        unpaid_bookings=unpaid_bookings,
    )