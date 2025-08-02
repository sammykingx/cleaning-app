import { previousMonth, nextMonth } from "./booking-calendar.js";
import { setClientData, clearClientData, validateField } from "./clientData.js";

export function addEventListeners() {
  // ------------ FREQUENCY EVENT LISTENER ------------------
  document.querySelectorAll(".frequency-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const freq = btn.dataset.frequency;
      selectFrequency(freq, event);
    });
  });

  // ------------ CALENDER EVENT LISTENER ------------------
  document
    .getElementById("prev-month")
    .addEventListener("click", previousMonth);
  document.getElementById("next-month").addEventListener("click", nextMonth);

  // ------------ CLIENT DATA EVENT LISTENERS ------------------
  // Use data attributes to identify the group and field
  document.querySelectorAll("[data-group][data-field]").forEach((input) => {
    input.addEventListener("input", (e) => {
      const group = e.target.dataset.group;
      const field = e.target.dataset.field;
      const value = e.target.value.trim();

        if (validateField(field, value)) {
          setClientData(group, field, value);
          updateNextButton();
      } else {
        // Optionally clear bookingData[group][field] if invalid
        clearClientData(group, field);
      }
    });

    // ------------ VALIDATION EVENT LISTENERS ------------------
    // const emailInput = document.getElementById("email");
    // const phoneInput = document.getElementById("phone");

    // // Add listeners (debounced input + blur for final check)
    // emailInput.addEventListener("input", debounce(validateEmail, 300));
    // emailInput.addEventListener("blur", validateEmail);

    // phoneInput.addEventListener("input", debounce(validatePhone, 300));
    // phoneInput.addEventListener("blur", validatePhone);

    //firstNameInput.addEventListener("input", debounce(validateName, 300));
    // lastNameInput.addEventListener("input", debounce(validateName, 300));
  });
}

