"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var boatOwnerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  businessType: {
    type: String,
    //['individual', 'charter/rental company', 'charter broker'],
    required: true
  },
  businessName: {
    type: String
  },
  company: String,
  businessLocation: {
    country: {
      type: String,
      required: false
    },
    // Country is required
    countryCode: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: false
    },
    // Optional: State or province
    stateCode: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    // Optional: City
    postalCode: {
      type: String,
      required: false
    },
    town: {
      type: String,
      required: false
    },
    // Optional: Town or district
    address: {
      type: String,
      required: false
    },
    // Full address
    region: {
      type: String
    },
    lat: {
      type: Number,
      required: false
    },
    // Latitude
    lng: {
      type: Number,
      required: false
    },
    // Longitude
    geoPoint: {
      type: {
        type: String,
        "enum": ["Point"],
        "default": "Point"
      },
      // GeoJSON Point Type
      coordinates: {
        type: [Number],
        "default": [0, 0]
      } // [longitude, latitude] -> GeoJSON standard

    }
  },
  contacts: {
    countryCode: {
      type: String
    },
    // e.g., '+1', '+91'
    number: {
      type: String
    },
    // e.g., '9876543210'
    phoneNumber: {
      type: String
    } // e.g., '+19876543210'

  },
  verified: {
    type: Boolean,
    "default": false
  },
  profilePic: String,
  experience: String,
  website: String,
  yachts: Number,
  socialMedia: String,
  registrationDate: Date,
  ssn: String,
  age: Number,
  password: String,
  profileImg: String,
  documents: [{
    type: String,
    // URL of uploaded document
    match: /\.(jpg|jpeg|png|pdf)$/i // ✅ Ensures only valid formats

  }],
  status: {
    type: String,
    "enum": ["Pending", "Active", "rejected", "Suspended"],
    // ✅ Tracks admin approval
    "default": "Pending"
  },
  revenue: {
    type: Number,
    "default": 0
  },
  rejectionReason: {
    type: String,
    "default": null
  }
}, {
  timestamps: true,
  versionKey: false
}); // Create and export the BoatOwner model

var BoatOwnerModel = mongoose.model('BoatOwner', boatOwnerSchema);
module.exports = BoatOwnerModel;