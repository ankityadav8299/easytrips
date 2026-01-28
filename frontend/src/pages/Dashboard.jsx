import React from "react";
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Dashboard = () => {
  // Mock user data
  const user = {
    name: "John Doe",
    upcomingTrips: 2,
    completedTrips: 5,
    savedTrips: 3,
    wishlistTrips: 7,
  }

  // Mock upcoming bookings
  const upcomingBookings = [
    {
      id: 1,
      name: "Bali Paradise Escape",
      image: "/lukhnow.jpg?height=200&width=300",
      startDate: "2023-08-15",
      endDate: "2023-08-22",
      status: "Confirmed",
      price: 1299,
    },
    {
      id: 2,
      name: "Swiss Alps Adventure",
      image: "/lukhnow.jpg?height=200&width=300",
      startDate: "2023-09-10",
      endDate: "2023-09-18",
      status: "Pending Payment",
      price: 1899,
    },
  ]

  // Mock recommended packages
  const recommendedPackages = [
    {
      id: 1,
      name: "Tokyo City Explorer",
      image: "/lukhnow.jpg?height=200&width=300",
      price: 1599,
      duration: "6 days",
      rating: 4.7,
    },
    {
      id: 2,
      name: "Egyptian Wonders",
      image: "/lukhnow.jpg?height=200&width=300",
      price: 1499,
      duration: "9 days",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Santorini Getaway",
      image: "/lukhnow.jpg?height=200&width=300",
      price: 1299,
      duration: "5 days",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Amazon Rainforest Expedition",
      image: "/lukhnow.jpg?height=200&width=300",
      price: 1799,
      duration: "7 days",
      rating: 4.5,
    },
  ]

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
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your travel plans.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-500 font-medium">Upcoming Trips</p>
                <p className="text-2xl font-bold text-blue-600">{user.upcomingTrips}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Completed Trips</p>
                <p className="text-2xl font-bold text-green-700">{user.completedTrips}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Saved Trips</p>
                <p className="text-2xl font-bold text-purple-700">{user.savedTrips}</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-pink-600 font-medium">Wishlist</p>
                <p className="text-2xl font-bold text-pink-700">{user.wishlistTrips}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Upcoming Trips</h2>

            {upcomingBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                      <div className="md:flex-shrink-0">
                        <img
                          className="h-48 w-full object-cover md:w-48"
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.name}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900">{booking.name}</h3>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ₹{
                              booking.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                        <p className="mt-1 text-gray-600">
                          <span className="font-semibold">₹{booking.price}</span> total
                        </p>
                        <div className="mt-4 flex space-x-3">
                          <Link
                            to={`/orders/₹{booking.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                          >
                            View Details
                          </Link>
                          {booking.status === "Pending Payment" && (
                            <Link
                              to={`/checkout/₹{booking.id}`}
                              className="text-sm font-medium text-green-600 hover:text-green-500"
                            >
                              Complete Payment
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">You don't have any upcoming trips.</p>
                <Link
                  to="/browse"
                  className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
                >
                  Browse Packages
                </Link>
              </div>
            )}
          </div>

          {/* Recommended Packages */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <img src={pkg.image || "/placeholder.svg"} alt={pkg.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">{pkg.duration}</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{pkg.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-500">₹{pkg.price}</span>
                      <Link
                        to={`/destination/${pkg.id}`}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/browse"
                className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-300"
              >
                Explore More Packages
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
