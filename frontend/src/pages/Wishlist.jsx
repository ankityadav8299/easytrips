import React from "react";

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Wishlist = () => {
  // Mock data for wishlist items
  const [wishlistItems, setWishlistItems] = useState([]);

  // Remove from wishlist
  const removeFromWishlist = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/${id}/rem`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    console.log("Remove from wishlist response:", data);
    if (!response.ok) {
      toast.error("Failed to remove item from wishlist. Please try again.");
      return;
    }
    setWishlistItems((prevWishlist) =>
      prevWishlist.filter((item) => String(item._id) !== String(id))
    );

    toast.success("Removed from wishlist!");
  }

  useEffect(() => {
    const fetchWishlist = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/wishlist`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data  = await response.json();
      console.log("Wishlist items fetched:", data);
      if (!response.ok) {
        toast.error("Failed to fetch wishlist items. Please refresh the page.");
        console.error("Error fetching wishlist items:", data.message);
      }
      else {
        setWishlistItems(data.wishlistItems);
      }
    }
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl"
                >
                  <div className="relative">
                    <img src={item?.imageUrl?.[0] || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300"
                      aria-label="Remove from wishlist"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">{item.duration}</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Best time: {item.bestTime}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-600">₹{item.price}</span>
                      <div className="flex space-x-2">
                        <Link
                          to={`/destination/${item._id}`}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-5xl mb-4">💭</div>
              <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">
                Browse our packages and add your favorites to your wishlist for easy access later.
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

export default Wishlist
