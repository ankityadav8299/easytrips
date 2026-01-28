const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profile");
const Destination = require("../models/destination");
const { uploadImage } = require("../utils/uploader");
const dotenv = require("dotenv");
// const { handleCreateProfile } = require("./profileController");
dotenv.config();

const sendEmail = require("../utils/sendEmail");

exports.signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields or kindly try different username",
      });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: fullName,
      email: email,
      password: hashedPassword,
    });
    // Create a profile for the user
    const userProfile = await Profile.create({
      user: user._id,
    });
    //  handleCreateProfile(user._id);
    // console.log(user);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide either email or username, and a password.",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found, Kindly signup first",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const payload = user.toObject();
    // console.log(payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userObj = user.toObject();
    userObj.token = token;
    userObj.password = undefined;
    // console.log("User logged in successfully", userObj);

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      user: userObj,
      message: "User Logged in successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    let username = "Unknown";
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      username = decoded.userName || decoded.username || "Unknown";
    }

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: `${username} logged out successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }
    const user = await User.findOne({ email }).select(
      "+passwordResetToken +passwordResetExpires"
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();
    // const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${token}`;
    const resetUrl = `${req.headers.origin}/reset-password/${token}`;
    // Send email with resetUrl
    await sendEmail(
      email,
      "Reset Your Password",
      `<p>You requested to reset your password. Click the link below:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>`
    );

    res.status(200).json({
      success: true,
      message: `Password reset link sent to ${email}`,
      resetUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Please provide a token and a new password" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.handleGetProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(token);
  // console.log(user);
  try {
    const userProfile = await Profile.findOne({ user: user._id });
    await userProfile.populate("user");
    await userProfile.save();
    console.log("userProfile", userProfile);
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.handleUpdateProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  const { name, phone, address, gstin } = req.body;
  console.log(name, phone, address, gstin);
  // console.log(req.body);
  try {
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    if (name) {
      const data = await User.findById(user._id).updateOne({ name: name });
    }
    profile.phone = phone || profile.phone;
    profile.address = address || profile.address;
    profile.GSTIN = gstin || profile.GSTIN;
    await profile.save();
    res
      .status(200)
      .json({ message: "Profile updated successfully", profile: profile });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.handleImageUpload = async (files, title) => {
  const uploadedImages = [];
  for (const file of files) {
    if (!file.buffer || file.buffer.length === 0) {
      console.warn("Skipping empty file:", file.originalname);
      continue;
    }
    console.log("Uploading file:", file.originalname, file.buffer.length);
    const result = await uploadImage(file.buffer, title);
    if (!result || !result.secure_url) {
      throw new Error("Image upload failed");
    }
    uploadedImages.push(result.secure_url);
  }
  return {
    success: true,
    message: "Images uploaded successfully",
    urls: uploadedImages,
  };
};

exports.handleAddDestination = async (req, res) => {
  const {
    name,
    description,
    bestTimeToVisit,
    groupSize,
    duration,
    location,
    price,
    availability,
    cancellationPolicy,
    termsAndConditions,
  } = req.body;

  // For simple arrays sent as multiple field[] entries
  const highlights = Array.isArray(req.body.highlights)
    ? req.body.highlights
    : [req.body.highlights].filter(Boolean);
  const whatIncluded = Array.isArray(req.body.whatIncluded)
    ? req.body.whatIncluded
    : [req.body.whatIncluded].filter(Boolean);
  const whatNotIncluded = Array.isArray(req.body.whatNotIncluded)
    ? req.body.whatNotIncluded
    : [req.body.whatNotIncluded].filter(Boolean);

  // For arrays of objects sent as JSON strings
  let itinerary = [];
  if (Array.isArray(req.body.itinerary)) {
    itinerary = req.body.itinerary.map((item) => {
      try {
        return JSON.parse(item);
      } catch {
        return {};
      }
    });
  } else if (req.body.itinerary) {
    try {
      itinerary = [JSON.parse(req.body.itinerary)];
    } catch {
      itinerary = [];
    }
  }

  let tourOperator = [];
  if (Array.isArray(req.body.tourOperator)) {
    tourOperator = req.body.tourOperator.map((item) => {
      try {
        return JSON.parse(item);
      } catch {
        return {};
      }
    });
  } else if (req.body.tourOperator) {
    try {
      tourOperator = [JSON.parse(req.body.tourOperator)];
    } catch {
      tourOperator = [];
    }
  }

  const images = req.files;

  try {
    const itineraryObject = itinerary.map((item) => ({
      day: item.day,
      activities: item.activities,
    }));
    // console.log("tourOperator", tourOperator, typeof tourOperator);
    // FIXED: Properly await and destructure image URLs
    const { urls: imageUrls } = await exports.handleImageUpload(images, name);

    const destinationData = await Destination.create({
      name,
      description,
      highlights,
      bestTimeToVisit,
      groupSize,
      duration,
      location,
      imageUrl: imageUrls, // <-- match your schema!
      price,
      availability,
      itinerary: itineraryObject,
      included: whatIncluded,
      notIncluded: whatNotIncluded,
      cancellationPolicy,
      termsAndConditions,
      tourOperator,
    });
    res.status(201).json({
      success: true,
      message: "Destination added successfully",
      destination: destinationData._id,
    });
  } catch (error) {
    console.error("Error adding destination:", error);
    res.status(500).json({
      success: false,
      message: "Error adding destination",
      error: error.message,
    });
  }
};

exports.handleUpdateDestination = async (req, res) => {
  const destinationId = req.params.id;
  const {
    name,
    description,
    bestTimeToVisit,
    groupSize,
    duration,
    location,
    price,
    availability,
    cancellationPolicy,
    termsAndConditions,
  } = req.body;

  // For simple arrays sent as multiple field[] entries
  const highlights = Array.isArray(req.body.highlights)
    ? req.body.highlights
    : [req.body.highlights].filter(Boolean);

  const existingImages = Array.isArray(req.body.existingImages)
    ? req.body.existingImages
    : [req.body.existingImages].filter(Boolean);

  const whatIncluded = Array.isArray(req.body.whatIncluded)
    ? req.body.whatIncluded
    : [req.body.whatIncluded].filter(Boolean);

  const whatNotIncluded = Array.isArray(req.body.whatNotIncluded)
    ? req.body.whatNotIncluded
    : [req.body.whatNotIncluded].filter(Boolean);

  // For arrays of objects sent as JSON strings
  let itinerary = [];
  if (Array.isArray(req.body.itinerary)) {
    itinerary = req.body.itinerary.map((item) => {
      try {
        return JSON.parse(item);
      } catch {
        return {};
      }
    });
  } else if (req.body.itinerary) {
    try {
      itinerary = [JSON.parse(req.body.itinerary)];
    } catch {
      itinerary = [];
    }
  }

  let tourOperator = [];
  if (Array.isArray(req.body.tourOperator)) {
    tourOperator = req.body.tourOperator.map((item) => {
      try {
        return JSON.parse(item);
      } catch {
        return {};
      }
    });
  } else if (req.body.tourOperator) {
    try {
      tourOperator = [JSON.parse(req.body.tourOperator)];
    } catch {
      tourOperator = [];
    }
  }

  const images = req.files;
  const itineraryObject = itinerary.map((item) => ({
    day: item.day,
    activities: item.activities,
  }));

  // FIXED: Properly await and destructure image URLs
  let { urls: imageUrls } = await exports.handleImageUpload(images, name);
  console.log("Image URLs:", existingImages);
  imageUrls = [...existingImages, ...imageUrls].filter(Boolean); // Combine existing and new images, removing any empty value

  try {
    // console.log("tourOperator", tourOperator, typeof tourOperator);
    const updatedDestination = await Destination.updateOne(
      {_id: destinationId},
      {
        name,
        description,
        highlights,
        bestTimeToVisit,
        groupSize,
        duration,
        location,
        imageUrl: imageUrls, // <-- match your schema!
        price,
        availability,
        itinerary: itineraryObject,
        included: whatIncluded,
        notIncluded: whatNotIncluded,
        cancellationPolicy,
        termsAndConditions,
        tourOperator,
      },
      { new: true, upsert: true }
    );
    if (!updatedDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json({
      success: true,
      message: "Destination updated successfully",
      destination: updatedDestination._id,
    });
  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).json({
      success: false,
      message: "Error updating destination",
      error: error.message,
    });
    return;
  }
};

exports.handleGetDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    if (!destinations || destinations.length === 0) {
      return res.status(404).json({ message: "No destinations found" });
    }
    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching destinations",
      error: error.message,
    });
  }
};
exports.handleGetDestinationById = async (req, res) => {
  const { id } = req.params;
  try {
    const destination = await Destination.findById(id);
    // console.log("Destination ID:", id);
    // console.log("Destination:", destination);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json({ destination: destination });
  } catch (error) {
    console.error("Error fetching destination:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching destination",
      error: error.message,
    });
  }
};
exports.handleDeleteDestination = async (req, res) => {
  try {
    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json({ message: "Package deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.handleAddToWishlist = async (req, res) => {
  const destinationId = req.params.id;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  try {
    await Destination.updateOne(
      { _id: destinationId },
      { $push: { wishlistedBy: user._id } },
      { new: true, upsert: true }
    );
    res
      .status(200)
      .json({ isInWishlist: true, message: "Added to wishlist successfully" });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to wishlist",
      error: error.message,
    });
  }
};

exports.handleRemoveFromWishlist = async (req, res) => {
  const destinationId = req.params.id;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  try {
    await Destination.updateOne(
      { _id: destinationId },
      { $pull: { wishlistedBy: user._id } },
      { new: true, upsert: true }
    );
    res.status(200).json({
      isInWishlist: false,
      message: "Removed from wishlist successfully",
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to wishlist",
      error: error.message,
    });
  }
};

exports.handleGetWishlist = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const destinations = await Destination.find({
      wishlistedBy: user._id,
    });
    // console.log("Destinations in wishlist:", destinations);
    if (!destinations || destinations.length === 0) {
      return res.status(404).json({ message: "No wishlist items found" });
    }
    res.status(200).json({ wishlistItems: destinations });
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wishlist items",
      error: error.message,
    });
  }
};
