import React from "react";

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Checkout = () => {
  const navigate = useNavigate()

  // Mock package data
  const packageDetails = {
    id: 2,
    name: "Swiss Alps Adventure",
    image: "/lukhnow.jpg?height=200&width=300",
    basePrice: 1899,
    duration: "8 days",
    startDate: "2023-09-10",
    endDate: "2023-09-18",
    travelers: 2,
  }

  // State for checkout
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    specialRequests: "",
    paymentMethod: "creditCard",
    gstNumber: "",
    agreeTerms: false,
  })

  // State for add-ons
  const [addOns, setAddOns] = useState({
    insurance: false,
    airportTransfer: false,
    guidedTour: false,
  })

  // Pricing calculation
  const pricing = {
    basePrice: packageDetails.basePrice * packageDetails.travelers,
    insurance: addOns.insurance ? 99 * packageDetails.travelers : 0,
    airportTransfer: addOns.airportTransfer ? 49 : 0,
    guidedTour: addOns.guidedTour ? 199 : 0,
    tax: Math.round(packageDetails.basePrice * packageDetails.travelers * 0.08),
  }

  // Calculate total
  const totalPrice = pricing.basePrice + pricing.insurance + pricing.airportTransfer + pricing.guidedTour + pricing.tax

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Handle add-on changes
  const handleAddOnChange = (e) => {
    const { name, checked } = e.target
    setAddOns({
      ...addOns,
      [name]: checked,
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // In a real app, this would submit payment info to a payment processor
    // For now, we'll just simulate a successful payment

    // Show loading state (in a real app)
    alert("Processing payment...")

    // Simulate API call delay
    setTimeout(() => {
      // Navigate to confirmation page
      navigate("/orders")
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Package Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  <div className="flex items-center mb-4">
                    <img
                      src={packageDetails.image || "/placeholder.svg"}
                      alt={packageDetails.name}
                      className="w-20 h-20 object-cover rounded-md mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{packageDetails.name}</h3>
                      <p className="text-gray-600 text-sm">{packageDetails.duration}</p>
                      <p className="text-gray-600 text-sm">
                        {new Date(packageDetails.startDate).toLocaleDateString()} -{" "}
                        {new Date(packageDetails.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 text-sm">{packageDetails.travelers} Travelers</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">
                        Base Price ({packageDetails.travelers} x ₹{packageDetails.basePrice})
                      </span>
                      <span>₹{pricing.basePrice}</span>
                    </div>

                    {addOns.insurance && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Travel Insurance</span>
                        <span>₹{pricing.insurance}</span>
                      </div>
                    )}

                    {addOns.airportTransfer && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Airport Transfer</span>
                        <span>₹{pricing.airportTransfer}</span>
                      </div>
                    )}

                    {addOns.guidedTour && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Private Guided Tour</span>
                        <span>₹{pricing.guidedTour}</span>
                      </div>
                    )}

                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span>₹{pricing.tax}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                {/* Add-ons Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Add-ons</h2>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="insurance"
                          name="insurance"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={addOns.insurance}
                          onChange={handleAddOnChange}
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="insurance" className="font-medium text-gray-700">
                          Travel Insurance
                        </label>
                        <p className="text-gray-500 text-sm">
                          Comprehensive coverage for trip cancellation, medical emergencies, and more.
                        </p>
                        <p className="text-gray-700 font-medium">₹99 per traveler</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="airportTransfer"
                          name="airportTransfer"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={addOns.airportTransfer}
                          onChange={handleAddOnChange}
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="airportTransfer" className="font-medium text-gray-700">
                          Airport Transfer
                        </label>
                        <p className="text-gray-500 text-sm">
                          Comfortable private transfer from airport to hotel and back.
                        </p>
                        <p className="text-gray-700 font-medium">₹49</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="guidedTour"
                          name="guidedTour"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={addOns.guidedTour}
                          onChange={handleAddOnChange}
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="guidedTour" className="font-medium text-gray-700">
                          Private Guided Tour
                        </label>
                        <p className="text-gray-500 text-sm">
                          Exclusive guided tour with a local expert for a more personalized experience.
                        </p>
                        <p className="text-gray-700 font-medium">₹199</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traveler Information */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Traveler Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Zip/Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="creditCard"
                        name="paymentMethod"
                        type="radio"
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        value="creditCard"
                        checked={formData.paymentMethod === "creditCard"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="creditCard" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit/Debit Card
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="upi"
                        name="paymentMethod"
                        type="radio"
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        value="upi"
                        checked={formData.paymentMethod === "upi"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="upi" className="ml-3 block text-sm font-medium text-gray-700">
                        UPI
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="bankTransfer"
                        name="paymentMethod"
                        type="radio"
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        value="bankTransfer"
                        checked={formData.paymentMethod === "bankTransfer"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="bankTransfer" className="ml-3 block text-sm font-medium text-gray-700">
                        Bank Transfer
                      </label>
                    </div>
                  </div>

                  {/* Payment details would be shown based on selected method */}
                  {formData.paymentMethod === "creditCard" && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-md">
                      <p className="text-gray-600 text-sm">
                        For demo purposes, no actual payment will be processed. In a real application, a secure payment
                        form would be displayed here.
                      </p>
                    </div>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="mb-8">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeTerms"
                        name="agreeTerms"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        required
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                        I agree to the{" "}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Complete Booking - ₹{totalPrice}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Checkout
