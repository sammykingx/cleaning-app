from . import bp


@bp.route("/payments")
def payments():
    return "Payments Page"
