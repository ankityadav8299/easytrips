const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); 
const {
  signup,
  signin,
  logout,
  handleGetProfile,
  handleUpdateProfile,
  handleAddDestination,
  handleGetDestinations,
  handleGetDestinationById,
  handleDeleteDestination,
  handleAddToWishlist,
  handleRemoveFromWishlist,
  handleGetWishlist,
  handleUpdateDestination
} = require("../controllers/authController");
const verifyUser = require("../middlewares/auth");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.route("/profile").get(handleGetProfile).post(handleUpdateProfile);
router.post("/add-destination",upload.array("images", 10), handleAddDestination);
router.put("/update-destination/:id",upload.array("images", 10), handleUpdateDestination);
router.get("/destinations", handleGetDestinations);
router.route("/destination/:id").get(handleGetDestinationById).delete(handleDeleteDestination);
router.patch("/wishlist/:id/add", handleAddToWishlist);
router.patch("/wishlist/:id/rem", handleRemoveFromWishlist);
router.get("/wishlist", handleGetWishlist);

module.exports = router;
