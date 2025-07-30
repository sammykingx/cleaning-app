# application factory

from flask import Flask
from app.views import bp
from app.extensions import db, migrate, csrf, mail
from app.config import DevelopmentConfig, ProductionConfig
from dotenv import load_dotenv
import os

load_dotenv()

def create_app() -> Flask:
    """Create and configure the Flask application."""

    app = Flask(__name__)

    ENV = os.getenv("APP_ENV", "dev")
    if ENV == "prod":
        config_class = ProductionConfig
    else:
        config_class = DevelopmentConfig
        
    app.config.from_object(config_class)
    print(
        f"Configured Flask app with config: {config_class.__name__}"
    )
    app.url_map.strict_slashes = False
    if not app.config.get("SECRET_KEY"):
        raise RuntimeError(
            "❌ SECRET_KEY is not set! The app will not start without it. "
            "Please set a strong SECRET_KEY in your config or environment."
        )
        
    if not app.config.get("SQLALCHEMY_DATABASE_URI"):
        raise RuntimeError("❌ DATABASE_URL is not set. Please configure it securely.")

    # initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    csrf.init_app(app)
    mail.init_app(app)
    print(
        f"Extensions initialized successfully."
    )

    # register blueprints
    with app.app_context():
        # create database tables
        print("Inside DB Context")
        db.create_all()
        print(
            f"Database tables created successfully."
        )
    app.register_blueprint(bp)

    return app
