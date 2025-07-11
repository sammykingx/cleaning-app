let bookingData = {
  category: "",
  service: "",
  bedrooms: 1,
  extraBed: 0,
  bathrooms: 1,
  extraBath: 0,
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
    country: "canada",
  },
  price: 0,
  additionalInfo: "",
};

let currentStep = 1;
let totalPrice = 0;
let desiredDay = null;
let desiredTime = null;

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
  Laundry: ["Wash & Fold"],
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

// Laundry Extras Price Map
const laundryPriceMap = {
  "dry cleaning": 20,
  "pick-up & drop-off": 30,
};

const addonServicePrices = [
  { name: "Fridge Cleaning", unitCost: 35, count: 1 },
  { name: "Oven Cleaning", unitCost: 35, count: 1 },
  { name: "Blinds Dusting", unitCost: 10, count: 1 },
  { name: "Window Cleaning (Exterior)", unitCost: 15, count: 1 },
  { name: "Carpet/Rug Cleaning", unitCost: 30, count: 1 },
  { name: "Deep Carpet/Rug Cleaning", unitCost: 85, count: 1 },
  { name: "Bed Making", unitCost: 5, count: 1 },
  { name: "Pick Up & Drop Off", unitCost: 30, count: 1 },
  { name: "Dry Cleaning", unitCost: 20, count: 1 },
  { name: "Org. Services", unitCost: 70, count: 1 },
  { name: "Pick-and-Drop", unitCost: 30, count: 1 },
];

// Calculate base price
function getBasePrice() {
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
  return value;
}

// display summary on property details
function displaySummary() {
  document.getElementById("displaySelectedService").textContent =
    bookingData.service;

  document.getElementById("displayMaxBedroom").textContent =
    bookingData.bedrooms + "Bed";
}

// Update total price
function updateTotalPrice() {
  const basePrice =
    bookingData.bedrooms > 1
      ? getBedroomPrice(bookingData.bedrooms) // if greater than one
      : getBasePrice();

  let extraBathCost = 0,
    extraBedCost = 0;

  if (bookingData.extraBed > 0) {
    extraBedCost = 35 * bookingData.extraBed;
  }

  if (bookingData.extraBath > 0) {
    extraBathCost = 40 * bookingData.extraBath;
  }

  const addOnPrice = bookingData.addOns.reduce((sum, addon) => {
    return sum + addon.count * addon.unitCost;
  }, 0);

  const subtotal = Math.round(
    basePrice + addOnPrice + extraBathCost + extraBedCost
  );

  const tax = subtotal * 0.15;
  const totalPrice = tax + subtotal;
  bookingData.price = totalPrice;

  document.getElementById("basePrice").textContent = "$" + basePrice;
  document.getElementById("totalPrice").textContent = "$" + totalPrice;
  document.getElementById("finalPrice").textContent = totalPrice;
  document.getElementById("finalPrice").textContent = totalPrice;
  document.getElementById("subtotal").textContent = "$" + subtotal;
  document.getElementById("tax").textContent = "$" + tax;
}

// Update progress bar
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

  // Update UI
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
  if (bookingData.category != "Residential Cleaning") {
    // if the user comes back to select another catgory
    // after previously selecting residential cleaning
    bookingData.service = "";
    bookingData.bedrooms = 1;
    bookingData.extraBed = 0;
    bookingData.extraBath = 0;

    getBasePrice();
  }

  if (bookingData.category === "Laundry") {
    // display the laundry addons section
    document.getElementById("clothingCount").classList.remove("hidden");
    document.getElementById("laundryAddon").classList.remove("hidden");

    // hide other service addons and window count
    document.getElementById("otherAddons").classList.add("hidden");
    document.getElementById("windowCount").classList.add("hidden");
  } else {
    // hide laundry addons and clothing count
    document.getElementById("clothingCount").classList.add("hidden");
    document.getElementById("laundryAddon").classList.add("hidden");

    // show other service addons and window count
    document.getElementById("otherAddons").classList.remove("hidden");
    document.getElementById("windowCount").classList.remove("hidden");
  }
  updateNextButton();
}

// Select service
function selectService(service) {
  bookingData.service = service;

  bookingData.addOns = [];
  const summary = document.getElementById("addOnSummary");
  summary.classList.add("hidden");

  // Update total price
  updateTotalPrice();

  // Update UI
  document.querySelectorAll(".service-btn").forEach((btn) => {
    btn.classList.remove("border-primary", "bg-green-50");
    btn.classList.add("border-gray-200");
  });
  event.target.classList.add("border-primary");
  event.target.classList.remove("border-gray-200");

  updateNextButton();
}

// Select bedrooms in Number of Bedrooms
function selectBedrooms(num) {
  bookingData.bedrooms = num;

  document.querySelectorAll(".bedroom-btn").forEach((btn) => {
    btn.classList.remove("border-primary");
    btn.classList.add("border-gray-200");
  });
  event.target.closest(".bedroom-btn").classList.add("border-primary");
  event.target.closest(".bedroom-btn").classList.remove("border-gray-200");

  document.getElementById("bedroomDisplay").textContent = num;
  document.getElementById("bathroomDisplay").textContent = num;
  updateTotalPrice();
  updateNextButton();
}

// handles extraBedrom
function extraBedrooms(num) {
  bookingData.extraBed = num;
  document.querySelectorAll(".extraBed-btn").forEach((btn) => {
    btn.classList.remove("border-primary");
    btn.classList.add("border-gray-200");
  });
  event.target.closest(".extraBed-btn").classList.add("border-primary");
  event.target.closest(".extraBed-btn").classList.remove("border-gray-200");

  document.getElementById("displayExtraBed").textContent = `Extra Bed: ${num}`;
  updateTotalPrice();
  // updateNextButton();
}

// handles extraBathrooms
function extraBathrooms(num) {
  bookingData.extraBath = num;

  document.querySelectorAll(".extraBath-btn").forEach((btn) => {
    btn.classList.remove("border-primary");
    btn.classList.add("border-gray-200");
  });
  event.target.closest(".extraBath-btn").classList.add("border-primary");
  event.target.closest(".extraBath-btn").classList.remove("border-gray-200");

  document.getElementById(
    "displayExtraBath"
  ).textContent = `Extra Bath: ${num}`;
  updateTotalPrice();
}

//Toggle Addon Services
function toggleAddOn(addOn) {
  const index = bookingData.addOns.findIndex((a) => a.name === addOn);
  const button = event.target.closest(".addon-btn");

  if (index > -1) {
    bookingData.addOns.splice(index, 1);
    button.classList.remove("border-primary", "bg-green-50");
    button.classList.add("border-gray-200");
  } else {
    addonIndex = addonServicePrices.findIndex((a) => a.name === addOn);
    const newAddon = {
      name: addOn,
      unitCost: addonServicePrices[addonIndex].unitCost,
      count: 1,
    };
    bookingData.addOns.push(newAddon);
    button.classList.add("border-primary", "bg-green-50");
    button.classList.remove("border-gray-200");
  }

  updateAddOnSummary();
  updateTotalPrice();
  updateNextButton();
}

function updateAddOnSummary() {
  const summary = document.getElementById("addOnSummary");
  const count = document.getElementById("addOnCount");
  const total = document.getElementById("addOnTotal");

  if (bookingData.addOns.length > 0) {
    summary.classList.remove("hidden");
    count.textContent = bookingData.addOns.length;

    const addonTotalPrice = bookingData.addOns.reduce((sum, addon) => {
      return sum + addon.count * addon.unitCost;
    }, 0);

    total.textContent = "+$" + addonTotalPrice;
  } else {
    summary.classList.add("hidden");
  }
}

// Select day
function selectDay(day) {
  // Prevent selection if disabled
  if (event.target.closest("button").disabled) return;
  desiredDay = day;
  desiredTime = null;

  // Update UI
  document.querySelectorAll(".day-btn").forEach((btn) => {
    btn.classList.remove("border-primary", "bg-green-50");
    btn.classList.add("border-gray-200");
  });
  event.target.classList.add("border-primary", "bg-green-50");
  event.target.classList.remove("border-gray-200");

  document.querySelectorAll(".time-btn").forEach((btn) => {
    btn.classList.remove("border-primary", "bg-green-50");
    btn.classList.add("border-gray-200");
  });
  event.target.classList.add("border-primary", "bg-green-50");
  event.target.classList.remove("border-gray-200");

  updateTimeSlotsUI(day);
  updateScheduleSummary();
  updateNextButton();
}

// Select time
function selectTime(time) {
  // Prevent selection if disabled
  if (event.target.closest("button").disabled) return;

  desiredTime = time;

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
  let cleaningDate;

  if (
    typeof desiredDay === "string" &&
    desiredDay.trim() !== "" &&
    typeof desiredTime === "string" &&
    desiredTime.trim() !== ""
  ) {
    cleaningDate = getCleaningDate(desiredDay, desiredTime);
    bookingData.preferredDay = cleaningDate.dateStr;
    bookingData.preferredTime = cleaningDate.time24;
  }

  const summary = document.getElementById("scheduleSummary");
  //const daySpan = document.getElementById("selectedDay");
  const timeSpan = document.getElementById("selectedTime");

  // if (bookingData.preferredDay && bookingData.preferredTime) {
  if (desiredDay && desiredTime) {
    //daySpan.textContent = bookingData.preferredDay;
    timeSpan.textContent = formatFriendlyRange(
      cleaningDate.dateStr,
      cleaningDate.time24
    );
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
      return validateContactFields();
    default:
      return false;
  }
}

function validateContactFields() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const street = document.getElementById("street").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  //const country = document.getElementById("country").value.trim();

  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  let isValid = true;

  if (!isValidEmail(email)) {
    // clears email input
    isValid = false;
  }

  if (!isValidPhone(phone)) {
    isValid = false;
  }

  if (!isValidName(firstName)) {
    isValid = false;
  }

  if (!isValidName(lastName)) {
    isValid = false;
  }

  return (
    isValid &&
    firstName &&
    lastName &&
    email &&
    phone &&
    street &&
    city &&
    state
    //country
  );
}

// Update next button
function updateNextButton() {
  const nextBtn = document.getElementById("nextBtn");
  const bookBtn = document.getElementById("bookBtn");

  if (currentStep < 6) {
    if (canProceed()) {
      nextBtn.classList.remove(
        "bg-gray-300",
        "text-white",
        "cursor-not-allowed"
      );
      nextBtn.classList.add(
        "bg-primary",
        "text-white",
        "hover:bg-accent",
        "hover:shadow-lg"
      );
    } else {
      nextBtn.classList.add("bg-gray-300", "text-white", "cursor-not-allowed");
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
// controls the booking flow step
function nextStep() {
  if (!canProceed()) return;

  if (currentStep < 6) {
    document.getElementById(`step${currentStep}`).classList.remove("active");

    if (currentStep === 1) {
      if (
        bookingData.category === "Commercial Cleaning" ||
        bookingData.category === "Laundry"
      ) {
        currentStep = 4;
      } else {
        currentStep++;
      }
    } else if (currentStep === 2) {
      currentStep = 4;
    } else {
      currentStep++;
    }

    //currentStep++;
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

    if (
      currentStep === 4 &&
      ["Commercial Cleaning", "Laundry"].includes(bookingData.category)
    ) {
      currentStep = 1;
    } else if (
      currentStep === 4 &&
      bookingData.category === "Residential Cleaning"
    ) {
      currentStep = 2; // takes the user back bedroom selection
    } else {
      currentStep--;
    }

    //currentStep--;
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
    country: "canada",
  };

  bookingData.additionalInfo = document.getElementById("additionalInfo").value;
  const token =
    document.head.querySelector('meta[name="csrf-token"]')?.content || "";

  fetch("/booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
    body: JSON.stringify(bookingData),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Invalid request. Please try again.");
        } else if (response.status === 403) {
          throw new Error(
            "Oh dear, your session has expired please refresh the page and try again."
          );
        } else if (response.status === 404) {
          throw new Error(
            "The requested resource was not found. Please try again."
          );
        } else if (response.status === 422) {
          throw new Error("You sent incorrect booking data, please try again.");
        } else if (response.status === 500) {
          throw new Error(
            "There was a problem with our server. check back later."
          );
        } else {
          throw new Error(
            "Our booking service is currently not available, please try again."
          );
        }
      }
      return response.json();
    })
    .then((data) => {
      // get fresh availability
      fetchAvailability();

      // Show booking complete modal
      document.getElementById("confirmedTotal").textContent =
        "$" + bookingData.price;
      document.getElementById("bookingID").textContent =
        data.id ?? "KSP-XXXXXXXXXX";
      document.getElementById("bookedService").textContent =
        bookingData.service;
      document.getElementById("confirmedSchedule").textContent =
        formatFriendlyRange(
          bookingData.preferredDay,
          bookingData.preferredTime
        );
      //`${bookingData.preferredDay} at ${bookingData.preferredTime}`;
      document.getElementById("bookingComplete").classList.remove("hidden");
    })
    .catch((error) => {
      //console.error("Error during booking:", error);
      alert(error.message);
      resetBooking();
      window.location.reload();
    });

  // // Show booking complete modal
  // document.getElementById("confirmedTotal").textContent =
  //   "$" + bookingData.price;
  // document.getElementById(
  //   "confirmedSchedule"
  // ).textContent = `${bookingData.preferredDay} at ${bookingData.preferredTime}`;
  // document.getElementById("bookingComplete").classList.remove("hidden");
}

// Reset booking
function resetBooking() {
  // Reset data
  bookingData = {
    category: "",
    service: "",
    bedrooms: 1,
    extraBed: 0,
    bathrooms: 1,
    extraBath: 0,
    addOns: [],
    preferredDay: "",
    preferredTime: "",
    personalInfo: { firstName: "", lastName: "", email: "", phone: "" },
    address: { street: "", city: "", state: "", country: "canada" },
    additionalInfo: "",
  };

  currentStep = 1;
  totalPrice = 90;
  desiredDay = null;
  desiredTime = null;

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
  ];
  formFields.forEach((fieldId) => {
    document
      .getElementById(fieldId)
      .addEventListener("input", updateNextButton);
  });

  updateTotalPrice();
  updateNextButton();
});

// ------------ EVENT LISTENERS ------------------
// validation and updating clothing input
document.getElementById("clothingNum").addEventListener("input", (event) => {
  let value = event.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "") || 1;
  value = Math.min(Math.max(parseInt(value, 10), 1), 30);
  event.target.value = value;

  const addOn = bookingData.addOns.find((a) => a.name === "Dry Cleaning");
  if (addOn) {
    addOn.count = value;
    updateAddOnSummary();
    updateTotalPrice();
  }
});

// validation and updating interior window cleaning input
document.getElementById("intWindowNum").addEventListener("input", (event) => {
  let value = event.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "") || 1;
  value = Math.min(Math.max(parseInt(value, 10), 1), 30);
  event.target.value = value;

  const addOn = bookingData.addOns.find((a) => a.name === "Blinds Dusting");
  if (addOn) {
    addOn.count = value;
    updateAddOnSummary();
    updateTotalPrice();
  }
});

// validation and updating interior window cleaning input
document.getElementById("extWindowNum").addEventListener("input", (event) => {
  let value = event.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "") || 1;
  value = Math.min(Math.max(parseInt(value, 10), 1), 30);
  event.target.value = value;

  const addOn = bookingData.addOns.find(
    (a) => a.name === "Window Cleaning (Exterior)"
  );
  if (addOn) {
    addOn.count = value;
    updateAddOnSummary();
    updateTotalPrice();
  }
});