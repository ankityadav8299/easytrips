import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Help = () => {
  // Contact information
  const contactInfo = {
    email: "ankityadav8299blp@gmail.com",
    phone: "8299359282"
  };

  // Handle email click
  const handleEmailClick = () => {
    window.location.href = `mailto:${contactInfo.email}`;
  };

  // Handle phone click
  const handlePhoneClick = () => {
    window.location.href = `tel:${contactInfo.phone}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Help & Support</h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-6">
                We're here to help! If you have any questions, concerns, or need assistance with your booking, please don't hesitate to reach out to us using the contact information below.
              </p>

              <div className="space-y-6">
                {/* Email Contact */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="mt-1 text-gray-600">
                      <button 
                        onClick={handleEmailClick}
                        className="text-blue-500 hover:underline"
                      >
                        {contactInfo.email}
                      </button>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">We'll respond to your email within 24 hours.</p>
                  </div>
                </div>

                {/* Phone Contact */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <p className="mt-1 text-gray-600">
                      <button 
                        onClick={handlePhoneClick}
                        className="text-blue-500 hover:underline"
                      >
                        {contactInfo.phone}
                      </button>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">Available Monday-Friday, 9am-6pm IST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">How do I cancel my booking?</h3>
                  <p className="mt-1 text-gray-600">You can cancel your booking by going to "My Orders" section in your account dashboard and selecting the booking you wish to cancel. Please note our cancellation policy applies.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
                  <p className="mt-1 text-gray-600">We accept all major credit cards, debit cards, and digital payment methods including PayPal, Google Pay, and Apple Pay.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">How can I modify my reservation?</h3>
                  <p className="mt-1 text-gray-600">To modify your reservation, please contact our customer support team via email or phone with your booking reference number.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Do you offer travel insurance?</h3>
                  <p className="mt-1 text-gray-600">Yes, we offer comprehensive travel insurance options that you can add during the checkout process.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;