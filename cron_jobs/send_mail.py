# email cron job
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import sessionmaker
from email.message import EmailMessage
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.mysql import LONGTEXT
from contextlib import contextmanager
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    func
)
import smtplib


DB_URL = URL.create(
    drivername="mysql+pymysql",
    username="divgglin_app-admin",
    password="PqM{tkt!$Hz,",
    host="127.0.0.1",
    port=3306,
    database="divgglin_kleenspotles_app"
)

MAIL_SERVER = "divgm.com"
MAIL_PORT = 465
MAIL_USERNAME = "booking-portal@divgm.com"
MAIL_PASSWORD = "af1LTpr#ty.#"

ADMINS = [
    "contact@kleenspotless.com",
    "kleenspotless50@gmail.com",
]

SUPPORT_EMAIL = "contact@kleenspotless.com"

Base = declarative_base()
class EmailLogs(Base):
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(String(20), index=True, unique=True, nullable=False)
    client_email = Column(String(30), nullable=False)
    subject = Column(String(35), nullable=False)
    message = Column(LONGTEXT, nullable=False)
    is_sent = Column(Boolean, default=False)
    sent_at = Column(DateTime, server_onupdate=func.now())

    def __str__(self):
        return (
            f"Booking ID: {self.booking_id}, "
            f"Client Email: {self.client_email}, "
            f"is_sent: {self.is_sent}"
        )

@contextmanager
def get_db_session():
    engine = create_engine(DB_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
        session.commit()
        
    except Exception as e:
        session.rollback()
        print(f"[DB ERROR] {e}")

    finally:
        session.close()


def send_email(sender, receipient, subject, msg_body) -> bool:
    msg = EmailMessage()
    msg["from"] = sender
    msg["to"] = receipient
    msg["subject"] = subject
    msg["reply-to"] = SUPPORT_EMAIL
    msg["cc"] = ",".join(ADMINS)
    msg.add_alternative(msg_body, subtype="html")
    
    try:
        with smtplib.SMTP_SSL(MAIL_SERVER, MAIL_PORT, timeout=5) as mail_server:
            try:

                mail_server.login(MAIL_USERNAME, MAIL_PASSWORD)

                resp = mail_server.send_message(msg)

            except smtplib.SMTPConnectError:
                print(
                    "Could not establish a connection with "
                    "mail server"
                )
                return False

            except smtplib.SMTPServerDisconnected as err:
                print("Disconnected from mail server")
                return False

            except smtplib.SMTPException as err:
                print("Email service unavailble")
                return False

    except TimeoutError as err:
        print(f"{err}: check internet connection")
        return False

    except Exception as err:
        print(f"{err}, check back later")
        return False
        
    print(f"Email Was Sent to clinet, Response: {resp}")
    return True

def process_unsent_mail():
    with get_db_session() as db:
        email_records = db.query(EmailLogs).filter_by(is_sent=False).limit(5).all()

        if email_records:
            for record in email_records:
                print(record)
                resp = send_email(
                    MAIL_USERNAME,
                    record.client_email,
                    record.subject, 
                    record.message,
                )
                
                if resp:
                    record.is_sent = True
                
                
process_unsent_mail()
