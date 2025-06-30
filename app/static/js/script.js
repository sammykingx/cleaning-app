// let bookingData = {
//   category: "",
//   service: "",
//   bedrooms: 1,
//   maxBathroom: 1,
//   extraBed: 0,
//   extraBath: 0,
//   frequency: "",
//   addOns: [],
//   preferredDay: "",
//   preferredTime: "",
//   personalInfo: {
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//   },
//   address: {
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//   },
//   price: 0,
//   additionalInfo: "",
// };

// let currentStep = 1;
// let totalPrice = 0;

// // Service categories
// const serviceCategories = {
//   "Residential Cleaning": [
//     "Regular House Cleaning",
//     "Deep Cleaning",
//     "Move-in/Move-out Cleaning",
//   ],
//   "Commercial Cleaning": [
//     "Small Office Cleaning",
//     "Medium Office Cleaning",
//     "Large Office Cleaning",
//     "Post Renovation Cleaning",
//   ],
//   Laundry: ["Wash & Fold", "Dry Cleaning", "Pickup & Drop-off"],
// };

// // Service price map
// const servicePriceMap = {
//   "Regular House Cleaning": 85,
//   "Deep Cleaning": 150,
//   "Move-in/Move-out Cleaning": 140,
//   "Small Office Cleaning": 150,
//   "Medium Office Cleaning": 200,
//   "Large Office Cleaning": 350,
//   "Post Renovation Cleaning": 390,
//   "Wash & Fold": 60,
// };

// // Frequency multipliers
// const frequencyMultipliers = {
//   weekly: 1.0,
//   "bi-weekly": 0.9,
//   monthly: 0.8,
// };

// // Calculate base price
// function getBasePrice() {
//   //const service = bookingData.service;
//   // const bedroomPrice = 90 + (bedrooms - 1) * 25;
//   // const bathroomPrice = (bathrooms - 1) * 15;
//   // let base = bedroomPrice + bathroomPrice;
//   const selectedService = bookingData.service;

//   totalPrice = servicePriceMap[selectedService] || 0; // Default to $0
//   return totalPrice;
// }

// // Get bedroom price based on service and number of bedrooms
// function getBedroomPrice(num) {
//   const bedroomPriceMap = {
//     "Regular House Cleaning": {
//       2: totalPrice + (120 - totalPrice),
//       3: totalPrice + (150 - totalPrice),
//       4: totalPrice + (200 - totalPrice),
//     },
//     "Deep Cleaning": {
//       2: totalPrice + (200 - totalPrice),
//       3: totalPrice + (260 - totalPrice),
//       4: totalPrice + (320 - totalPrice),
//       5: totalPrice + (350 - totalPrice),
//     },
//     "Move-in/Move-out Cleaning": {
//       2: totalPrice + (160 - totalPrice),
//       3: totalPrice + (220 - totalPrice),
//       4: totalPrice + (400 - totalPrice),
//       5: totalPrice + (330 - totalPrice),
//     },
//   };
//   const value = bedroomPriceMap[bookingData.service]?.[num] ?? 0;
//   console.log(
//     `selected service = ${bookingData.service}, bedroom price= ${value}`
//   );
//   return value;
// }

// // Updates Service UI on the property screen
// function updateServiceUI(className) {
//   // Update UI
//   console.log(className);
//   document.querySelectorAll(className).forEach((btn) => {
//     btn.classList.remove("border-blue-100", "border-blue-700");
//     btn.classList.add("border-gray-100");
//   });
//   event.target.classList.add("border-blue-700");
//   event.target.classList.remove("border-gray-100");
// }

// // display summary
// function displaySummary() {
//   document.getElementById("bedroomDisplay").textContent = bookingData.bedrooms;
//   document.getElementById("bathroomDisplay").textContent =
//     bookingData.maxBathroom;

//   document.getElementById(
//     "displaySelectedService"
//   ).textContent = `Service: ${bookingData.service}`;

//   if (bookingData.extraBed > 0) {
//     document.getElementById(
//       "displayExtraBed"
//     ).textContent = `Extra Living Area: ${bookingData.extraBed}`;
//     //console.log(`Extra Living Area: ${bookingData.extraBed}`);
//   }

//   if (bookingData.extraBath > 0) {
//     document.getElementById(
//       "displayExtraBath"
//     ).textContent = `Extra Bathrooms: ${bookingData.extraBath}`;
//     //console.log(`Extra Bathroom: ${bookingData.extraBath}`)
//   }
// }

// // Update total price
// function updateTotalPrice() {
//   //const basePrice = getBasePrice();
//   const basePrice =
//     bookingData.bedrooms > 1
//       ? getBedroomPrice(bookingData.bedrooms) // if greater than one
//       : getBasePrice();
//   const frequencyMultiplier = bookingData.frequency
//     ? frequencyMultipliers[bookingData.frequency]
//     : 1;
//   const addOnPrice = bookingData.addOns.length * 30;
//   totalPrice = Math.round(basePrice * frequencyMultiplier + addOnPrice + 0);

//   document.getElementById("totalPrice").textContent = "$" + totalPrice;
//   document.getElementById("finalPrice").textContent = totalPrice;

//   // Update frequency prices
//   document.getElementById("weeklyPrice").textContent =
//     "$" + Math.round(basePrice * 1.0);
//   document.getElementById("biWeeklyPrice").textContent =
//     "$" + Math.round(basePrice * 0.9);
//   document.getElementById("monthlyPrice").textContent =
//     "$" + Math.round(basePrice * 0.8);

//   // Update base price display
//   document.getElementById("basePrice").textContent = "$" + basePrice;
// }

// // Update progress
// function updateProgress() {
//   const progress = (currentStep / 6) * 100;
//   document.getElementById(
//     "stepIndicator"
//   ).textContent = `Step ${currentStep} of 6`;
//   document.getElementById("progressPercent").textContent = `${Math.round(
//     progress
//   )}% complete`;
//   document.getElementById("progressBar").style.width = `${progress}%`;
// }

// // Select category
// function selectCategory(category) {
//   bookingData.category = category;

//   // Update UI, the one i like
//   document.querySelectorAll(".category-btn").forEach((btn) => {
//     btn.classList.remove("border-primary");
//     btn.classList.add("border-gray-200");
//   });
//   event.target.closest(".category-btn").classList.add("border-primary");
//   event.target.closest(".category-btn").classList.remove("border-gray-200");

//   // Show service options
//   const serviceSelection = document.getElementById("serviceSelection");
//   const serviceOptions = document.getElementById("serviceOptions");
//   serviceOptions.innerHTML = "";

//   serviceCategories[category].forEach((service) => {
//     const button = document.createElement("button");
//     button.className =
//       "service-btn p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 text-left hover:shadow-md hover-card";
//     button.onclick = () => selectService(service);
//     button.innerHTML = `<span class="font-medium text-blue-900">${service}</span>`;
//     serviceOptions.appendChild(button);
//   });

//   serviceSelection.classList.remove("hidden");
//   updateNextButton();
// }

// // Select service
// function selectService(service) {
//   bookingData.service = service;
//   // Update total price
//   updateTotalPrice();

//   // Update UI
//   document.querySelectorAll(".service-btn").forEach((btn) => {
//     btn.classList.remove("border-primary", "bg-green-50");
//     btn.classList.add("border-gray-200");
//   });
//   event.target.classList.add("border-primary");
//   event.target.classList.remove("border-gray-200");
//   //updateServiceUI();
//   updateNextButton();
// }

// // Select bedrooms
// function selectBedrooms(num) {
//   bookingData.bedrooms = num;
//   bookingData.maxBathroom = num;

//   document.querySelectorAll(".bedroom-btn").forEach((btn) => {
//     btn.classList.remove("border-blue-50", "border-blue-600");
//     btn.classList.add("border-gray-100");
//   });
//   event.target.classList.add("border-blue-600");
//   event.target.classList.remove("border-gray-100");
//   displaySummary();
//   updateTotalPrice();
//   updateNextButton();
// }

// // Select Extra Bedroom
// function extraBedrooms(num) {
//   bookingData.extraBed = num;
//   displaySummary();
//   updateServiceUI(".extraBed-btn");
//   updateTotalPrice();
//   updateNextButton();
// }

// // Select Extra bathrooms
// function extraBathrooms(num) {
//   bookingData.extraBath = num;

//   // Update UI
//   // document.querySelectorAll(".bathroom-btn").forEach((btn) => {
//   //   btn.classList.remove("border-primary", "bg-green-50");
//   //   btn.classList.add("border-gray-200");
//   // });
//   // event.target.classList.add("border-primary", "bg-green-50");
//   // event.target.classList.remove("border-gray-200");

//   displaySummary();
//   updateServiceUI(".extraBath-btn");
//   updateTotalPrice();
//   updateNextButton();
// }

// // Select frequency
// function selectFrequency(frequency) {
//   bookingData.frequency = frequency;

//   // Update UI
//   document.querySelectorAll(".frequency-btn").forEach((btn) => {
//     btn.classList.remove("border-primary", "bg-green-50");
//     btn.classList.add("border-gray-200");
//   });
//   event.target.classList.add("border-primary", "bg-green-50");
//   event.target.classList.remove("border-gray-200");

//   updateTotalPrice();
//   updateNextButton();
// }

// // Toggle add-on
// function toggleAddOn(addOn) {
//   const index = bookingData.addOns.indexOf(addOn);
//   const button = event.target.closest(".addon-btn");

//   if (index > -1) {
//     bookingData.addOns.splice(index, 1);
//     button.classList.remove("border-primary", "bg-green-50");
//     button.classList.add("border-gray-200");
//   } else {
//     bookingData.addOns.push(addOn);
//     button.classList.add("border-primary", "bg-green-50");
//     button.classList.remove("border-gray-200");
//   }

//   // Update add-on summary
//   const summary = document.getElementById("addOnSummary");
//   const count = document.getElementById("addOnCount");
//   const total = document.getElementById("addOnTotal");

//   if (bookingData.addOns.length > 0) {
//     summary.classList.remove("hidden");
//     count.textContent = bookingData.addOns.length;
//     total.textContent = "+$" + bookingData.addOns.length * 30;
//   } else {
//     summary.classList.add("hidden");
//   }

//   updateTotalPrice();
//   updateNextButton();
// }

// // Select day
// function selectDay(day) {
//   bookingData.preferredDay = day;

//   // Update UI
//   document.querySelectorAll(".day-btn").forEach((btn) => {
//     btn.classList.remove("border-primary", "bg-green-50");
//     btn.classList.add("border-gray-200");
//   });
//   event.target.classList.add("border-primary", "bg-green-50");
//   event.target.classList.remove("border-gray-200");

//   updateScheduleSummary();
//   updateNextButton();
// }

// // Select time
// function selectTime(time) {
//   bookingData.preferredTime = time;

//   // Update UI
//   document.querySelectorAll(".time-btn").forEach((btn) => {
//     btn.classList.remove("border-primary", "bg-green-50");
//     btn.classList.add("border-gray-200");
//   });
//   event.target.classList.add("border-primary", "bg-green-50");
//   event.target.classList.remove("border-gray-200");

//   updateScheduleSummary();
//   updateNextButton();
// }

// // Update schedule summary
// function updateScheduleSummary() {
//   const summary = document.getElementById("scheduleSummary");
//   const daySpan = document.getElementById("selectedDay");
//   const timeSpan = document.getElementById("selectedTime");

//   if (bookingData.preferredDay && bookingData.preferredTime) {
//     daySpan.textContent = bookingData.preferredDay;
//     timeSpan.textContent = bookingData.preferredTime;
//     summary.classList.remove("hidden");
//   } else {
//     summary.classList.add("hidden");
//   }
// }

// // Check if can proceed
// function canProceed() {
//   switch (currentStep) {
//     case 1:
//       return bookingData.category && bookingData.service;
//     case 2:
//       return bookingData.bedrooms && bookingData.bathrooms;
//     case 3:
//       return bookingData.frequency;
//     case 4:
//       return true; // Add-ons are optional
//     case 5:
//       return bookingData.preferredDay && bookingData.preferredTime;
//     case 6:
//       const firstName = document.getElementById("firstName").value;
//       const lastName = document.getElementById("lastName").value;
//       const email = document.getElementById("email").value;
//       const phone = document.getElementById("phone").value;
//       const street = document.getElementById("street").value;
//       const city = document.getElementById("city").value;
//       const state = document.getElementById("state").value;
//       const zipCode = document.getElementById("zipCode").value;

//       return (
//         firstName &&
//         lastName &&
//         email &&
//         phone &&
//         street &&
//         city &&
//         state &&
//         zipCode
//       );
//     default:
//       return false;
//   }
// }

// // Update next button
// function updateNextButton() {
//   const nextBtn = document.getElementById("nextBtn");
//   const bookBtn = document.getElementById("bookBtn");

//   if (currentStep < 6) {
//     if (canProceed()) {
//       nextBtn.classList.remove(
//         "bg-gray-300",
//         "text-gray-500",
//         "cursor-not-allowed"
//       );
//       nextBtn.classList.add(
//         "bg-primary",
//         "text-white",
//         "hover:bg-accent",
//         "hover:shadow-lg"
//       );
//     } else {
//       nextBtn.classList.add(
//         "bg-gray-300",
//         "text-gray-500",
//         "cursor-not-allowed"
//       );
//       nextBtn.classList.remove(
//         "bg-primary",
//         "text-white",
//         "hover:bg-green-800",
//         "hover:shadow-lg"
//       );
//     }
//   } else {
//     if (canProceed()) {
//       bookBtn.classList.remove(
//         "bg-gray-300",
//         "text-gray-500",
//         "cursor-not-allowed"
//       );
//       bookBtn.classList.add(
//         "bg-primary",
//         "text-white",
//         "hover:bg-green-800",
//         "hover:shadow-lg"
//       );
//     } else {
//       bookBtn.classList.add(
//         "bg-gray-300",
//         "text-gray-500",
//         "cursor-not-allowed"
//       );
//       bookBtn.classList.remove(
//         "bg-primary",
//         "text-white",
//         "hover:bg-green-800",
//         "hover:shadow-lg"
//       );
//     }
//   }
// }

// // Next step
// function nextStep() {
//   if (!canProceed()) return;

//   if (currentStep < 6) {
//     document.getElementById(`step${currentStep}`).classList.remove("active");
//     currentStep++;
//     document.getElementById(`step${currentStep}`).classList.add("active");

//     updateProgress();

//     // Show/hide navigation buttons
//     if (currentStep > 1) {
//       document.getElementById("prevBtn").classList.remove("hidden");
//     }

//     if (currentStep === 6) {
//       document.getElementById("nextBtn").classList.add("hidden");
//       document.getElementById("bookBtn").classList.remove("hidden");
//     }

//     updateNextButton();
//   }
// }

// // Previous step
// function prevStep() {
//   if (currentStep > 1) {
//     document.getElementById(`step${currentStep}`).classList.remove("active");
//     currentStep--;
//     document.getElementById(`step${currentStep}`).classList.add("active");

//     updateProgress();

//     // Show/hide navigation buttons
//     if (currentStep === 1) {
//       document.getElementById("prevBtn").classList.add("hidden");
//     }

//     if (currentStep < 6) {
//       document.getElementById("nextBtn").classList.remove("hidden");
//       document.getElementById("bookBtn").classList.add("hidden");
//     }

//     updateNextButton();
//   }
// }

// // Handle booking
// function handleBooking() {
//   if (!canProceed()) return;

//   // Collect personal information
//   bookingData.personalInfo = {
//     firstName: document.getElementById("firstName").value,
//     lastName: document.getElementById("lastName").value,
//     email: document.getElementById("email").value,
//     phone: document.getElementById("phone").value,
//   };

//   bookingData.address = {
//     street: document.getElementById("street").value,
//     city: document.getElementById("city").value,
//     state: document.getElementById("state").value,
//     zipCode: document.getElementById("zipCode").value,
//   };

//   bookingData.additionalInfo = document.getElementById("additionalInfo").value;

//   // Show booking complete modal
//   document.getElementById("confirmedTotal").textContent = "$" + totalPrice;
//   document.getElementById(
//     "confirmedSchedule"
//   ).textContent = `${bookingData.preferredDay} at ${bookingData.preferredTime}`;
//   document.getElementById("bookingComplete").classList.remove("hidden");

//   console.log("Booking Data:", bookingData);
// }

// // Reset booking
// function resetBooking() {
//   // Reset data
//   bookingData = {
//     category: "",
//     service: "",
//     bedrooms: 1,
//     bathrooms: 1,
//     frequency: "",
//     addOns: [],
//     preferredDay: "",
//     preferredTime: "",
//     personalInfo: { firstName: "", lastName: "", email: "", phone: "" },
//     address: { street: "", city: "", state: "", zipCode: "" },
//     additionalInfo: "",
//   };

//   currentStep = 1;
//   totalPrice = 90;

//   // Reset UI
//   document.getElementById("bookingComplete").classList.add("hidden");
//   document
//     .querySelectorAll(".step")
//     .forEach((step) => step.classList.remove("active"));
//   document.getElementById("step1").classList.add("active");

//   // Reset form fields
//   document
//     .querySelectorAll("input, textarea")
//     .forEach((field) => (field.value = ""));

//   // Reset buttons
//   document
//     .querySelectorAll(
//       ".category-btn, .service-btn, .bedroom-btn, .bathroom-btn, .frequency-btn, .addon-btn, .day-btn, .time-btn"
//     )
//     .forEach((btn) => {
//       btn.classList.remove("border-primary", "bg-green-50");
//       btn.classList.add("border-gray-200");
//     });

//   // Hide service selection and summaries
//   document.getElementById("serviceSelection").classList.add("hidden");
//   document.getElementById("addOnSummary").classList.add("hidden");
//   document.getElementById("scheduleSummary").classList.add("hidden");

//   // Reset navigation
//   document.getElementById("prevBtn").classList.add("hidden");
//   document.getElementById("nextBtn").classList.remove("hidden");
//   document.getElementById("bookBtn").classList.add("hidden");

//   updateProgress();
//   updateTotalPrice();
//   updateNextButton();
// }

// // Add event listeners for form validation
// document.addEventListener("DOMContentLoaded", function () {
//   const formFields = [
//     "firstName",
//     "lastName",
//     "email",
//     "phone",
//     "street",
//     "city",
//     "state",
//     "zipCode",
//   ];
//   formFields.forEach((fieldId) => {
//     document
//       .getElementById(fieldId)
//       .addEventListener("input", updateNextButton);
//   });

//   updateTotalPrice();
//   updateNextButton();
// });


// prev step i
let bookingData = {
  category: "",
  service: "",
  bedrooms: 1,
  maxBathroom: 1,
  extraBed: 0,
  extraBath: 0,
  frequency: "",
  addOns: [],
  preferredDay: "",
  preferredTime: "",
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
  },
  price: 0,
  additionalInfo: "",
};

let currentStep = 1;
let totalPrice = 0;

// Service categories
const serviceCategories = {
  "Residential Cleaning": [
    "Regular House Cleaning",
    "Deep Cleaning",
    "Move-in/Move-out Cleaning",
  ],
  "Commercial Cleaning": [
    "Small Office Cleaning",
    "Medium Office Cleaning",
    "Large Office Cleaning",
    "Post Renovation Cleaning",
  ],
  Laundry: ["Wash & Fold", "Dry Cleaning", "Pickup & Drop-off"],
};

// Service price map
const servicePriceMap = {
  "Regular House Cleaning": 85,
  "Deep Cleaning": 150,
  "Move-in/Move-out Cleaning": 140,
  "Small Office Cleaning": 150,
  "Medium Office Cleaning": 200,
  "Large Office Cleaning": 350,
  "Post Renovation Cleaning": 390,
  "Wash & Fold": 60,
};

// Frequency multipliers
const frequencyMultipliers = {
  weekly: 1.0,
  "bi-weekly": 0.9,
  monthly: 0.8,
};

// Calculate base price
function getBasePrice() {
  //const service = bookingData.service;
  // const bedroomPrice = 90 + (bedrooms - 1) * 25;
  // const bathroomPrice = (bathrooms - 1) * 15;
  // let base = bedroomPrice + bathroomPrice;
  const selectedService = bookingData.service;

  totalPrice = servicePriceMap[selectedService] || 0; // Default to $0
  return totalPrice;
}

// Get bedroom price based on service and number of bedrooms
function getBedroomPrice(num) {
  const bedroomPriceMap = {
    "Regular House Cleaning": {
      2: totalPrice + (120 - totalPrice),
      3: totalPrice + (150 - totalPrice),
      4: totalPrice + (200 - totalPrice),
    },
    "Deep Cleaning": {
      2: totalPrice + (200 - totalPrice),
      3: totalPrice + (260 - totalPrice),
      4: totalPrice + (320 - totalPrice),
      5: totalPrice + (350 - totalPrice),
    },
    "Move-in/Move-out Cleaning": {
      2: totalPrice + (160 - totalPrice),
      3: totalPrice + (220 - totalPrice),
      4: totalPrice + (400 - totalPrice),
      5: totalPrice + (330 - totalPrice),
    },
  };
  const value = bedroomPriceMap[bookingData.service]?.[num] ?? 0;
  console.log(
    `selected service = ${bookingData.service}, bedroom price= ${value}`
  );
  return value;
}

// Updates Service UI on the property screen
function updateServiceUI() {
  // Update UI
  document.querySelectorAll(".bedroom-btn").forEach((btn) => {
    btn.classList.remove("border-blue-100", "border-blue-700");
    btn.classList.add("border-gray-100");
  });
  event.target.classList.add("border-blue-700");
  event.target.classList.remove("border-gray-100");
}

// display summary
function displaySummary() {
  document.getElementById("bedroomDisplay").textContent = bookingData.bedrooms;
  document.getElementById("bathroomDisplay").textContent =
    bookingData.maxBathroom;

  document.getElementById(
    "displaySelectedService"
  ).textContent = `Service: ${bookingData.service}`;

  if (bookingData.extraBed > 0) {
    document.getElementById(
      "displayExtraBed"
    ).textContent = `Extra Living Area: ${bookingData.extraBed}`;
    console.log(`Extra Living Area: ${bookingData.extraBed}`);
  }

  if (bookingData.extraBath > 0) {
    document.getElementById(
      "displayExtraBath"
    ).textContent = `Extra Bathrooms: ${bookingData.extraBath}`;
    console.log(`Extra Bathroom: ${bookingData.extraBath}`);
  }
}

// Update total price
function updateTotalPrice() {
  //const basePrice = getBasePrice();
  const basePrice =
    bookingData.bedrooms > 1
      ? getBedroomPrice(bookingData.bedrooms) // if greater than one
      : getBasePrice();
  const frequencyMultiplier = bookingData.frequency
    ? frequencyMultipliers[bookingData.frequency]
    : 1;
  const addOnPrice = bookingData.addOns.length * 30;
  totalPrice = Math.round(basePrice * frequencyMultiplier + addOnPrice + 0);

  document.getElementById("totalPrice").textContent = "$" + totalPrice;
  document.getElementById("finalPrice").textContent = totalPrice;

  // Update frequency prices
  document.getElementById("weeklyPrice").textContent =
    "$" + Math.round(basePrice * 1.0);
  document.getElementById("biWeeklyPrice").textContent =
    "$" + Math.round(basePrice * 0.9);
  document.getElementById("monthlyPrice").textContent =
    "$" + Math.round(basePrice * 0.8);

  // Update base price display
  document.getElementById("basePrice").textContent = "$" + basePrice;
}

// Update progress
function updateProgress() {
  const progress = (currentStep / 6) * 100;
  document.getElementById(
    "stepIndicator"
  ).textContent = `Step ${currentStep} of 6`;
  document.getElementById("progressPercent").textContent = `${Math.round(
    progress
  )}% complete`;
  document.getElementById("progressBar").style.width = `${progress}%`;
}

// Select category
function selectCategory(category) {
  bookingData.category = category;

  // Update UI, the one i like
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.remove("border-primary");
    btn.classList.add("border-gray-200");
  });
  event.target.closest(".category-btn").classList.add("border-primary");
  event.target.closest(".category-btn").classList.remove("border-gray-200");

  // Show service options
  const serviceSelection = document.getElementById("serviceSelection");
  const serviceOptions = document.getElementById("serviceOptions");
  serviceOptions.innerHTML = "";

  serviceCategories[category].forEach((service) => {
    const button = document.createElement("button");
    button.className =
      "service-btn p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 text-left hover:shadow-md hover-card";
    button.onclick = () => selectService(service);
    button.innerHTML = `<span class="font-medium text-blue-900">${service}</span>`;
    serviceOptions.appendChild(button);
  });

  serviceSelection.classList.remove("hidden");
  updateNextButton();
}

// Select service
function selectService(service) {
  bookingData.service = service;
  // Update total price
  updateTotalPrice();

  // Update UI
  document.querySelectorAll(".service-btn").forEach((btn) => {
    btn.classList.remove("border-primary", "bg-green-50");
    btn.classList.add("border-gray-200");
  });
  event.target.classList.add("border-primary");
  event.target.classList.remove("border-gray-200");
  //updateServiceUI();
  updateNextButton();
}

// Select bedrooms
function selectBedrooms(num) {
  bookingData.bedrooms = num;
  bookingData.maxBathroom = num;

  document.querySelectorAll(".bedroom-btn").forEach((btn) => {
    btn.classList.remove("border-blue-50", "border-blue-600");
    btn.classList.add("border-gray-100");
  });
  event.target.classList.add("border-blue-600");
  event.target.classList.remove("border-gray-100");
  displaySummary();
  updateTotalPrice();
  updateNextButton();
}

// Select Extra Bedroom
function extraBedrooms(num) {
  bookingData.extraBed = num;
  displaySummary();
  updateServiceUI();
  updateTotalPrice();
  updateNextButton();
}

// Select Extra bathrooms
function extraBathrooms(num) {
  bookingData.extraBath = num;

  // Update UI
  // document.querySelectorAll(".bathroom-btn").forEach((btn) => {
  //   btn.classList.remove("border-primary", "bg-green-50");
  //   btn.classList.add("border-gray-200");
  // });
  // event.target.classList.add("border-primary", "bg-green-50");
  // event.target.classList.remove("border-gray-200");

  displaySummary();
  updateServiceUI();
  updateTotalPrice();
  updateNextButton();
}

function addLivingArea(num) {
  const extraLivingArea = 35 * num;
}

// Select frequency
function selectFrequency(frequency) {
  bookingData.frequency = frequency;

  // Update UI
  document.querySelectorAll(".frequency-btn").forEach((btn) => {
    btn.classList.remove("border-primary", "bg-green-50");
    btn.classList.add("border-gray-200");
  });
  event.target.classList.add("border-primary", "bg-green-50");
  event.target.classList.remove("border-gray-200");

  updateTotalPrice();
  updateNextButton();
}

// Toggle add-on
function toggleAddOn(addOn) {
  const index = bookingData.addOns.indexOf(addOn);
  const button = event.target.closest(".addon-btn");

  if (index > -1) {
    bookingData.addOns.splice(index, 1);
    button.classList.remove("border-primary", "bg-green-50");
    button.classList.add("border-gray-200");
  } else {
    bookingData.addOns.push(addOn);
    button.classList.add("border-primary", "bg-green-50");
    button.classList.remove("border-gray-200");
  }

  // Update add-on summary
  const summary = document.getElementById("addOnSummary");
  const count = document.getElementById("addOnCount");
  const total = document.getElementById("addOnTotal");

  if (bookingData.addOns.length > 0) {
    summary.classList.remove("hidden");
    count.textContent = bookingData.addOns.length;
    total.textContent = "+$" + bookingData.addOns.length * 30;
  } else {
    summary.classList.add("hidden");
  }

  updateTotalPrice();
  updateNextButton();
}

// Select day
function selectDay(day) {
  bookingData.preferredDay = day;

  // Update UI
  document.querySelectorAll(".day-btn").forEach((btn) => {
    btn.classList.remove("border-primary", "bg-green-50");
    btn.classList.add("border-gray-200");
  });
  event.target.classList.add("border-primary", "bg-green-50");
  event.target.classList.remove("border-gray-200");

  updateScheduleSummary();
  updateNextButton();
}

// Select time
function selectTime(time) {
  bookingData.preferredTime = time;

  // Update UI
  document.querySelectorAll(".time-btn").forEach((btn) => {
    btn.classList.remove("border-primary", "bg-green-50");
    btn.classList.add("border-gray-200");
  });
  event.target.classList.add("border-primary", "bg-green-50");
  event.target.classList.remove("border-gray-200");

  updateScheduleSummary();
  updateNextButton();
}

// Update schedule summary
function updateScheduleSummary() {
  const summary = document.getElementById("scheduleSummary");
  const daySpan = document.getElementById("selectedDay");
  const timeSpan = document.getElementById("selectedTime");

  if (bookingData.preferredDay && bookingData.preferredTime) {
    daySpan.textContent = bookingData.preferredDay;
    timeSpan.textContent = bookingData.preferredTime;
    summary.classList.remove("hidden");
  } else {
    summary.classList.add("hidden");
  }
}

// Check if can proceed
function canProceed() {
  switch (currentStep) {
    case 1:
      return bookingData.category && bookingData.service;
    case 2:
      return bookingData.bedrooms && bookingData.bathrooms;
    case 3:
      return bookingData.frequency;
    case 4:
      return true; // Add-ons are optional
    case 5:
      return bookingData.preferredDay && bookingData.preferredTime;
    case 6:
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const street = document.getElementById("street").value;
      const city = document.getElementById("city").value;
      const state = document.getElementById("state").value;
      const zipCode = document.getElementById("zipCode").value;

      return (
        firstName &&
        lastName &&
        email &&
        phone &&
        street &&
        city &&
        state &&
        zipCode
      );
    default:
      return false;
  }
}

// Update next button
function updateNextButton() {
  const nextBtn = document.getElementById("nextBtn");
  const bookBtn = document.getElementById("bookBtn");

  if (currentStep < 6) {
    if (canProceed()) {
      nextBtn.classList.remove(
        "bg-gray-300",
        "text-gray-500",
        "cursor-not-allowed"
      );
      nextBtn.classList.add(
        "bg-primary",
        "text-white",
        "hover:bg-accent",
        "hover:shadow-lg"
      );
    } else {
      nextBtn.classList.add(
        "bg-gray-300",
        "text-gray-500",
        "cursor-not-allowed"
      );
      nextBtn.classList.remove(
        "bg-primary",
        "text-white",
        "hover:bg-green-800",
        "hover:shadow-lg"
      );
    }
  } else {
    if (canProceed()) {
      bookBtn.classList.remove(
        "bg-gray-300",
        "text-gray-500",
        "cursor-not-allowed"
      );
      bookBtn.classList.add(
        "bg-primary",
        "text-white",
        "hover:bg-green-800",
        "hover:shadow-lg"
      );
    } else {
      bookBtn.classList.add(
        "bg-gray-300",
        "text-gray-500",
        "cursor-not-allowed"
      );
      bookBtn.classList.remove(
        "bg-primary",
        "text-white",
        "hover:bg-green-800",
        "hover:shadow-lg"
      );
    }
  }
}

// Next step
function nextStep() {
  if (!canProceed()) return;

  if (currentStep < 6) {
    document.getElementById(`step${currentStep}`).classList.remove("active");
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add("active");

    updateProgress();

    // Show/hide navigation buttons
    if (currentStep > 1) {
      document.getElementById("prevBtn").classList.remove("hidden");
    }

    if (currentStep === 6) {
      document.getElementById("nextBtn").classList.add("hidden");
      document.getElementById("bookBtn").classList.remove("hidden");
    }

    updateNextButton();
  }
}

// Previous step
function prevStep() {
  if (currentStep > 1) {
    document.getElementById(`step${currentStep}`).classList.remove("active");
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.add("active");

    updateProgress();

    // Show/hide navigation buttons
    if (currentStep === 1) {
      document.getElementById("prevBtn").classList.add("hidden");
    }

    if (currentStep < 6) {
      document.getElementById("nextBtn").classList.remove("hidden");
      document.getElementById("bookBtn").classList.add("hidden");
    }

    updateNextButton();
  }
}

// Handle booking
function handleBooking() {
  if (!canProceed()) return;

  // Collect personal information
  bookingData.personalInfo = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
  };

  bookingData.address = {
    street: document.getElementById("street").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    zipCode: document.getElementById("zipCode").value,
  };

  bookingData.additionalInfo = document.getElementById("additionalInfo").value;

  // Show booking complete modal
  document.getElementById("confirmedTotal").textContent = "$" + totalPrice;
  document.getElementById(
    "confirmedSchedule"
  ).textContent = `${bookingData.preferredDay} at ${bookingData.preferredTime}`;
  document.getElementById("bookingComplete").classList.remove("hidden");

  console.log("Booking Data:", bookingData);
}

// Reset booking
function resetBooking() {
  // Reset data
  bookingData = {
    category: "",
    service: "",
    bedrooms: 1,
    bathrooms: 1,
    frequency: "",
    addOns: [],
    preferredDay: "",
    preferredTime: "",
    personalInfo: { firstName: "", lastName: "", email: "", phone: "" },
    address: { street: "", city: "", state: "", zipCode: "" },
    additionalInfo: "",
  };

  currentStep = 1;
  totalPrice = 90;

  // Reset UI
  document.getElementById("bookingComplete").classList.add("hidden");
  document
    .querySelectorAll(".step")
    .forEach((step) => step.classList.remove("active"));
  document.getElementById("step1").classList.add("active");

  // Reset form fields
  document
    .querySelectorAll("input, textarea")
    .forEach((field) => (field.value = ""));

  // Reset buttons
  document
    .querySelectorAll(
      ".category-btn, .service-btn, .bedroom-btn, .bathroom-btn, .frequency-btn, .addon-btn, .day-btn, .time-btn"
    )
    .forEach((btn) => {
      btn.classList.remove("border-primary", "bg-green-50");
      btn.classList.add("border-gray-200");
    });

  // Hide service selection and summaries
  document.getElementById("serviceSelection").classList.add("hidden");
  document.getElementById("addOnSummary").classList.add("hidden");
  document.getElementById("scheduleSummary").classList.add("hidden");

  // Reset navigation
  document.getElementById("prevBtn").classList.add("hidden");
  document.getElementById("nextBtn").classList.remove("hidden");
  document.getElementById("bookBtn").classList.add("hidden");

  updateProgress();
  updateTotalPrice();
  updateNextButton();
}

// Add event listeners for form validation
document.addEventListener("DOMContentLoaded", function () {
  const formFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "street",
    "city",
    "state",
    "zipCode",
  ];
  formFields.forEach((fieldId) => {
    document
      .getElementById(fieldId)
      .addEventListener("input", updateNextButton);
  });

  updateTotalPrice();
  updateNextButton();
});
  