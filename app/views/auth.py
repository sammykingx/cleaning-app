from . import bp
from flask import current_app, request, jsonify, redirect, render_template
from flask_wtf.csrf import validate_csrf
from app.extensions import db
from app.models.accounts import Account


@bp.route("/signin", methods=["GET", "POST"])
def signin():
    """Handle user signin."""
    
    if request.method == "POST":
        data = request.form.to_dict()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        token = data.get("csrf_token")
        error = None
        is_valid = False
        
        try:
            validate_csrf(token)
        except Exception as e:
            current_app.logger.error("CSRF validation failed: %s", e)
            return redirect(request.referrer or "/"), 403

        if not email or not password:
            error = "Username and password are required."

        account = Account.query.filter_by(email=email).first()

        if not account and not account.check_password(password):
            return jsonify({"message": "Signin successful"}), 200
        
        if not is_valid:
            current_app.logger.error("Signin failed for user: %s", email)
            return render_template("accounts/signin.html", error=error), 400
        # If signin is successful, redirect to the dashboard or another page

        current_app.logger.info("Submitted Data: %s", request.form)
        
    return render_template("accounts/signin.html")


# @bp.route("/signup", methods=["GET", "POST"])
# def signup():
#     """Handle user signup."""
    
#     if request.method == "POST":
#         data = request.get_json()
#         username = data.get("username")
#         email = data.get("email")
#         password = data.get("password")

#         if not username or not email or not password:
#             return jsonify({"error": "Missing required fields"}), 400

#         existing_account = Account.query.filter(
#             (Account.username == username) | (Account.email == email)
#         ).first()

#         if existing_account:
#             return jsonify({"error": "Username or email already exists"}), 409

#         new_account = Account(username=username, email=email)
#         new_account.set_password(password)

#         db.session.add(new_account)
#         db.session.commit()

#         return jsonify({"message": "Account created successfully"}), 201

#     return render_template("accounts/signup.html")

