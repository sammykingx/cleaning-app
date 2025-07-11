# application factory

from flask import Flask
from app.views import bp
from app.extensions import db, migrate, csrf, mail
from app.config import DevelopmentConfig, ProductionConfig
from dotenv import load_dotenv
import os

load_dotenv()
COLOR_RESET = "\033[0m"
COLOR_GREEN = "\033[92m"
COLOR_BLUE = "\033[94m"


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
        f"{COLOR_BLUE}Configured Flask app with config: {config_class.__name__}{COLOR_RESET}"
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
        f"{COLOR_GREEN}Extensions initialized successfully.{COLOR_RESET}"
    )

    # register blueprints
    app.register_blueprint(bp)

    with app.app_context():
        # create database tables
        db.create_all()
        # print(
        #     f"{COLOR_GREEN}Database tables created successfully.{COLOR_RESET}"
        # )

    return app
