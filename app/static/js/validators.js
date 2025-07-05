// Validates Contact Infomation
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const firstNameErr = document.getElementById("firstName-error");
const lastNameErr = document.getElementById("lastName-error");

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(`Entered email: ${email}`);
    return re.test(email);
};

function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  const re = /^(?:\+1|1)?[2-9]\d{2}[2-9]\d{6}$/;
  return re.test(cleaned);
};

function isValidName(name) {
  // Only letters, at least 3 characters
  const re = /^[A-Za-z]{3,}$/;
  return re.test(name);
}
// Helper to debounce input events
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

// Real-time validation handlers
function validateEmail() {
  let email = emailInput.value.trim();
  if (email && !isValidEmail(email)) {
      emailError.textContent = "Invalid email format.";
  } else {
    emailError.textContent = "";
    }
    console.log(email);
};

function validatePhone() {
  const phone = phoneInput.value.trim();
  if (phone && !isValidPhone(phone)) {
      phoneError.textContent = "Invalid phone number.";
      phoneInput.textContent = "";
  } else {
    phoneError.textContent = "";
  }
};

function validateName() {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    if (firstName && !isValidName(firstName)) {
        firstNameErr.textContent = "Invalid first name";
        
    } else {
        firstNameErr.textContent = "";
    }

    if (lastName && !isValidName(lastName)) {
        lastNameErr.textContent = "Invalid last name";
        console.log(isValidEmail(lastName));
    } else {
        lastName.textContent = "";
    }
}
// Add listeners (debounced input + blur for final check)
emailInput.addEventListener("input", debounce(validateEmail, 300));
emailInput.addEventListener("blur", validateEmail);

phoneInput.addEventListener("input", debounce(validatePhone, 300));
phoneInput.addEventListener("blur", validatePhone);

//firstNameInput.addEventListener("input", debounce(validateName, 300));
// lastNameInput.addEventListener("input", debounce(validateName, 300));