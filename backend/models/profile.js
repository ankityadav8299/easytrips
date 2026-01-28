const mongoose = require("mongoose")
const profileSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    GSTIN: {
        type: String,
    },
});
const Profile = mongoose.model("Profile",profileSchema);
module.exports = Profile;