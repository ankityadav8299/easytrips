import React from "react"
import { useNavigate, useLocation, data } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Plus,
    Minus,
    Upload,
    X,
    MapPin,
    Calendar,
    Users,
    Clock,
    DollarSign,
    FileText,
    Camera,
    CheckCircle,
    XCircle,
    Star,
} from "lucide-react"
import { useEffect } from "react"

const AddDestination = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dataState = location.state || {};
    const { user, role } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [newEntry, setNewEntry] = useState(
        dataState.newEntry !== undefined ? dataState.newEntry : true
    );


    useEffect(() => {
        console.log("User:", user, "Role:", role);
        if (!user || role !== "Admin") {
            toast.error("Unauthorized to access this page");
            navigate("/");
            return;
        }
    }, [user, navigate, role]);

    const [formData, setFormData] = useState({
        name: dataState.name || "",
        description: dataState.description || "",
        highlights: dataState.highlights || [""],
        bestTimeToVisit: dataState.bestTimeToVisit || "",
        groupSize: dataState.groupSize || "",
        duration: dataState.duration || "",
        location: dataState.location || "",
        images: dataState.imageUrl
            ? dataState.imageUrl.map(url => ({
                preview: url,
                name: url.split("/").pop(),
                existing: true,
            }))
            : [],
        price: dataState.price || "",
        availability: dataState.availability || true,
        itinerary: dataState.itinerary || [{ day: 1, activities: [""] }],
        whatIncluded: dataState.included || [""],
        whatNotIncluded: dataState.notIncluded || [""],
        cancellationPolicy: dataState.cancellationPolicy || "",
        termsAndConditions: dataState.termsAndConditions || "",
        tourOperator: dataState.tourOperator || [{ name: "", mobile: "", email: "" }],
    });

    const locations = ["Lucknow", "Banaras (Varanasi)", "Delhi", "Uttarakhand", "Mumbai", "Goa", "Rajasthan", "Kerala"]

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleArrayChange = (field, index, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) => (i === index ? value : item)),
        }))
    }

    const addArrayItem = (field) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...prev[field], ""],
        }))
    }

    const removeArrayItem = (field, index) => {
        if (formData[field].length > 1) {
            setFormData((prev) => ({
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index),
            }))
        }
    }

    const handleItineraryChange = (dayIndex, activityIndex, value) => {
        setFormData((prev) => ({
            ...prev,
            itinerary: prev.itinerary.map((day, i) =>
                i === dayIndex
                    ? {
                        ...day,
                        activities: day.activities.map((activity, j) => (j === activityIndex ? value : activity)),
                    }
                    : day,
            ),
        }))
    }

    const addItineraryDay = () => {
        setFormData((prev) => ({
            ...prev,
            itinerary: [
                ...prev.itinerary,
                {
                    day: prev.itinerary.length + 1,
                    activities: [""],
                },
            ],
        }))
    }

    const removeItineraryDay = (index) => {
        if (formData.itinerary.length > 1) {
            setFormData((prev) => ({
                ...prev,
                itinerary: prev.itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 })),
            }))
        }
    }

    const addItineraryActivity = (dayIndex) => {
        setFormData((prev) => ({
            ...prev,
            itinerary: prev.itinerary.map((day, i) =>
                i === dayIndex ? { ...day, activities: [...day.activities, ""] } : day,
            ),
        }))
    }

    const removeItineraryActivity = (dayIndex, activityIndex) => {
        setFormData((prev) => ({
            ...prev,
            itinerary: prev.itinerary.map((day, i) =>
                i === dayIndex
                    ? {
                        ...day,
                        activities: day.activities.filter((_, j) => j !== activityIndex),
                    }
                    : day,
            ),
        }))
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        if (formData.images.length + files.length <= 10) {
            console.log("Selected files:", files);
            const newImages = files.map((file) => ({
                file: file,
                preview: URL.createObjectURL(file),
                name: file.name,
            }))
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...newImages],
            }))
        } else {
            alert("Maximum 10 images allowed")
        }
    }

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Build FormData for multipart/form-data
        const formDataToSend = new FormData();

        // Append simple fields
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("bestTimeToVisit", formData.bestTimeToVisit);
        formDataToSend.append("groupSize", formData.groupSize);
        formDataToSend.append("duration", formData.duration);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("availability", formData.availability);
        formDataToSend.append("cancellationPolicy", formData.cancellationPolicy);
        formDataToSend.append("termsAndConditions", formData.termsAndConditions);

        // Append array fields
        formData.highlights.forEach((highlight) => {
            formDataToSend.append("highlights[]", highlight);
        });
        formData.whatIncluded.forEach((item) => {
            formDataToSend.append("whatIncluded[]", item);
        });
        formData.whatNotIncluded.forEach((item) => {
            formDataToSend.append("whatNotIncluded[]", item);
        });

        // Append itinerary as JSON strings
        formData.itinerary.forEach((day) => {
            formDataToSend.append("itinerary[]", JSON.stringify(day));
        });

        // Append tourOperator as JSON strings
        formData.tourOperator.forEach((operator) => {
            formDataToSend.append("tourOperator[]", JSON.stringify(operator));
        });

        // Append images (actual files)
        formData.images.forEach((imgObj) => {
            if (imgObj.file) {
                formDataToSend.append("images", imgObj.file);
            }
        });

        // --- Add this block inside handleSubmit, before uploading images ---
        if (!newEntry) {
            const existingImages = formData.images
                .filter(imgObj => imgObj.existing)
                .map(imgObj => imgObj.preview);

            existingImages.forEach(url => {
                formDataToSend.append("existingImages[]", url);
            });
        }

        try {
            if (newEntry) {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/add-destination`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        // DO NOT set Content-Type here, browser will set it automatically for FormData
                    },
                    body: formDataToSend,
                });
                const data = await response.json();
                if (response.ok) {
                    toast.success("Tour package created successfully!");
                    navigate(`/destination/${data.destination}`);
                } else {
                    toast.error(data.message || "Failed to create tour package");
                }
            } else {
                // for (const key of formDataToSend.keys()) {
                //     console.log(`${key}: ${formDataToSend.get(key)}`);
                // }
                const response = await fetch(`${import.meta.env.VITE_API_URL}/update-destination/${dataState._id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: formDataToSend,
                });
                const data = await response.json();
                if (response.ok) {
                    toast.success("Tour package updated successfully!");
                    navigate(`/destination/${dataState._id}`);
                } else {
                    toast.error(data.message || "Failed to create tour package");
                }
            }
        } catch (error) {
            toast.error("An error occurred while creating the package");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    // Compute images to preview
    let previewImages = [];
    if (!newEntry && dataState.imageUrl && dataState.imageUrl.length > 0) {
        previewImages = dataState.imageUrl.map((url) => ({
            preview: url,
            name: url.split("/").pop(),
            existing: true,
        }));
    } else {
        previewImages = formData.images;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-blue-600 px-6 py-4">
                            <h1 className="text-2xl font-bold text-white">Create New Tour Package</h1>
                            <p className="text-blue-100 mt-1">Fill in the details to create an amazing tour experience</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                    Basic Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Package Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter package name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <MapPin className="w-4 h-4 inline mr-1" />
                                            Location *
                                        </label>
                                        <select
                                            value={formData.location}
                                            onChange={(e) => handleInputChange("location", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Location</option>
                                            {locations.map((location) => (
                                                <option key={location} value={location}>
                                                    {location}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Describe your tour package..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Highlights */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <Star className="w-5 h-5 mr-2 text-blue-600" />
                                    Tour Highlights
                                </h3>
                                {formData.highlights.map((highlight, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={highlight}
                                            onChange={(e) => handleArrayChange("highlights", index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter highlight"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem("highlights", index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                            disabled={formData.highlights.length === 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem("highlights")}
                                    className="flex items-center text-blue-600 hover:text-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Highlight
                                </button>
                            </div>

                            {/* Trip Details */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Trip Details</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Best Time to Visit
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.bestTimeToVisit}
                                            onChange={(e) => handleInputChange("bestTimeToVisit", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., Oct-Mar"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Users className="w-4 h-4 inline mr-1" />
                                            Group Size
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.groupSize}
                                            onChange={(e) => handleInputChange("groupSize", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., 2-8 people"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => handleInputChange("duration", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., 5 days 4 nights"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="w-4 h-4 inline mr-1" />
                                            Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange("price", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter price"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="availability"
                                        checked={formData.availability}
                                        onChange={(e) => handleInputChange("availability", e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="availability" className="ml-2 text-sm text-gray-700">
                                        Package is available for booking
                                    </label>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <Camera className="w-5 h-5 mr-2 text-blue-600" />
                                    Images (Max 10)
                                </h3>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600">Click to upload images ({formData.images.length}/10)</span>
                                    </label>
                                </div>

                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={image.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Itinerary */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Day-by-Day Itinerary</h3>

                                {formData.itinerary.map((day, dayIndex) => (
                                    <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-gray-900">Day {day.day}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeItineraryDay(dayIndex)}
                                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                                                disabled={formData.itinerary.length === 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {day.activities.map((activity, activityIndex) => (
                                            <div key={activityIndex} className="flex items-center space-x-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={activity}
                                                    onChange={(e) => handleItineraryChange(dayIndex, activityIndex, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter activity"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeItineraryActivity(dayIndex, activityIndex)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                                    disabled={day.activities.length === 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => addItineraryActivity(dayIndex)}
                                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Activity
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addItineraryDay}
                                    className="flex items-center text-blue-600 hover:text-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Day
                                </button>
                            </div>

                            {/* What's Included */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                        What's Included
                                    </h3>
                                    {formData.whatIncluded.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => handleArrayChange("whatIncluded", index, e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter included item"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem("whatIncluded", index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                                disabled={formData.whatIncluded.length === 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem("whatIncluded")}
                                        className="flex items-center text-blue-600 hover:text-blue-700"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Item
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <XCircle className="w-5 h-5 mr-2 text-red-600" />
                                        What's Not Included
                                    </h3>
                                    {formData.whatNotIncluded.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => handleArrayChange("whatNotIncluded", index, e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter excluded item"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem("whatNotIncluded", index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                                disabled={formData.whatNotIncluded.length === 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem("whatNotIncluded")}
                                        className="flex items-center text-blue-600 hover:text-blue-700"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Item
                                    </button>
                                </div>
                            </div>

                            {/* Policies */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">Policies</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                                    <textarea
                                        value={formData.cancellationPolicy}
                                        onChange={(e) => handleInputChange("cancellationPolicy", e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter cancellation policy details..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Terms and Conditions</label>
                                    <textarea
                                        value={formData.termsAndConditions}
                                        onChange={(e) => handleInputChange("termsAndConditions", e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter terms and conditions..."
                                    />
                                </div>
                            </div>

                            {/* Tour Operators */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                                    Tour Operators
                                </h3>
                                {formData.tourOperator.map((operator, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                            <input
                                                type="text"
                                                value={operator.name || ""}
                                                onChange={e => {
                                                    const updated = [...formData.tourOperator];
                                                    updated[index] = { ...updated[index], name: e.target.value };
                                                    setFormData(prev => ({ ...prev, tourOperator: updated }));
                                                }}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Operator Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                                            <input
                                                type="tel"
                                                value={operator.mobile || ""}
                                                onChange={e => {
                                                    const updated = [...formData.tourOperator];
                                                    updated[index] = { ...updated[index], mobile: e.target.value };
                                                    setFormData(prev => ({ ...prev, tourOperator: updated }));
                                                }}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Mobile Number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                                            <input
                                                type="email"
                                                value={operator.email || ""}
                                                onChange={e => {
                                                    const updated = [...formData.tourOperator];
                                                    updated[index] = { ...updated[index], email: e.target.value };
                                                    setFormData(prev => ({ ...prev, tourOperator: updated }));
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Email"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (formData.tourOperator.length > 1) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        tourOperator: prev.tourOperator.filter((_, i) => i !== index),
                                                    }));
                                                }
                                            }}
                                            className="md:col-span-3 mt-2 p-2 text-red-600 hover:bg-red-50 rounded-md"
                                            disabled={formData.tourOperator.length === 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData(prev => ({
                                            ...prev,
                                            tourOperator: [...prev.tourOperator, { name: "", mobile: "", email: "" }],
                                        }))
                                    }
                                    className="flex items-center text-blue-600 hover:text-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Tour Operator
                                </button>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                                            {newEntry ? "Creating Package..." : "Updating Package..."}
                                        </span>
                                    ) : (
                                        newEntry ? "Create Package" : "Update Package"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AddDestination;
