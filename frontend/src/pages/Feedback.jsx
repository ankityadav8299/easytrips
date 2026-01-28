import React from "react";

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Feedback = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()

  // Mock trip data
  const tripData = {
    id: orderId,
    packageName: "Bali Paradise Escape",
    image: "/placeholder.svg?height=150&width=250",
    startDate: "2023-08-15",
    endDate: "2023-08-22",
  }

  // Feedback form state
  const [formData, setFormData] = useState({
    rating: 5,
    message: "",
    name: "John Doe",
    email: "john.doe@example.com",
    allowPublish: true,
  })

  // Image upload state
  const [images, setImages] = useState([])

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)

    // In a real app, you would upload these files to a server
    // For now, we'll just create object URLs for preview
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      name: file.name,
      url: URL.createObjectURL(file),
    }))

    setImages([...images, ...newImages])
  }

  // Remove image
  const removeImage = (id) => {
    setImages(images.filter((image) => image.id !== id))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // In a real app, this would submit the feedback to a server
    alert("Thank you for your feedback!")

    // Navigate back to orders page
    navigate("/orders")
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Share Your Experience</h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <img
                  src={tripData.image || "/placeholder.svg"}
                  alt={tripData.packageName}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold">{tripData.packageName}</h2>
                  <p className="text-gray-600">
                    {formatDate(tripData.startDate)} - {formatDate(tripData.endDate)}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How would you rate your overall experience?
                  </label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-2xl focus:outline-none"
                        onClick={() => setFormData({ ...formData, rating: star })}
                      >
                        <span className={star <= formData.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {formData.rating === 1
                        ? "Poor"
                        : formData.rating === 2
                          ? "Fair"
                          : formData.rating === 3
                            ? "Good"
                            : formData.rating === 4
                              ? "Very Good"
                              : "Excellent"}
                    </span>
                  </div>
                </div>

                {/* Feedback Message */}
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Share your thoughts about the trip
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What did you like? What could have been better?"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share your trip photos (optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.name}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                            onClick={() => removeImage(image.id)}
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Allow Publish */}
                <div className="mb-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="allowPublish"
                        name="allowPublish"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={formData.allowPublish}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="allowPublish" className="font-medium text-gray-700">
                        Allow us to publish your review
                      </label>
                      <p className="text-gray-500">
                        Your review may be featured on our website to help other travelers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit Feedback
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

export default Feedback
