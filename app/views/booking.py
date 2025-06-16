from . import bp

@bp.route('/booking')
def booking():
    return "Booking Page"