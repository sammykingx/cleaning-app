import {
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePhone,
} from "./validators.js";

export function setClientData(group, field, value) {
    const allowedGroups = ["personalInfo", "address"];

    if (!allowedGroups.includes(group)) return;

    bookingData[group][field] = value;
}

export function clearClientData(group, field) {
  if (bookingData[group] && field in bookingData[group]) {
    bookingData[group][field] = "";
  }
}

export function validateField(field, value) {
    switch (field) {
        case "firstName":
            return validateFirstName(value);
        
        case "lastName":
            return validateLastName(value);
        
        case "email":
            return validateEmail(value);
        
        case "phone":
            return validatePhone(value);
        
        default:
            return true;
            //return value.length > 0; // For street, city, state, etc.
    }
}
