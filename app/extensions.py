from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from flask_migrate import Migrate
from flask_mail import Mail
from flask_login import LoginManager

db = SQLAlchemy()
migrate = Migrate()
csrf = CSRFProtect()
mail = Mail()
login_manager = LoginManager()

def init_extensions(app):
    """Initialize Flask extensions."""
    
    db.init_app(app)
    migrate.init_app(app, db)
    csrf.init_app(app)
    mail.init_app(app)
    login_manager.init_app(app)
    
    login_manager.login_view = 'main.signin'
    login_manager.login_message = "Please log in to access this page."
    login_manager.session_protection = 'strong'
    
    return app

@login_manager.user_loader
def user_loader(user_email: str):
    """User loader for Flask-Login."""
    
    from app.models.accounts import Account
    return Account.query.filter_by(email=user_email).first()
