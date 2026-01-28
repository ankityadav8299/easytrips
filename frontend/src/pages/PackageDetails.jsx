import React from "react"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";

const PackageDetails = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [packageData, setPackageData] = useState({})

  const editPackage = () => {
    navigate('/add-destination',
      {
        state: {
          newEntry : false,
          ...packageData
        }
      }
    );
  };

  useEffect(() => {
    const fetchPackageData = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/destination/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
      setPackageData(data.destination);
      // console.log("user", user._id);
      setIsInWishlist(data.destination.wishlistedBy.some(
        (id) => id.toString() === user?._id.toString()
      ))
      return data;
    }
    fetchPackageData();
    // setPackageData(data.destination);
  }, [id, user])

  // State for active image
  const [activeImage, setActiveImage] = useState(0)

  // State for active tab
  const [activeTab, setActiveTab] = useState("overview")

  // State for wishlist and saved
  const [isInWishlist, setIsInWishlist] = useState(false)

  // State for booking
  const [bookingData, setBookingData] = useState({
    startDate: "",
    travelers: 2,
  })

  // Handle booking data change
  const handleBookingChange = (e) => {
    const { name, value } = e.target
    setBookingData({
      ...bookingData,
      [name]: value,
    })
  }

  // Toggle wishlist
  const toggleWishlist = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/${id}/${isInWishlist ? "rem" : "add"}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.message || "Failed to toggle wishlist");
      console.error("Error toggling wishlist:", data.message);
      return;
    }
    toast.success(data.message);
    setIsInWishlist(data.isInWishlist);
  }


  // Calculate total price
  const calculateTotalPrice = () => {
    return packageData.price * bookingData.travelers
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Package Title and Rating */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{packageData.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(packageData.ratings?.average || 0) ? "text-yellow-400" : "text-gray-300"
                          }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {packageData.ratings?.average} ({packageData.ratings?.count} reviews)
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="text-3xl font-bold text-blue-600">₹{packageData.price}</span>
                <span className="text-gray-600 ml-2">per person</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Images and Details */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="relative h-96">
                  <img
                    src={packageData.imageUrl && packageData.imageUrl[activeImage] || "/placeholder.svg"}
                    alt={`₹{packageData.name} - Image ₹{activeImage + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows */}
                  {packageData.imageUrl && packageData.imageUrl.length > 1 && (
                    <>
                      <button
                        aria-label="Previous image"
                        onClick={() =>
                          setActiveImage((prev) => (prev === 0 ? packageData.imageUrl.length - 1 : prev - 1))
                        }
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
                      >
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setActiveImage((prev) => (prev === packageData.imageUrl.length - 1 ? 0 : prev + 1))
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
                      >
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {packageData.imageUrl && packageData.imageUrl.length > 1 && (
                  <div className="flex p-2 overflow-x-auto">
                    {packageData.imageUrl && packageData.imageUrl.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-20 h-20 m-1 rounded overflow-hidden ₹{
                          activeImage === index ? "ring-2 ring-blue-500" : ""
                        }`}
                      >
                        <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ₹{
                        activeTab === "overview"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab("itinerary")}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ₹{
                        activeTab === "itinerary"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Itinerary
                    </button>
                    <button
                      onClick={() => setActiveTab("included")}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ₹{
                        activeTab === "included"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      What's Included
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ₹{
                        activeTab === "reviews"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Reviews
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <span className="block text-sm text-gray-500">Duration</span>
                          <span className="block font-semibold">{packageData.duration}</span>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <span className="block text-sm text-gray-500">Group Size</span>
                          <span className="block font-semibold">{packageData.groupSize} people</span>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <span className="block text-sm text-gray-500">Best Time</span>
                          <span className="block font-semibold">{packageData.bestTimeToVisit}</span>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <span className="block text-sm text-gray-500">Rating</span>
                          <span className="block font-semibold">{packageData.ratings?.average}/5({packageData.ratings?.count})</span>
                        </div>
                      </div>

                      <h2 className="text-xl font-semibold mb-4">Description</h2>
                      <p className="text-gray-700 mb-6">{packageData.description}</p>

                      <h2 className="text-xl font-semibold mb-4">Highlights</h2>
                      <ul className="list-disc pl-5 mb-6 space-y-2">
                        {packageData.highlights && packageData.highlights.map((highlight, index) => (
                          <li key={index} className="text-gray-700">
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Itinerary Tab */}
                  {activeTab === "itinerary" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6">Day-by-Day Itinerary</h2>
                      <div className="space-y-6">
                        {packageData && packageData.itinerary.map((day) => (
                          <div key={day.day} className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold text-lg">
                              Day {day.day}: {day.title}
                            </h3>
                            {day.activities && day.activities.length > 0 && day.activities.map((activity, index) => (
                              <p key={index} className="text-gray-700 mt-2">{activity}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Included Tab */}
                  {activeTab === "included" && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                      <ul className="list-disc pl-5 mb-6 space-y-2">
                        {packageData && packageData.included.map((item, index) => (
                          <li key={index} className="text-gray-700">
                            {item}
                          </li>
                        ))}
                      </ul>

                      <h2 className="text-xl font-semibold mb-4">What's Not Included</h2>
                      <ul className="list-disc pl-5 space-y-2">
                        {packageData && packageData.notIncluded.map((item, index) => (
                          <li key={index} className="text-gray-700">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === "reviews" && (
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${star <= Math.round(packageData.ratings?.average || 0) ? "text-yellow-400" : "text-gray-300"
                                }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-gray-900 font-semibold">{packageData.ratings.average} out of 5</span>
                        <span className="ml-2 text-gray-600">({packageData.reviewCount} reviews)</span>
                      </div>

                      <div className="space-y-6">
                        {packageData && packageData.reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                            <div className="flex items-start">
                              <img
                                src={review.image || "/placeholder.svg"}
                                alt={review.name}
                                className="w-10 h-10 rounded-full mr-4"
                              />
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-semibold">{review.name}</h3>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <span className="text-sm text-gray-600">{formatDate(review.date)}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-4 h-4 ₹{
                                        star <= review.rating ? "text-yellow-400" : "text-gray-300"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Booking and Actions */}
            <div className="lg:col-span-1">
              {/* Booking Form */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Book This Tour</h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={bookingData.startDate}
                        onChange={handleBookingChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div>
                      <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Travelers
                      </label>
                      <select
                        id="travelers"
                        name="travelers"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={bookingData.travelers}
                        onChange={handleBookingChange}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "person" : "people"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price per person</span>
                        <span>₹{packageData.price}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Travelers</span>
                        <span>x {bookingData.travelers}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>₹{calculateTotalPrice()}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Link
                        to={`/checkout?package=₹{packageData.id}&date=₹{bookingData.startDate}&travelers=₹{bookingData.travelers}`}
                        className={`w-full px-4 py-2 bg-blue-600 text-white text-center font-medium rounded-md hover:bg-blue-700 transition duration-300 block ₹{
                          !bookingData.startDate ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={(e) => {
                          if (!bookingData.startDate) {
                            e.preventDefault()
                            alert("Please select a start date")
                          }
                        }}
                      >
                        Book Now
                      </Link>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleWishlist(packageData._id)}
                          className={`cursor-pointer flex-1 px-4 py-2 border rounded-md text-center font-medium transition duration-300 ₹{
                            isInWishlist
                              ? "bg-red-50 text-red-600 border-red-600"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex items-center justify-center">
                            <svg
                              className="w-5 h-5 mr-1"
                              fill={isInWishlist ? "currentColor" : "none"}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            Wishlist
                          </span>
                        </button>

                        {role === "Admin" && <button
                          onClick={editPackage}
                          className={`flex-1 px-4 py-2 border rounded-md text-center font-medium transition duration-300 border-gray-300 text-gray-700 hover:bg-gray-50`}
                        >
                          Edit
                        </button>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-blue-50 rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                <p className="text-gray-700 mb-4">
                  Have questions about this tour? Our travel experts are ready to assist you.
                </p>
                <div className="space-y-3">
                  <a href="tel:+918299359282" className="flex items-center text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    +91 8299359282
                  </a>
                  <a href="mailto:ankityadav8299blp@gmail.com" className="flex items-center text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    ankityadav8299blp@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PackageDetails
