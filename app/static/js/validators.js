// Validates Contact Infomation

const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const firstNameErr = document.getElementById("firstName-error");
const lastNameErr = document.getElementById("lastName-error");

export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  const re = /^(?:\+1|1)?[2-9]\d{2}[2-9]\d{6}$/;
  return re.test(cleaned);
}

export function isValidName(name) {
  // Only letters, at least 3 characters
  const re = /^[A-Za-z]{3,}$/;
  return re.test(name);
}
// Helper to debounce input events
export function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Real-time validation handlers
export function validateEmail() {
  let email = emailInput.value.trim();
  const isValid = isValidEmail(email);

  if (email && !isValid) {
    emailError.textContent = "Invalid email format.";
  } else {
    emailError.textContent = "";
  }
  return isValid;
}

export function validatePhone() {
  const phone = phoneInput.value.trim();
  const isValid = isValidPhone(phone);
  if (phone && !isValid) {
    phoneError.textContent = "Invalid phone number.";
    phoneInput.textContent = "";
  } else {
    phoneError.textContent = "";
  }
  return isValid;
}

export function validateFirstName() {
  const firstName = firstNameInput.value.trim();
  const isValid = isValidName(firstName);
  if (firstName && !isValid) {
    firstNameErr.textContent = "Invalid first name";
  } else {
    firstNameErr.textContent = "";
  }
  return isValid;
}

export function validateLastName() {
  const lastName = lastNameInput.value.trim();
  const isValid = isValidName(lastName);
  if (lastName && !isValid) {
    lastNameErr.textContent = "Invalid last name";
  } else {
    lastNameErr.textContent = "";
  }
  return isValid;
}
