const { group } = require("console");
const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true,      
   },
   description: {
      type: String,
      required: true,
      trim: true,
   },
   highlights: [{
      type: String,
      required: true,
      trim: true,
   }],
   bestTimeToVisit: {
      type: String,
      required: true,
      trim: true,
   },
   groupSize: {
      type: String,
      required: true,
      trim: true,
   },
   duration: {
      type: String,
      required: true,
      trim: true,
   },
   reviews: [{
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      rating: {
         type: Number,
         required: true,
         min: 1,
         max: 5,
      },
      comment: {
         type: String,
         required: true,
         trim: true,
      },
      createdAt: {
         type: Date,
         default: Date.now,
      },
   }],
   ratings: {
      average: {
         type: Number,
         default: 0,
         min: 0,
         max: 5,
      },
      count: {
         type: Number,
         default: 0,
      },
   },
   location: {
      type: String,
      required: true,
      trim: true,
   },
   imageUrl: [ {
      type: String,
      required: true,
   }],
   price: {
      type: Number,
      required: true,
      min: 0,
   },
   availability: {
      type: Boolean,
      default: true,
   },
   itinerary: [{
      day: {
         type: Number,
         required: true,
      },
      activities: [{
         type: String,
         required: true,
         trim: true,
      }],
   }],
   included: [{
      type: String,
      required: true,
      trim: true,
   }],
   notIncluded: [{
      type: String,
      required: true,
      trim: true,
   }],
   termsAndConditions: {
      type: String,
      required: true,
      trim: true,
   },
   cancellationPolicy: {
      type: String,
      required: true,
      trim: true,
   },
   tourOperator: [{
      type: {
         name: String,
         mobile: String,
         email: String,
      },
      required: true,
   }],
   wishlistedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   }],
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   },
});   

const Destination = mongoose.model("Destination", destinationSchema);
module.exports = Destination;