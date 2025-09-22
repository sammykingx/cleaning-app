# application entry point
from flask import redirect, render_template
from app import create_app
from app.constants import HOME_URL

# import production configurations


application = create_app()


@application.errorhandler(404)
def handle_404(e):
    return redirect(HOME_URL), 302


@application.errorhandler(405)
def handle_404(e):
    return redirect(HOME_URL), 302


@application.route("/loading")
def loading():
    return render_template("loading.html")


@application.route("/")
def index():
    """Home route for the Cleaning App."""

    return render_template("index.html")


if __name__ == "__main__":
    application.run()
