# serializer module
from datetime import datetime


def serialize_booking(booking_data: dict):

    date_str = booking_data.get("preferredDay")
    time_str = booking_data.get("preferredTime")

    cleaning_date_obj = datetime.strptime(
        f"{date_str} {time_str}", "%Y-%m-%d %H:%M"
    )

    serialized_data = {
        "service": {"name": booking_data.get("service")},
        "category": booking_data.get("category"),
        "cleaning_date": cleaning_date_obj,
        "additional_info": booking_data.get("additionalInfo"),
        "client_info": {
            "first_name": booking_data["personalInfo"][
                "firstName"
            ],
            "last_name": booking_data["personalInfo"][
                "lastName"
            ],
            "email": booking_data["personalInfo"]["email"],
            "phone": booking_data["personalInfo"]["phone"],
        },
        "address": {
            "street": booking_data["address"].get("street"),
            "city": booking_data["address"].get("city"),
            "state": booking_data["address"].get("state"),
        },
        "price": booking_data.get("price"),
        "add_ons": booking_data.get("addOns", []),
        "frequency": booking_data.get("frequency", "One-time"),
    }

    if (
        booking_data.get("category").lower()
        == "residential cleaning"
    ):
        serialized_data["service"]["bathrooms"] = (
            booking_data.get("bathrooms", 0)
        )
        serialized_data["service"]["bedrooms"] = (
            booking_data.get("bedrooms", 0)
        )
        serialized_data["service"]["extra_bedroom"] = (
            booking_data.get("extraBed", 0)
        )
        serialized_data["service"]["extra_bathroom"] = (
            booking_data.get("extraBath", 0)
        )

    return serialized_data
