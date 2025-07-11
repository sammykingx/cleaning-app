# email cron job
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import sessionmaker
from email.message import EmailMessage
from app.models.email import EmailLogs
from contextlib import contextmanager
from app.constants import SUPPORT_EMAIL, ADMINS as admin_list
import smtplib


DB_URL = URL.create(
    drivername="mysql+pymysql",
    username="root",#"divgglin_app-admin",
    password="", #"PqM{tkt!$Hz,",
    host="127.0.0.1",
    port=3306,
    database="cleaning-app",#"divgglin_kleenspotles_app"
)

MAIL_SERVER = "divgm.com"
MAIL_PORT = 465
MAIL_USERNAME = "booking-portal@divgm.com"
MAIL_PASSWORD = "af1LTpr#ty.#"

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
    msg["cc"] = ",".join(admin_list)
    msg.add_alternative(msg_body, subtype="html")
    
    try:
        with smtplib.SMTP_SSL(MAIL_SERVER, MAIL_PORT, timeout=5) as mail_server:
            try:

                mail_server.login(MAIL_USERNAME, MAIL_PASSWORD)

                mail_server.send_message(msg)

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
    
    return True

def process_unsent_mail():
    with get_db_session() as db:
        email_records = db.query(EmailLogs).filter_by(is_sent=False).limit(5).all()

        if email_records:
            for record in email_records:
                print(record)
                resp = send_email(
                    MAIL_USERNAME,
                    "iyebhorasamuel@gmail.com",# record.client_email,
                    record.subject, 
                    record.message,
                )
                
                if resp:
                    record.is_sent = True
                
                
process_unsent_mail()
