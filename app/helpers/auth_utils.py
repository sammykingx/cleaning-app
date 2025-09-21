from flask import current_app
from flask_wtf.csrf import validate_csrf


def is_valid_csrf(csrf_token: str) -> bool:
    try:
        validate_csrf(csrf_token)
    except Exception as e:
        current_app.logger.error("CSRF validation failed: %s", e)
        return False
    
    return True