from app.extensions import db
from sqlalchemy import func
from sqlalchemy.dialects.mysql import LONGTEXT


class EmailLogs(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True)
    booking_id = db.Column(
        db.String(20), index=True, unique=True, nullable=False
    )
    client_email = db.Column(db.String(30), nullable=False)
    subject = db.Column(db.String(35), nullable=False)
    message = db.Column(LONGTEXT, nullable=False)
    is_sent = db.Column(db.Boolean, default=False)
    sent_at = db.Column(db.DateTime, server_onupdate=func.now())

    def __str__(self):
        return (
            f"Booking ID: {self.booking_id}, "
            f"Client Email: {self.client_email}, "
            f"is_sent: {self.is_sent}"
        )
