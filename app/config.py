# application configuration
from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    """Base configuration class."""
    DEBUG = True
    TESTING = False
    CSRF_ENABLED = True
    # JSON_SORT_KEYS = False
    # JSONIFY_PRETTYPRINT_REGULAR = False
    # JSONIFY_MIMETYPE = "application/json"
    # JSON_AS_ASCII = False
    SECRET_KEY = "b6059dc8db3bcf7bd4e2dc3b01d8e57994b2275e101ad7bdd2a446482990df9b"
    
class DevelopmentConfig(Config):
    """Development configuration."""
    
    SECRET_KEY = os.getenv("APP_SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv("DB_URI") or 'sqlite:///cleaning-app.db'