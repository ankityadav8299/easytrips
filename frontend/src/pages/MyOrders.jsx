import React from "react";

import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const MyOrders = () => {
  // Mock data for orders
  const [orders, setOrders] = useState([
    {
      id: 1,
      packageName: "Bali Paradise Escape",
      image: "/placeholder.svg?height=150&width=250",
      bookingDate: "2023-07-15",
      startDate: "2023-08-15",
      endDate: "2023-08-22",
      totalAmount: 1299,
      status: "completed",
      hasFeedback: true,
    },
    {
      id: 2,
      packageName: "Swiss Alps Adventure",
      image: "/placeholder.svg?height=150&width=250",
      bookingDate: "2023-07-20",
      startDate: "2023-09-10",
      endDate: "2023-09-18",
      totalAmount: 1899,
      status: "upcoming",
      hasFeedback: false,
    },
    {
      id: 3,
      packageName: "Tokyo City Explorer",
      image: "/placeholder.svg?height=150&width=250",
      bookingDate: "2023-06-05",
      startDate: "2023-07-10",
      endDate: "2023-07-16",
      totalAmount: 1599,
      status: "completed",
      hasFeedback: false,
    },
  ])

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status label and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "completed":
        return { label: "Completed", color: "bg-green-100 text-green-800" }
      case "upcoming":
        return { label: "Upcoming", color: "bg-blue-100 text-blue-800" }
      case "cancelled":
        return { label: "Cancelled", color: "bg-red-100 text-red-800" }
      case "in-progress":
        return { label: "In Progress", color: "bg-yellow-100 text-yellow-800" }
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" }
    }
  }

  // Download invoice
  const downloadInvoice = (orderId) => {
    // In a real app, this would generate and download an invoice
    alert(`Downloading invoice for order #₹{orderId}...`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status)

                return (
                  <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                      <div className="md:flex-shrink-0">
                        <img
                          className="h-48 w-full object-cover md:w-48"
                          src={order.image || "/placeholder.svg"}
                          alt={order.packageName}
                        />
                      </div>
                      <div className="p-6 w-full">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-lg font-semibold text-gray-900 mr-3">{order.packageName}</h3>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ₹{statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </div>

                            <p className="text-gray-600 mt-2">
                              <span className="font-medium">Booking Date:</span> {formatDate(order.bookingDate)}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Travel Period:</span> {formatDate(order.startDate)} -{" "}
                              {formatDate(order.endDate)}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Total Amount:</span> ₹{order.totalAmount}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <Link
                                to={`/orders/₹{order.id}`}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                              >
                                View Details
                              </Link>

                              <button
                                onClick={() => downloadInvoice(order.id)}
                                className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition duration-300"
                              >
                                Download Invoice
                              </button>

                              {order.status === "completed" && !order.hasFeedback && (
                                <Link
                                  to={`/feedback/₹{order.id}`}
                                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                                >
                                  Leave Feedback
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Tour Status Visualization */}
                          <div className="mt-6 md:mt-0">
                            <div className="flex flex-col items-center">
                              <div className="relative">
                                <div className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ₹{
                                      order.status !== "cancelled" ? "bg-green-500 text-white" : "bg-gray-300"
                                    }`}
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div
                                    className={`w-16 h-1 ₹{
                                      ["in-progress", "completed"].includes(order.status)
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  ></div>
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ₹{
                                      ["in-progress", "completed"].includes(order.status)
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-300"
                                    }`}
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div
                                    className={`w-16 h-1 ₹{
                                      order.status === "completed" ? "bg-green-500" : "bg-gray-300"
                                    }`}
                                  ></div>
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ₹{
                                      order.status === "completed" ? "bg-green-500 text-white" : "bg-gray-300"
                                    }`}
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-600 w-full">
                                  <span>Payment Done</span>
                                  <span>Tour Started</span>
                                  <span>Tour Ended</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-5xl mb-4">🧳</div>
              <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't booked any tours yet. Start exploring our packages and book your dream vacation!
              </p>
              <Link
                to="/browse"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
              >
                Browse Packages
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default MyOrders
