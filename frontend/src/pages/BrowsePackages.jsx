import React, { useEffect } from "react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BrowsePackages = () => {
  // Mock data for tour packages
  const [allPackages, setAllPackages] = useState([]);
  const { user, role } = useAuth();
  useEffect(() => {
    const fetchPackages = async () => {
      // Simulating an API call to fetch packages
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/destinations/`,
        {
          method: "GET",
        }
      ); // Replace with your actual API endpoint
      const data = await response.json();
      setAllPackages(data);
      setWishlist(data.filter((pkg) => pkg.wishlistedBy.includes(user?._id)).map((pkg) => pkg._id));
    };
    fetchPackages();
  }, [user?._id]);

  // Filter states
  const [filters, setFilters] = useState({
    duration: "",
    priceRange: "",
    rating: "",
    bestTime: "",
    category: "",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Wishlist and Saved states
  const [wishlist, setWishlist] = useState([]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Toggle wishlist
  const toggleWishlist = async (id) => {
    const isInWishlist = wishlist.includes(id);

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
    if (isInWishlist) {
      setWishlist(wishlist.filter((wId) => String(wId) !== String(id)));
    } else {
      setWishlist([...wishlist, id]);
    }
  };


  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        ` ${import.meta.env.VITE_API_URL}/destination/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        // Remove from local state if you're storing it
        toast.success("Package deleted successfully");
        setAllPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      } else {
        toast.error("Failed to delete package");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Apply filters and search
  const filteredPackages = allPackages.filter((pkg) => {
    // Apply duration filter
    if (
      filters.duration &&
      !pkg.duration.includes(filters.duration.split(" ")[0])
    ) {
      return false;
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (pkg.price < min || (max && pkg.price > max)) {
        return false;
      }
    }

    // Apply rating filter
    if (
      filters.rating &&
      (pkg.ratings?.average ?? 0) < Number.parseFloat(filters.rating)
    ) {
      return false;
    }

    // Apply best time filter
    if (filters.bestTime && !pkg.bestTimeToVisit.includes(filters.bestTime)) {
      return false;
    }

    // Apply category filter
    if (filters.category && pkg.category !== filters.category) {
      return false;
    }

    // Apply search query
    if (
      searchQuery &&
      !pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Browse Tour Packages
          </h1>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for destinations, tours, activities..."
                className="w-full px-4 py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>

                <div className="space-y-6">
                  {/* Duration Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                      name="duration"
                      value={filters.duration}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any Duration</option>
                      <option value="3 days">1-3 days</option>
                      <option value="5 days">4-7 days</option>
                      <option value="8 days">8+ days</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select
                      name="priceRange"
                      value={filters.priceRange}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any Price</option>
                      <option value="0-1000">Under ₹2000</option>
                      <option value="1000-1500">₹2,000 - ₹3,000</option>
                      <option value="1500-2000">₹3,500 - ₹5,000</option>
                      <option value="2000-">₹5,000+</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Rating
                    </label>
                    <select
                      name="rating"
                      value={filters.rating}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5 & Up</option>
                      <option value="4.0">4.0 & Up</option>
                      <option value="3.5">3.5 & Up</option>
                    </select>
                  </div>

                  {/* Best Time Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Best Time to Visit
                    </label>
                    <select
                      name="bestTime"
                      value={filters.bestTime}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any Time</option>
                      <option value="Jan">January</option>
                      <option value="Feb">February</option>
                      <option value="Mar">March</option>
                      <option value="Apr">April</option>
                      <option value="May">May</option>
                      <option value="Jun">June</option>
                      <option value="Jul">July</option>
                      <option value="Aug">August</option>
                      <option value="Sep">September</option>
                      <option value="Oct">October</option>
                      <option value="Nov">November</option>
                      <option value="Dec">December</option>
                    </select>
                  </div>

                  {/* Category Filter
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      <option value="beach">Beach</option>
                      <option value="mountain">Mountain</option>
                      <option value="city">City</option>
                      <option value="cultural">Cultural</option>
                      <option value="adventure">Adventure</option>
                    </select>
                  </div> */}

                  {/* Reset Filters Button */}
                  <button
                    onClick={() => {
                      setFilters({
                        duration: "",
                        priceRange: "",
                        rating: "",
                        bestTime: "",
                        category: "",
                      });
                      setSearchQuery("");
                    }}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Package List */}
            <div className="lg:w-3/4">
              {filteredPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg) => (
                    <div
                      key={pkg._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="relative">
                        <img
                          src={
                            pkg.imageUrl && pkg.imageUrl.length > 0
                              ? pkg.imageUrl[0]
                              : "/placeholder.svg"
                          }
                          alt={pkg.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          {role === "Admin" && (
                            <button
                              onClick={() => handleDelete(pkg._id)}
                              className="p-2 rounded-full bg-white text-red-600 hover:bg-red-100"
                              aria-label="Delete Package"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 011-1h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5H2a1 1 0 110-2h3V2zm2 3a1 1 0 00-1 1v9a1 1 0 102 0V6a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v9a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => toggleWishlist(pkg._id)}
                            className={`p-2 rounded-full ${wishlist.includes(pkg._id)
                                ? "bg-red-500 text-white"
                                : "bg-white text-gray-600"
                              }`}
                            aria-label={
                              wishlist.includes(pkg._id)
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          {/* <button
                            onClick={() => toggleSaved(pkg._id)}
                            className={`p-2 rounded-full ${
                              saved.includes(pkg._id)
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-600"
                            }`}
                            aria-label={
                              saved.includes(pkg._id)
                                ? "Remove from saved"
                                : "Save for later"
                            }
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                          </button> */}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {pkg.name}
                        </h3>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-600">{pkg.duration}</span>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-yellow-400 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{pkg.ratings?.average ?? 0}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          <div>Group size: {pkg.groupSize}</div>
                          <div>Best time: {pkg.bestTimeToVisit}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-blue-600">
                            ₹{pkg.price}
                          </span>
                          <Link
                            to={`/destination/${pkg._id}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-lg text-gray-600 mb-4">
                    No packages found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        duration: "",
                        priceRange: "",
                        rating: "",
                        bestTime: "",
                        category: "",
                      });
                      setSearchQuery("");
                    }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrowsePackages;
