# application configuration
from dotenv import load_dotenv
import os

load_dotenv()


class Config:
    """Base configuration class."""

    DEBUG = True
    TESTING = False
    SECRET_KEY = "b6059dc8db3bcf7bewewed4e2dc3b01d8e57994b2275e101ad7bdd2a44648299"
    CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 900 # 15 minutes in seconds
    WTF_CSRF_METHODS = ["POST"]
    WTF_CSRF_HEADERS = ["X-CSRFToken",]
    
    MAIL_SERVER = os.getenv("MAIL_SERVER",)
    MAIL_PORT = int(os.getenv("MAIL_PORT", "465"))
    MAIL_USE_SSL = bool(os.getenv("MAIL_USE_SSL", "true"))
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("PASSWORD", "af1LTpr#ty.#")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")
    MAIL_MAX_EMAILS = int(os.getenv("MAIL_MAX_EMAILS", 20))
    
    # JSON_SORT_KEYS = False
    # JSONIFY_PRETTYPRINT_REGULAR = False
    # JSONIFY_MIMETYPE = "application/json"
    # JSON_AS_ASCII = False

class DevelopmentConfig(Config):
    """Development configuration."""

    SECRET_KEY = os.getenv("APP_SECRET_KEY") or "asdfjglvnmquqp28805ekwek&^%325ng;3235jlvdfwekejbr90783454"
    SQLALCHEMY_DATABASE_URI = (
        os.getenv("DB_URI") or "sqlite:///cleaning-app.db"
    )
