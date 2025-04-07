"use strict";

var mongoose = require("mongoose");

var yachtTypeSchema = new mongoose.Schema({
  status: {
    type: String,
    "enum": ['active', 'inactive', 'archived'],
    "default": 'active'
  },
  displayOrder: {
    type: Number,
    "default": 0 // For controlling order in UI displays

  },
  features: [{
    type: String,
    trim: true
  }],
  priceRange: {
    min: {
      type: Number
    },
    // Minimum typical price
    max: {
      type: Number
    },
    // Maximum typical price
    currency: {
      type: String,
      "default": '€'
    }
  },
  totalYachts: {
    type: Number,
    "default": 0
  },
  averageRating: {
    type: Number,
    "default": 0
  },
  totalBookings: {
    type: Number,
    "default": 0
  },
  seoMetadata: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  // URL for the yacht type image
  popular: {
    type: Boolean,
    "default": false
  },
  // Admin can mark popular yacht types
  createdAt: {
    type: Date,
    "default": Date.now
  },
  updatedAt: {
    type: Date,
    "default": Date.now
  }
});
var YachtTypeModal = mongoose.model("YachtType", yachtTypeSchema);
module.exports = YachtTypeModal;