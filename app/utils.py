from flask_wtf.csrf import CSRFError, validate_csrf


def is_windows():
    import platform

    return platform.system().lower() == "windows"


def is_valid_csrf_token(csrf_token):
    try:
        validate_csrf(csrf_token)

    except CSRFError as e:
        return False

    return True
