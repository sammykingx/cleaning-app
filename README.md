# 🧼 Cleaning Booking App (Flask + HTMX + Tailwind)

A minimal but extensible single-page cleaning service booking application. Built with **Flask**, **HTMX**, **Tailwind CSS**, and integrated with **Square** for payments. Designed using best practices and clean architecture patterns like the Adapter Pattern for payment gateways, making it easy to maintain, scale, and extend.

---

## ✨ Features

- One-page dynamic booking flow powered by HTMX.
- Tailwind CSS for utility-first, mobile-friendly UI.
- Clean, modular Flask architecture.
- Adapter-based payment integration (Square by default).
- Email notifications to users and admin.
- Easily extendable to support recurring bookings, user accounts, and dashboards.

---

## 📦 Tech Stack

| Layer             | Tool/Tech           |
|------------------|---------------------|
| Backend          | Flask |
| Frontend         | HTMX + Tailwind CSS |
| Database         | SQLite (dev) / PostgreSQL (prod) |
| Payments         | Square (via Adapter Pattern) |
| Notifications    | Flask-Mail (Server SMTP or Custom Provider) |
| Testing          | pytest              |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/sammykingx/cleaning-app.git
cd cleaning-app
```

### 2. Choose any of the following method

#### Using PIP
- Create virtual environment
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
- Install dependencies
```
pip install -r requirements.txt
```

#### Using uv
-  Use any of the commands below
```
uv add -r requirements.txt
uv sync
```

### 3. Configure environment variables
* Create a `.env` file containing the below variables and provide values where necessary in the root directory:
```
SECRET_KEY=your-secret-key
SQLALCHEMY_DATABASE_URI=sqlite:///booking.db

MAIL_SERVER=smtp provider server
MAIL_PORT=smtp port
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password

SQUARE_ACCESS_TOKEN=your-square-token
SQUARE_LOCATION_ID=your-square-location-id
```
* Create a `.flaskenv` file in the root directory
```
FLASK_APP = application entry point
```

### 4. Run the app
- Using flask management script
```bash
flask run
```
- Using python
```bash
python main.py
```
- Using uv
```bash
uv run -- python main.py
```
- Project Requires Python >=3.12
