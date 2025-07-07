from app.extensions import db
from sqlalchemy import func


class EmailLogs(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True)
    booking_id = db.Column(db.String(20), index=True, unique=True, nullable=False)
    client_email = db.Column(db.String(30), nullable=False)
    subject = db.Column(db.String(35), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_sent = db.Column(db.Boolean, default=False)
    sent_at = db.Column(db.DateTime, server_onupdate=func.now())