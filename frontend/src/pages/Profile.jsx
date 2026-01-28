import React, { useEffect } from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  // Tabs
  const [activeTab, setActiveTab] = useState("profile");

  // Individual state variables for each form field
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [clearSearchHistory, setClearSearchHistory] = useState(false);
  const [profile, setProfile] = useState([]);
  const { logout } = useAuth();

  const navigate = useNavigate();

  // States for form handling
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/profile/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          setErrors(data);
        } else {
          setName(data.user.name);
          setEmail(data.user.email);
          setPhone(data.phone);
          setAddress(data.address);
          setGstNumber(data.GSTIN);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrors({ message: "Something went wrong." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profile]);

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        address,
        gstin: gstNumber,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setErrors(data);
      return;
    }

    setProfile(data.profile);
    setIsLoading(false);
    toast.success("Profile updated successfully!");
  };

  // Mock trip data for insights
  const tripData = {
    totalTrips: 5,
    totalSpent: 7495,
    favoriteCategory: "Beach",
    moneySaved: 1250,
    tripsByCategory: [
      { category: "Beach", count: 2 },
      { category: "Mountain", count: 1 },
      { category: "City", count: 1 },
      { category: "Cultural", count: 1 },
    ],
    popularDestinations: [
      { destination: "Bali", percentage: 40 },
      { destination: "Switzerland", percentage: 25 },
      { destination: "Tokyo", percentage: 20 },
      { destination: "Egypt", percentage: 15 },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ₹{
                    activeTab === "profile"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Profile & Settings
                </button>
                <button
                  onClick={() => setActiveTab("insights")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ₹{
                    activeTab === "insights"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Travel Insights
                </button>
              </nav>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Personal Information
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={email}
                            disabled
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Address
                          </label>
                          <textarea
                            id="address"
                            name="address"
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          ></textarea>
                        </div>

                        <div>
                          <label
                            htmlFor="gstNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            GST Number (Optional)
                          </label>
                          <input
                            type="text"
                            id="gstNumber"
                            name="gstNumber"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={gstNumber}
                            onChange={(e) => setGstNumber(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Preferences
                      </h2>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Email Notifications
                          </span>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                            <input
                              type="checkbox"
                              id="emailNotifications"
                              name="emailNotifications"
                              className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-gray-300 checked:right-0 checked:border-blue-600 checked:bg-blue-600"
                              checked={emailNotifications}
                              onChange={(e) =>
                                setEmailNotifications(e.target.checked)
                              }
                            />
                            <label
                              htmlFor="emailNotifications"
                              className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-gray-300 peer-checked:bg-blue-300"
                            ></label>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to clear your search history?"
                                )
                              ) {
                                setClearSearchHistory(true);
                                alert("Search history cleared!");
                              }
                            }}
                          >
                            Clear Search History
                          </button>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => {logout(); navigate("/");}}
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={(e) => handleSubmit(e)}
                      className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}

                    </button>

                  </div>
                </form>
              </div>
            )}

            {/* Insights Tab */}
            {activeTab === "insights" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Your Travel Insights
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">
                      Total Trips
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {tripData.totalTrips}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">
                      Total Spent
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      ₹{tripData.totalSpent}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">
                      Favorite Category
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {tripData.favoriteCategory}
                    </p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <p className="text-sm text-pink-600 font-medium">
                      Money Saved
                    </p>
                    <p className="text-2xl font-bold text-pink-700">
                      ₹{tripData.moneySaved}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Bar Chart: Trips by Category */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">
                      Trips by Category
                    </h3>
                    <div className="space-y-4">
                      {tripData.tripsByCategory.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              {item.category}
                            </span>
                            <span className="text-sm text-gray-600">
                              {item.count}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{
                                width: `₹{(item.count / tripData.totalTrips) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pie Chart: Popular Destinations */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">
                      Popular Destinations
                    </h3>
                    <div className="flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        {/* Simple pie chart visualization */}
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div
                            className="absolute bg-blue-500"
                            style={{
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              clipPath: `polygon(50% 50%, 50% 0%, ₹{50 + 50 * Math.cos((tripData.popularDestinations[0].percentage * 3.6 * Math.PI) / 180)}% ₹{50 - 50 * Math.sin((tripData.popularDestinations[0].percentage * 3.6 * Math.PI) / 180)}%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)`,
                            }}
                          ></div>
                          <div
                            className="absolute bg-green-500"
                            style={{
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              clipPath: `polygon(50% 50%, ₹{50 + 50 * Math.cos((tripData.popularDestinations[0].percentage * 3.6 * Math.PI) / 180)}% ₹{50 - 50 * Math.sin((tripData.popularDestinations[0].percentage * 3.6 * Math.PI) / 180)}%, ₹{50 + 50 * Math.cos(((tripData.popularDestinations[0].percentage + tripData.popularDestinations[1].percentage) * 3.6 * Math.PI) / 180)}% ₹{50 - 50 * Math.sin(((tripData.popularDestinations[0].percentage + tripData.popularDestinations[1].percentage) * 3.6 * Math.PI) / 180)}%, 100% 100%, 0% 100%)`,
                            }}
                          ></div>
                          <div
                            className="absolute bg-purple-500"
                            style={{
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              clipPath: `polygon(50% 50%, ₹{50 + 50 * Math.cos(((tripData.popularDestinations[0].percentage + tripData.popularDestinations[1].percentage) * 3.6 * Math.PI) / 180)}% ₹{50 - 50 * Math.sin(((tripData.popularDestinations[0].percentage + tripData.popularDestinations[1].percentage) * 3.6 * Math.PI) / 180)}%, ₹{50 + 50 * Math.cos(((tripData.popularDestinations[0].percentage + tripData.popularDestinations[1].percentage + tripData.popularDestinations[2].percentage) * 3.6 * Math.PI) / 180)}% ₹{50 - 50 * Math.sin(((tripData.popularDestinations[0].percentage + tripData.popularDestinations[1].percentage + tripData.popularDestinations[2].percentage) * 3.6 * Math.PI) / 180)}%, 0% 100%)`,
                            }}
                          ></div>
                          <div
                            className="absolute bg-yellow-500"
                            style={{
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              clipPath: `polygon(50% 50%, ₹{50 + 50 * Math.cos(((tripData.popularDestinations[0].percentage + tripData.popularDestinations[1].percentage + tripData.popularDestinations[2].percentage) * 3.6 * Math.PI) / 180)}% ₹{50 - 50 * Math.sin(((tripData.popularDestinations[0].percentage + tripData.popularDestinations[1].percentage + tripData.popularDestinations[2].percentage) * 3.6 * Math.PI) / 180)}%, 0% 0%)`,
                            }}
                          ></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {tripData.popularDestinations.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ₹{
                              index === 0
                                ? "bg-blue-500"
                                : index === 1
                                  ? "bg-green-500"
                                  : index === 2
                                    ? "bg-purple-500"
                                    : "bg-yellow-500"
                            }`}
                          ></div>
                          <span className="text-sm text-gray-700">
                            {item.destination} ({item.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Footer />
    </div>
  );
};

export default Profile;
