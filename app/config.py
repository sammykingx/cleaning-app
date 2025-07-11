# application configuration
from dotenv import load_dotenv
from sqlalchemy.engine import URL
import os

load_dotenv()

DB_URL = URL.create(
    drivername="mysql+pymysql",
    username="root",#os.getenv("DB_USER", "root"),
    password="",#os.getenv("DB_PWD", ""),
    host="localhost",
    port=3306,
    database="cleaning-app",#os.getenv("DB_NAME", "cleaning-app")
)

class Config:
    """Base configuration class."""

    DEBUG = True
    TESTING = False
    SECRET_KEY = "b6059dc8db3bcf7bewewed4e2dc3b01d8e57994b2275e101ad7bdd2a44648299"
    CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 1200 # 20 minutes in seconds
    WTF_CSRF_METHODS = ["POST"]
    WTF_CSRF_HEADERS = ["X-CSRFToken",]
    
    MAIL_SERVER = os.getenv("MAIL_SERVER",)
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")
    MAIL_MAX_EMAILS = int(os.getenv("MAIL_MAX_EMAILS", 20))
    
    JSON_SORT_KEYS = False
    JSONIFY_PRETTYPRINT_REGULAR = False
    # JSONIFY_MIMETYPE = "application/json"
    # JSON_AS_ASCII = False

class DevelopmentConfig(Config):
    """Development configuration."""

    SECRET_KEY = os.getenv("APP_SECRET_KEY") or "asdfjglvnmquqp28805ekwek&^%325ng;3235jlvdfwekejbr90783454"
    SQLALCHEMY_DATABASE_URI = (
        os.getenv("DB_URI") or "sqlite:///cleaning.db"
    )
    
class ProductionConfig(Config):
    DEBUG = False
    SECRET_KEY = os.getenv("APP_SECRET_KEY")
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = 86400
    
    SQLALCHEMY_DATABASE_URI = DB_URL
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": 20,
        "max_overflow": 20,
        "pool_timeout": 10,
        "pool_recycle": 600,
        "pool_pre_ping": True
    }
