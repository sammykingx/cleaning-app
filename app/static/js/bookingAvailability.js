let availabilityData = {};  // Will store fetched availability


async function fetchAvailability() {
    try {
        const token =
            document.head.querySelector('meta[name="csrf-token"]')?.content || "";
        const res = await fetch('/availability', {
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": token,
            },
        });
        availabilityData = await res.json();
        console.log("Availability data loaded: ", availabilityData);
        updateUnavailableUI();
    } catch (error) {
        console.error("Failed to load availability:", error);
    }
}

function updateUnavailableUI() {
  // Map days to buttons
  document.querySelectorAll('.day-btn').forEach((btn) => {
    const dayName = btn.querySelector('div.text-xs').textContent.trim();
    
    // Find the date in availability data that corresponds
    // to this day of week, We'll map based on the next 7 days
    const today = new Date();
    let matchedDate = null;
    for (let i = 0; i < 7; i++) {
      const dt = new Date();
      dt.setDate(today.getDate() + i);
      const options = { weekday: 'long' };
      if (dt.toLocaleDateString('en-US', options) === dayName) {
        matchedDate = dt.toISOString().slice(0,10);
        break;
      }
    }

    if (
      matchedDate &&
      availabilityData[matchedDate] &&
      availabilityData[matchedDate].length === 0
    ) {
      // No time slots available for this day, gray out

      btn.classList.add("opacity-50", "cursor-not-allowed");
      btn.disabled = true;
    } else {
      btn.classList.remove("opacity-50", "cursor-not-allowed");
      btn.disabled = false;
    }
  });
}

function updateTimeSlotsUI(day) {
  // Find date string for selected day
  const today = new Date();
  let matchedDate = null;
  for (let i = 0; i < 7; i++) {
    const dt = new Date();
    dt.setDate(today.getDate() + i);
    const options = { weekday: 'long' };
    if (dt.toLocaleDateString('en-US', options) === day) {
      matchedDate = dt.toISOString().slice(0,10);
      break;
    }
  }

  const availableSlots = availabilityData[matchedDate] || [];

  document.querySelectorAll('.time-btn').forEach((btn) => {
    const timeLabel = btn.querySelector('div.font-medium').textContent.trim();
    if (!availableSlots.includes(timeLabel)) {
      btn.classList.add('opacity-50', 'cursor-not-allowed');
      btn.disabled = true;
    } else {
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
      btn.disabled = false;
    }
  });
}

// Call this on page load
// document.addEventListener("DOMContentLoaded", fetchAvailability);
