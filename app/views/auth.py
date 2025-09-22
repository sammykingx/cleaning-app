from . import bp
from flask import (
    current_app,
    request,
    redirect,
    render_template,
    url_for,
)
from flask_login import login_user, logout_user
from app.helpers import auth_utils
from app.models.accounts import Account


@bp.route("/signin", methods=["GET", "POST"])
def signin():
    """Handle user log in"""

    if request.method == "POST":
        data = request.form.to_dict()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        valid_token = auth_utils.is_valid_csrf(
            data.get("csrf_token")
        )
        error = None

        if not valid_token:
            error = (
                "Corrupt login session, please reload the page"
            )
            return

        if not email or not password:
            error = "Username/Password are required."
            render_template(
                "accounts/signin.html", error=error
            ), 400

        account = Account.query.filter_by(email=email).first()

        if not account:
            error = "Contact adminstrator for support"
            return (
                render_template(
                    "accounts/signin.html", error=error
                ),
                400,
            )

        elif not account.check_password(password):
            error = "invalid username/password"
            return (
                render_template(
                    "accounts/signin.html", error=error
                ),
                400,
            )

        login_user(account)
        next_url = request.args.get("next", None)
        allowed_urls = [
            endpoints.rule
            for endpoints in current_app.url_map.iter_rules()
        ]
        return (
            redirect(next_url)
            if next_url in allowed_urls
            else redirect(url_for("main.admin_dashboard"))
        )

    return render_template("accounts/signin.html")


@bp.route("/signout")
def signout():
    logout_user()
    return redirect(url_for("main.signin"))
