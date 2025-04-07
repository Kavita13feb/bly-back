"use strict";

var _ref;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema((_ref = {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userAvatar: {
    type: String,
    required: false
  },
  yachtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boat',
    required: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: false
  },
  category: {
    type: String,
    "default": 'Other'
  },
  email: {
    type: String,
    required: false
  },
  userName: {
    type: String,
    required: false
  },
  yachtName: {
    type: String,
    required: false
  },
  featured: {
    type: Boolean,
    "default": false
  },
  verified: {
    type: Boolean,
    "default": false
  }
}, _defineProperty(_ref, "rating", {
  type: Number,
  required: false
}), _defineProperty(_ref, "profession", {
  type: String,
  required: false
}), _defineProperty(_ref, "company", {
  type: String,
  required: false
}), _defineProperty(_ref, "position", {
  type: String,
  required: false
}), _defineProperty(_ref, "status", {
  type: String,
  "enum": ['pending', 'approved', 'rejected'],
  "default": 'pending'
}), _defineProperty(_ref, "type", {
  type: String,
  "enum": ['review', 'testimonial', 'feedback'],
  "default": 'review'
}), _defineProperty(_ref, "title", {
  type: String,
  required: false
}), _defineProperty(_ref, "comment", {
  type: String,
  required: false
}), _defineProperty(_ref, "responded", {
  type: Boolean,
  "default": false
}), _defineProperty(_ref, "response", {
  type: String,
  required: false
}), _defineProperty(_ref, "responseDate", {
  type: Date,
  required: false
}), _defineProperty(_ref, "isTestimonial", {
  type: Boolean,
  "default": false
}), _defineProperty(_ref, "serviceDate", {
  type: Date,
  required: false
}), _defineProperty(_ref, "photos", [String]), _ref), {
  timestamps: true,
  versionKey: false
});
var ReviewModel = mongoose.model('Review', reviewSchema);
module.exports = ReviewModel; // listing_accuracy: Number,
// listing_accuracy_comment: String,
// departure_and_return: Number,
// departure_and_return_comment: String,
// vessel_and_equipment: Number,
// vessel_and_equipment_comment: String,
// communication: Number,
// communication_comment: String,
// value: Number,
// value_comment: String,
// itinerary_and_experience: Number,
// itinerary_and_experience_comment: String,
// private_note: String,
// public_review: String,
// Sample data for MongoDB Compass