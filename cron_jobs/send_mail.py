# email cron job
from app.models.email import EmailLogs
from app.constants import ADMINS, SUPPORT_EMAIL
from app.config import Config
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import sessionmaker
from email.message import EmailMessage
from contextlib import contextmanager
from dotenv import load_dotenv
import os, smtplib

load_dotenv()

DB_URL = URL.create(
    drivername="mysql+pymysql",
    username=os.getenv("DB_USER"),
    password=os.getenv("DB_PWD"),
    host="127.0.0.1",
    port=3306,
    database=os.getenv("DB_NAME"),
)

MAIL_SERVER = Config.MAIL_SERVER
MAIL_PORT = Config.MAIL_PORT
MAIL_USERNAME = Config.MAIL_USERNAME
MAIL_PASSWORD = Config.MAIL_PASSWORD

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


def send_email(receipient, subject, msg_body) -> bool:
    msg = EmailMessage()
    msg["from"] = MAIL_USERNAME
    msg["to"] = receipient
    msg["subject"] = subject
    msg["reply-to"] = SUPPORT_EMAIL
    msg["cc"] = ",".join(ADMINS)
    msg.add_alternative(msg_body, subtype="html")

    try:
        with smtplib.SMTP_SSL(
            MAIL_SERVER, MAIL_PORT, timeout=5
        ) as mail_server:
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
                print(f"Email service unavailble: {err}")
                return False

    except TimeoutError as err:
        print(f"{err}: check internet connection")
        return False

    except Exception as err:
        print(f"{err}, check back later")
        return False

    print(f"Email Was Sent to clinet, Response: resp")
    return True


def process_unsent_mail():
    with get_db_session() as db:
        email_records = (
            db.query(EmailLogs)
            .filter_by(is_sent=False)
            .limit(5)
            .all()
        )

        if email_records:
            for record in email_records:
                print(record)
                resp = send_email(
                    record.client_email,
                    record.subject,
                    record.message,
                )

                if resp:
                    record.is_sent = True


if __name__ == "__main__":
    process_unsent_mail()
