import React from "react";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const handleLogout = () => {
    logout();
    console.log("logout");
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-500">
                EasyTrips
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition duration-300 ease-in-out hover:text-blue-600 hover:after:w-full after:transition-all after:duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600">
              <span className="flex items-center">
                <span className="mr-1">🏠</span> Home
              </span>
            </Link>
            <Link to="/browse" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition duration-300 ease-in-out hover:text-blue-600 hover:after:w-full after:transition-all after:duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600">
              <span className="flex items-center">
                <span className="mr-1">🧳</span> Browse Packages
              </span>
            </Link>
            <Link to="/help" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition duration-300 ease-in-out hover:text-blue-600 hover:after:w-full after:transition-all after:duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600">
              <span className="flex items-center">
                <span className="mr-1">📞</span> Help
              </span>
            </Link>

            {role === 'Admin' &&  <Link to="/add-destination" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition duration-300 ease-in-out hover:text-blue-600 hover:after:w-full after:transition-all after:duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600">
              <span className="flex items-center">
                Add Destination
              </span>
            </Link>}

            {isAuthenticated ? (
              <div className="relative ml-3">
                <div className="flex items-center space-x-4">
                  <Link to="/notifications" className="text-gray-700 hover:text-blue-500">
                    <span className="relative">
                      <span>🔔</span>
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                        3
                      </span>
                    </span>
                  </Link>

                  <button
                    onClick={toggleProfile}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 px-3 py-2 transition duration-300 ease-in-out hover:text-blue-600 hover:bg-blue-100 rounded-md shadow-sm hover:shadow-md"
                  >
                    <span className="mr-1">👤</span>
                    <span>Profile</span>
                  </button>
                </div>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile / Account
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Wishlist
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>                    
                    <button
                      onClick={()=> handleLogout()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span className="mr-1">🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium text-blue-500 border border-blue-600 hover:bg-blue-100"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            {isAuthenticated && (
              <Link to="/notifications" className="mr-4 text-gray-700">
                <span className="relative">
                  <span>🔔</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </span>
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500">
              <span className="flex items-center">
                <span className="mr-1">🏠</span> Home
              </span>
            </Link>
            <Link
              to="/browse"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500"
            >
              <span className="flex items-center">
                <span className="mr-1">🧳</span> Browse Packages
              </span>
            </Link>
            <Link
              to="/help"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500"
            >
              <span className="flex items-center">
                <span className="mr-1">📞</span> Help
              </span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500"
                >
                  Profile / Account
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500"
                >
                  My Orders
                </Link>
                <Link
                  to="/saved"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500"
                >
                  Saved
                </Link>
                <Link
                  to="/wishlist"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500"
                >
                  Wishlist
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500"
                >
                  <span className="mr-1">🚪</span> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium text-blue-500 border border-blue-600 hover:bg-blue-100 text-center"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
