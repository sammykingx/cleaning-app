from app.extensions import db
from flask_login import UserMixin

class Account(db.Model, UserMixin):
    """Model for user accounts."""
    
    __tablename__ = 'accounts'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    def get_id(self):
        """returns user id"""
        return self.email
    
    def set_password(self, password):
        """Set the password hash for the account."""
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        """Check the password against the stored hash."""
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<Account(username={self.username}, email={self.email})>'
    