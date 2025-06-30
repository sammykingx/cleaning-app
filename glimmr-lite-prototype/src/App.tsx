import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  Plus, 
  User, 
  MapPin, 
  FileText, 
  CheckCircle, 
  ChevronRight,
  Sparkles,
  Building,
  Car,
  Refrigerator,
  ChefHat,
  Wind,
  Sofa,
  Shirt,
  ArrowLeft
} from 'lucide-react';

interface BookingData {
  category: string;
  service: string;
  bedrooms: number;
  bathrooms: number;
  frequency: string;
  addOns: string[];
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  additionalInfo: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    category: '',
    service: '',
    bedrooms: 1,
    bathrooms: 1,
    frequency: '',
    addOns: [],
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    additionalInfo: ''
  });

  const [totalPrice, setTotalPrice] = useState(90);
  const [isBookingComplete, setIsBookingComplete] = useState(false);

  const serviceCategories = {
    'Standard Cleaning': [
      'Regular House Cleaning',
      'Apartment Cleaning',
      'Weekly Maintenance'
    ],
    'Deep Cleaning': [
      'Move-in Cleaning',
      'Move-out Cleaning',
      'Spring Cleaning',
      'Post-Construction Cleanup'
    ],
    'Specialized': [
      'Office Cleaning',
      'Airbnb Cleaning',
      'Post-Party Cleanup'
    ]
  };

  const addOnServices = [
    { name: 'Fridge Cleaning', icon: Refrigerator },
    { name: 'Oven Cleaning', icon: ChefHat },
    { name: 'Blinds Dusting', icon: Wind },
    { name: 'Furniture Polish', icon: Sofa },
    { name: 'Laundry Service', icon: Shirt },
    { name: 'Garage Cleaning', icon: Car }
  ];

  const frequencyMultipliers = {
    'weekly': 1.0,
    'bi-weekly': 0.9,
    'monthly': 0.8
  };

  const calculateBasePrice = (bedrooms: number, bathrooms: number) => {
    const bedroomPrice = 90 + (bedrooms - 1) * 25;
    const bathroomPrice = (bathrooms - 1) * 15;
    return bedroomPrice + bathroomPrice;
  };

  useEffect(() => {
    const basePrice = calculateBasePrice(bookingData.bedrooms, bookingData.bathrooms);
    const frequencyMultiplier = bookingData.frequency ? frequencyMultipliers[bookingData.frequency as keyof typeof frequencyMultipliers] : 1;
    const addOnPrice = bookingData.addOns.length * 30;
    const total = (basePrice * frequencyMultiplier) + addOnPrice;
    setTotalPrice(Math.round(total));
  }, [bookingData.bedrooms, bookingData.bathrooms, bookingData.frequency, bookingData.addOns]);

  const updateBookingData = (field: string, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedData = (parent: string, field: string, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof BookingData],
        [field]: value
      }
    }));
  };

  const toggleAddOn = (addOn: string) => {
    setBookingData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOn) 
        ? prev.addOns.filter(item => item !== addOn)
        : [...prev.addOns, addOn]
    }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBooking = () => {
    setIsBookingComplete(true);
    // Here you would typically send the booking data to your backend
    console.log('Booking Data:', bookingData);
  };

  const canProceed = () => {
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
        return bookingData.personalInfo.firstName && 
               bookingData.personalInfo.lastName && 
               bookingData.personalInfo.email && 
               bookingData.personalInfo.phone &&
               bookingData.address.street &&
               bookingData.address.city &&
               bookingData.address.state &&
               bookingData.address.zipCode;
      default:
        return false;
    }
  };

  if (isBookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fadeIn">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#024522]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for choosing our cleaning service. We'll contact you shortly to confirm your appointment.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-[#024522]">${totalPrice}</p>
          </div>
          <button
            onClick={() => {
              setIsBookingComplete(false);
              setCurrentStep(1);
              setBookingData({
                category: '',
                service: '',
                bedrooms: 1,
                bathrooms: 1,
                frequency: '',
                addOns: [],
                personalInfo: { firstName: '', lastName: '', email: '', phone: '' },
                address: { street: '', city: '', state: '', zipCode: '' },
                additionalInfo: ''
              });
            }}
            className="bg-[#024522] text-white px-6 py-3 rounded-lg hover:bg-[#035529] transition-colors"
          >
            Book Another Service
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#024522] rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CleanPro</h1>
                <p className="text-sm text-gray-500">Professional Cleaning Services</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-[#024522]">${totalPrice}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 5) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#024522] h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="p-8 animate-slideIn">
              <div className="flex items-center space-x-3 mb-6">
                <Home className="w-6 h-6 text-[#024522]" />
                <h2 className="text-2xl font-bold text-gray-900">Select Your Service</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose a cleaning category
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.keys(serviceCategories).map((category) => (
                      <button
                        key={category}
                        onClick={() => updateBookingData('category', category)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                          bookingData.category === category
                            ? 'border-[#024522] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-[#024522]" />
                          <span className="font-medium">{category}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {bookingData.category && (
                  <div className="animate-fadeIn">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Choose specific service
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {serviceCategories[bookingData.category as keyof typeof serviceCategories].map((service) => (
                        <button
                          key={service}
                          onClick={() => updateBookingData('service', service)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                            bookingData.service === service
                              ? 'border-[#024522] bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="font-medium">{service}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Room Selection */}
          {currentStep === 2 && (
            <div className="p-8 animate-slideIn">
              <div className="flex items-center space-x-3 mb-6">
                <Home className="w-6 h-6 text-[#024522]" />
                <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Number of Bedrooms
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => updateBookingData('bedrooms', num)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                          bookingData.bedrooms === num
                            ? 'border-[#024522] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-bold text-lg">{num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Number of Bathrooms
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => updateBookingData('bathrooms', num)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                          bookingData.bathrooms === num
                            ? 'border-[#024522] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-bold text-lg">{num}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Base Price ({bookingData.bedrooms} bed, {bookingData.bathrooms} bath)</span>
                  <span className="font-bold text-[#024522]">${calculateBasePrice(bookingData.bedrooms, bookingData.bathrooms)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Frequency Selection */}
          {currentStep === 3 && (
            <div className="p-8 animate-slideIn">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-6 h-6 text-[#024522]" />
                <h2 className="text-2xl font-bold text-gray-900">Cleaning Frequency</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { key: 'weekly', label: 'Weekly', discount: '0%', multiplier: 1.0 },
                  { key: 'bi-weekly', label: 'Bi-Weekly', discount: '10%', multiplier: 0.9 },
                  { key: 'monthly', label: 'Monthly', discount: '20%', multiplier: 0.8 }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => updateBookingData('frequency', option.key)}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                      bookingData.frequency === option.key
                        ? 'border-[#024522] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-2">{option.label}</h3>
                      <p className="text-sm text-gray-600 mb-2">Save {option.discount}</p>
                      <p className="font-bold text-[#024522]">
                        ${Math.round(calculateBasePrice(bookingData.bedrooms, bookingData.bathrooms) * option.multiplier)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Add-on Services */}
          {currentStep === 4 && (
            <div className="p-8 animate-slideIn">
              <div className="flex items-center space-x-3 mb-6">
                <Plus className="w-6 h-6 text-[#024522]" />
                <h2 className="text-2xl font-bold text-gray-900">Add-on Services</h2>
                <span className="text-sm text-gray-500">(Optional - $30 each)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addOnServices.map((service) => {
                  const IconComponent = service.icon;
                  const isSelected = bookingData.addOns.includes(service.name);
                  return (
                    <button
                      key={service.name}
                      onClick={() => toggleAddOn(service.name)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                        isSelected
                          ? 'border-[#024522] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-[#024522]" />
                        <div className="text-left">
                          <span className="font-medium block">{service.name}</span>
                          <span className="text-sm text-gray-500">+$30</span>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-[#024522] ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {bookingData.addOns.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Add-on Services ({bookingData.addOns.length})</span>
                    <span className="font-bold text-[#024522]">+${bookingData.addOns.length * 30}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Personal Information */}
          {currentStep === 5 && (
            <div className="p-8 animate-slideIn">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-[#024522]" />
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={bookingData.personalInfo.firstName}
                      onChange={(e) => updateNestedData('personalInfo', 'firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#024522] focus:border-transparent transition-colors"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={bookingData.personalInfo.lastName}
                      onChange={(e) => updateNestedData('personalInfo', 'lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#024522] focus:border-transparent transition-colors"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={bookingData.personalInfo.email}
                      onChange={(e) => updateNestedData('personalInfo', 'email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#024522] focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={bookingData.personalInfo.phone}
                      onChange={(e) => updateNestedData('personalInfo', 'phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#024522] focus:border-transparent transition-colors"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="w-5 h-5 text-[#024522]" />
                    <h3 className="text-lg font-semibold text-gray-900">Service Address</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={bookingData.address.street}
                        onChange={(e) => updateNestedData('address', 'street', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#024522] focus:border-transparent transition-colors"
                        placeholder="Enter your street address"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={bookingData.address.city}
                          onChange={(e) => updateNestedData('address', 'city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#024522] focus:border-transparent transition-colors"
                          placeholder="City"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={bookingData.address.state}
                          onChange={(e) => updateNestedData('address', 'state', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#024522] focus:border-transparent transition-colors"
                          placeholder="State"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={bookingData.address.zipCode}
                          onChange={(e) => updateNestedData('address', 'zipCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#024522] focus:border-transparent transition-colors"
                          placeholder="ZIP Code"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-5 h-5 text-[#024522]" />
                    <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  </div>
                  <textarea
                    value={bookingData.additionalInfo}
                    onChange={(e) => updateBookingData('additionalInfo', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#024522] focus:border-transparent transition-colors"
                    rows={4}
                    placeholder="Any special instructions or notes for our cleaning team..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="bg-gray-50 px-8 py-6 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                  canProceed()
                    ? 'bg-[#024522] text-white hover:bg-[#035529] hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleBooking}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                  canProceed()
                    ? 'bg-[#024522] text-white hover:bg-[#035529] hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Book Service - ${totalPrice}</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;