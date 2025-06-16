# application factory

from flask import Flask
from app.views import bp
from app.config import DevelopmentConfig

COLOR_RESET = "\033[0m"
COLOR_GREEN = "\033[92m"
COLOR_BLUE = "\033[94m"

def create_app(config_class:object = DevelopmentConfig) -> Flask:
    """Create and configure the Flask application."""
    
    app = Flask(__name__)
    
    print(f"{COLOR_BLUE}Creating Flask app with config: {config_class.__name__}{COLOR_RESET}")
    app.config.from_object(config_class)
    app.url_map.strict_slashes = False
    
    # initialize extensions
    
    
    # register blueprints
    app.register_blueprint(bp)
    
    return app