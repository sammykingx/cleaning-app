# application factory

from flask import Flask
from app.views import bp
from app.extensions import db, migrate, csrf, mail
from app.config import DevelopmentConfig

COLOR_RESET = "\033[0m"
COLOR_GREEN = "\033[92m"
COLOR_BLUE = "\033[94m"


def create_app(
    config_class: object = DevelopmentConfig,
) -> Flask:
    """Create and configure the Flask application."""

    app = Flask(__name__)

    print(
        f"{COLOR_BLUE}Creating Flask app with config: {config_class.__name__}{COLOR_RESET}"
    )
    app.config.from_object(config_class)
    app.url_map.strict_slashes = False

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
