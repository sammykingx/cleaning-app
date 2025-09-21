# app routes and views
from flask import Blueprint

bp = Blueprint("main", __name__)

from . import auth, booking, payments, dashboard
