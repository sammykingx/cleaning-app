# application entry point
from flask import redirect, render_template
from app import create_app
from app.constants import HOME_URL
# import production configurations


app = create_app()

@app.errorhandler(404)
def handle_404(e):
    return redirect(HOME_URL), 302

@app.errorhandler(405)
def handle_404(e):
    return redirect(HOME_URL), 302
   
@app.route('/')
def index():
    """Home route for the Cleaning App."""
    
    return render_template("index.html")
    

if __name__ == "__main__":
    app.run()
