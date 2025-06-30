# application entry point
from flask import render_template
from app import create_app
# import production configurations


app = create_app()
    
@app.route('/')
def index():
    """Home route for the Cleaning App."""
    
    return render_template("index.html")
    

if __name__ == "__main__":
    app.run()
