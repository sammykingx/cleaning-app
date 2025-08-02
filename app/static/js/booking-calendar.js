let currentCalendarDate = new Date();

const maxBookingDate = new Date();
maxBookingDate.setDate(maxBookingDate.getDate() + 45);

// Get the current month and year
export function calendarDisplay() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.getElementById("currentMonth").textContent = `${
    monthNames[currentCalendarDate.getMonth()]
  } ${currentCalendarDate.getFullYear()}`;

  generateCalendarDays();
}

// Navigate calendar months backward
export function previousMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  calendarDisplay();
}

// Navigate calendar months forward
export function nextMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  calendarDisplay();
}

// Generate calendar days
function generateCalendarDays() {
  const calendarDays = document.getElementById("calendarDays");
  calendarDays.innerHTML = "";

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day disabled";
    calendarDays.appendChild(emptyDay);
  }

  // Add days of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayElement = document.createElement("button");
    const currentDate = new Date(year, month, day);
    const isPast = currentDate < today;
    const isBeyondLimit = currentDate > maxBookingDate;
    const pad = (n) => (n < 10 ? "0" + n : n);
    const formattedCurrentDate = `${currentDate.getFullYear()}-${pad(
      currentDate.getMonth() + 1
    )}-${pad(currentDate.getDate())}`;
    const isSelected = bookingData.preferredDay === formattedCurrentDate;

    dayElement.className = `calendar-day p-2 rounded-lg border-2 transition-all duration-200 ${
      isPast || isBeyondLimit
        ? "past cursor-not-allowed"
        : isSelected
        ? "border-primary bg-green-50 text-primary font-bold"
        : "border-gray-200 hover:border-gray-300 hover:shadow-md hover-card"
    }`;

    dayElement.innerHTML = `<div class="text-blue-900 text-xs md:text-sm lg:text-lg font-medium">${day}</div>`;

    if (!isPast && !isBeyondLimit) {
      dayElement.onclick = () => selectDate(currentDate);
    }

    calendarDays.appendChild(dayElement);
  }
}

// Select date
function selectDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // JS months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  bookingData.preferredDay = `${year}-${month}-${day}`;
  bookingData.preferredTime = null; // Reset time selection when date changes

  document.querySelectorAll(".time-btn").forEach((btn) => {
    btn.classList.remove("border-primary", "bg-green-50");
    btn.classList.add("border-gray-100");
  });

  availableTimeByDay();
  updateScheduleSummary();
  calendarDisplay();
  updateNextButton();
}

function availableTimeByDay() {
    const availableTime = availabilityMap[bookingData.preferredDay];
    const timeButtonEls = document.querySelectorAll(".time-btn");

    timeButtonEls.forEach((btn) => {
        const time = btn.getAttribute("data-time"); // 24-hour format
        // const parsed = convertTo24Hour(rawTime);       // e.g. "08:00"

        if (availableTime.includes(time)) {
        btn.classList.remove("cursor-not-allowed", "bg-red-50", "text-gray-400");
        btn.classList.add("hover:border-primary", "text-blue-900");
        btn.disabled = false;
        btn.onclick = (e) => selectTime(time, e);
        } else {
        btn.classList.add("cursor-not-allowed", "bg-red-50", "text-gray-400");
        btn.classList.remove("hover:border-primary");
        btn.disabled = true;
        btn.onclick = null;
        }
    });
}

// Select time
function selectTime(time, event) {
  if (!bookingData.preferredDay) return;
  
  bookingData.preferredTime = time;

    // Update UI
  document.querySelectorAll(".time-btn").forEach((btn) => {
        btn.classList.remove("border-primary", "bg-green-50");
        btn.classList.add("border-gray-100");
  });
    event.target.classList.add("border-primary", "bg-green-50");
    event.target.classList.remove("border-gray-100");

  updateScheduleSummary();
  updateNextButton();

}

// Update schedule summary
function updateScheduleSummary() {
  const summary = document.getElementById("scheduleSummary");
  const scheduleText = document.getElementById("selectedSchedule");

  if (bookingData.preferredDay && bookingData.preferredTime) {
    const date = new Date(bookingData.preferredDay);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = formatTo12Hour(bookingData.preferredTime);
    scheduleText.textContent = `${formattedDate} at ${formattedTime}`;
    bookingData.scheduleText = scheduleText.textContent;
    summary.classList.remove("hidden");
  } else {
    summary.classList.add("hidden");
  }
}

function formatTo12Hour(time24) {
  const [hour, minute] = time24.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")}${period}`;
}

let availabilityMap = null;
export function bookingAvailability() {
  fetch("/availability")
    .then((res) => res.json())
    .then((data) => {
        availabilityMap = data;
       // console.log("Availability data loaded: ", availabilityMap);
      // generateCalendarDays(); // render days with availability in mind
    });
}
