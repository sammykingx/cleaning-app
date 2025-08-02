import { bookingAvailability, calendarDisplay } from "./booking-calendar.js";
import { addEventListeners } from "./eventHandlers.js";

document.addEventListener("DOMContentLoaded", function () {
    calendarDisplay();
    addEventListeners();
    bookingAvailability();
});
