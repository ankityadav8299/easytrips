import React from "react";

import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Notifications = () => {
  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "status",
      title: "Your trip to Bali is confirmed!",
      message: "Your booking for Bali Paradise Escape has been confirmed. Get ready for an amazing adventure!",
      date: "2023-07-15T10:30:00",
      isRead: false,
      link: "/orders/1",
    },
    {
      id: 2,
      type: "offer",
      title: "Limited Time Offer: 20% Off!",
      message: "Enjoy 20% off on all European destinations. Book before July 31st to avail this offer.",
      date: "2023-07-14T09:15:00",
      isRead: false,
      link: "/browse",
    },
    {
      id: 3,
      type: "feedback",
      title: "Share your experience",
      message: "How was your trip to Tokyo? Share your feedback and help other travelers.",
      date: "2023-07-12T14:45:00",
      isRead: true,
      link: "/feedback/3",
    },
    {
      id: 4,
      type: "status",
      title: "Payment Successful",
      message: "Your payment of ₹1899 for Swiss Alps Adventure has been processed successfully.",
      date: "2023-07-10T16:20:00",
      isRead: true,
      link: "/orders/2",
    },
    {
      id: 5,
      type: "announcement",
      title: "New Destinations Added",
      message: "Explore our newly added destinations in South America. Perfect for your next adventure!",
      date: "2023-07-05T11:10:00",
      isRead: true,
      link: "/browse",
    },
  ])

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    )
  }

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `₹{diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "status":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )
      case "offer":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
        )
      case "feedback":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
        )
      case "announcement":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          </div>
        )
      default:
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )
    }
  }

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 ₹{notification.isRead ? "" : "bg-blue-50"}`}
                  >
                    <Link
                      to={notification.link}
                      className="flex items-start"
                      onClick={() => markAsRead(notification.id)}
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p
                              className={`text-sm font-medium ₹{notification.isRead ? "text-gray-900" : "text-blue-600"}`}
                            >
                              {notification.title}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end">
                            <p className="text-xs text-gray-500">{formatDate(notification.date)}</p>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="mt-1 text-xs text-gray-400 hover:text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-5xl mb-4">🔔</div>
              <h2 className="text-2xl font-semibold mb-4">No notifications</h2>
              <p className="text-gray-600 mb-6">
                You're all caught up! We'll notify you when there are updates about your trips or special offers.
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

export default Notifications
