from . import create_app, db

app = create_app()

with app.app_context():
    # create database tables
    print("Inside DB Context")
    db.create_all()
    print(f"Database tables created successfully.")
