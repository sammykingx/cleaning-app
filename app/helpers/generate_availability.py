from datetime import datetime, timedelta
import random

TIME_SLOTS = ["8:00", "11:00", "13:00", "15:00",]

def generate_sample_availability():
    today = datetime.today().date()
    availability = {}

    for i in range(46):  # 0 to 45
        date = today + timedelta(days=i)
        date_str = date.isoformat()

        # Simulate some slots being booked
        available = TIME_SLOTS.copy()
        booked_count = random.randint(0, 3)
        booked = random.sample(available, k=booked_count)
        for b in booked:
            available.remove(b)

        availability[date_str] = available

    return availability
