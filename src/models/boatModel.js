const mongoose = require("mongoose");

const boatSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoatOwner",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "published",
        "archived",
        "rejected",
        "approved",
      ],
      default: "draft",
    },
    isLive: { type: Boolean, default: false },
    stepCompleted: { type: Number, default: 0 },
    capacity: Number,
    shortName: String,
    short_description: String,

    location: {
      placeId: { type: String, index: true }, // Unique Google Place ID (Highly recommended)
      name: { type: String },
      formattedAddress: { type: String },
      country: { type: String, index: true },
      countryCode: { type: String, index: true },
      state: { type: String, index: true },
      stateCode: { type: String, index: true },
      city: { type: String, index: true },
      postalCode: { type: String, index: true },
      town: { type: String, index: true },
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number },
      geoPoint: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], index: "2dsphere", required: true },
      },
      region: { type: String, index: true },
      locationKeywords: { type: String, index: "text" },
      // coordinates: {
      //   type: { type: String, default: "Point" }, // GeoJSON format
      //   coordinates: {
      //     type: [Number], // [longitude, latitude]
      //     required: false,
      //     validate: {
      //       validator: (coords) =>
      //         coords.length === 2 &&
      //         coords[0] >= -180 &&
      //         coords[0] <= 180 &&
      //         coords[1] >= -90 &&
      //         coords[1] <= 90,
      //       message: "Coordinates must be an array of [longitude, latitude]",
      //     },
      //   },
      // },
    },

    highlights: {
      type: String,
    },
    description: {
      type: String,
    },

    features: {
      make: String,
      model: String,
      year: Number,
      length: Number,
      engines: [
        {
          number_engines: { type: String, required: false }, // Unique ID for each engine
          engine_horsepower: { type: Number }, // Engine horsepower
          engine_brand: { type: String }, // Manufacturer of the engine
          engine_model: { type: String }, // Model of the engine
          fuelType: { type: String, enum: ["Diesel", "Petrol", "Electric"] }, // Fuel type
        },
      ],

      amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenity" }],
    },

    captainService: {
      captained: Boolean,
      captain_cost_included: Boolean,
      captain_amount: Number,
    },

    priceDetails: {
      // unit: {
      //       type: String,
      //       // enum: ["person", "hour", "day"],
      //     },
      daily: {
        rate: Number, // Rate per day
        minDays: Number, // Minimum days for booking
        maxDays: Number, // Maximum days for booking
      },
      hourly: {
        rate: Number, // Rate per hour
        minDuration: Number, // Minimum trip duration in hours
        maxDuration: Number, // Maximum trip duration in hours
      },

      price: {
        type: Number,
      },
      person: {
        rate: Number, // Rate per person
        minPersons: Number, // Minimum number of persons
      },
      captainProvided: { type: Boolean, default: false }, // Whether a captain is provided
      captainPrice: Number, // Additional price for captain service
      currency: {
        code: String,
        symbol: String,
      },
    },

    securityAllowance: Number, // Security deposit amount
    rentalAgreement: String,
    cancellationPolicy: {
      daysPrior: Number,
      refund: Number,
    },
    categories: [
      {
        categoryId: { type: String },
        categoryName: { type: String },

        subcategoryId: { type: String },
        subcategoryName: { type: String },
      },
    ],
    availability_criteria: {
      startTime: String,
      endTime: String,
      bufferTime: String,
      min_hours: Number,
      max_hours: Number,
      Is_day: { type: Boolean, default: false },
      min_days: Number,
      max_days: Number,
    },

    blockedDates: {
      date: Date,
      reason: String,
    },

    averageRating: {
      type: Number,
      default: 0,
    },
    boatType: {
      type: String,
    },
    primary_category: Number,
    primary_subcategory: Number,
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

// Geospatial index for location.coordinates
boatSchema.index({ "location.coordinates": "2dsphere" });

const BoatModel = mongoose.model("Boat", boatSchema);
module.exports = BoatModel;

//imortant
// const mongoose = require('mongoose');

// const locationSchema = new mongoose.Schema(
//   {
//     country: { type: String, required: false },      // "United States"
//     countryCode: { type: String, required: false }, // "US" (ISO Alpha-2)
//     state: { type: String, required: false },       // "California"
//     stateCode: { type: String, required: false },   // "CA" (ISO Alpha-2)
//     city: { type: String, required: false },        // "Los Angeles"
//     postalCode: { type: String, required: false },  // "90001"
//     address: { type: String, required: false },     // Full address
//     lat: { type: Number, required: false },         // Latitude
//     lng: { type: Number, required: false },         // Longitude
//     geoPoint: {
//       type: { type: String, enum: ["Point"], default: "Point" }, // GeoJSON Point Type
//       coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude] -> GeoJSON standard
//     },
// region: { type: String },
//   },
//   { _id: false }
// );

// // ✅ 2dsphere index for geo queries (ensure when schema used in model)
// locationSchema.index({ geoPoint: "2dsphere" });

// module.exports = locationSchema;

[
  {
    "_id": {"$oid": "6761780386d6c0b10b092fdf"},
    "location": {
      "geopoint": {
        "type": "Point",
        "coordinates": [151.5931794, -33.0133179]
      },
      "city": "Toronto",
      "state": "NSW", 
      "country": "Australia",
      "address": "Toronto NSW, Australia"
    },
    "features": {
      "make": {"$oid": "6753bbe3cf765f124e2a8525"},
      "model": "Oceanus 28 VST",
      "year": 2009,
      "length": 90,
      "engines": [
        {
          "number_engines": "543",
          "engine_horsepower": 934,
          "engine_brand": "87tygb",
          "engine_model": "978yhu",
          "fuelType": "Diesel",
          "_id": {"$oid": "676178fe86d6c0b10b093010"}
        }
      ],
      "amenities": [
        {"$oid": "6757c7bed4fbd650ff0601b9"},
        {"$oid": "6757c7bed4fbd650ff0601ba"},
        {"$oid": "6761774d3255376bb7c03235"},
        {"$oid": "6761774d3255376bb7c03237"},
        {"$oid": "6761774d3255376bb7c03238"},
        {"$oid": "6761774d3255376bb7c03239"},
        {"$oid": "6761774d3255376bb7c03233"},
        {"$oid": "6761774d3255376bb7c03232"},
        {"$oid": "6761774d3255376bb7c03231"},
        {"$oid": "6761774d3255376bb7c03236"},
        {"$oid": "6761774d3255376bb7c03234"},
        {"$oid": "6761774d3255376bb7c03230"},
        {"$oid": "6757c7bed4fbd650ff0601bd"},
        {"$oid": "6757c7bed4fbd650ff0601bc"},
        {"$oid": "676bb924c0f2f1932e3ae8dd"}
      ]
    },
    "priceDetails": {
      "daily": {
        "rate": 0,
        "minDays": 0,
        "maxDays": 30
      },
      "hourly": {
        "rate": 120,
        "minDuration": 2,
        "maxDuration": 12
      },
      "person": {
        "rate": 0,
        "minPersons": 1
      },
      "currency": {
        "code": "USD",
        "symbol": "$"
      },
      "categories": [
        {
          "categoryId": "6761816f3255376bb7c03248",
          "categoryName": "Luxury and Leisure",
          "subcategoryId": "PRV5cT9lXs",
          "subcategoryName": "Private Parties"
        }
      ],
      "captainProvided": true,
      "captainPrice": 70
    },
    "ownerId": {"$oid": "6759244971ee2061ba7b4249"},
    "title": "House Boat 0456",
    "status": "Approved",
    "isLive": true,
    "stepCompleted": 3,
    "capacity": 25,
    "shortName": "Toronto yacht",
    "short_description": "Enjoy Miami like never before with a private Viking Flybridge 65ft Yacht Rental for up to 13 people. Whether you're looking for relaxation, adventure, or a party vibe, we've got you covered.",
    "description": "Enjoy Miami like never before with a private Viking Flybridge 65ft Yacht Rental for up to 13 people. Whether you're looking for relaxation, adventure, or a party vibe, we've got you covered.Enjoy Miami like never before with a private Viking Flybridge 65ft Yacht Rental for up to 13 people. Whether you're looking for relaxation, adventure, or a party vibe, we've got you covered.",
    "securityAllowance": 454,
    "averageRating": 0,
    "rating": 5,
    "createdAt": {"$date": "2024-12-17T13:09:23.778Z"},
    "updatedAt": {"$date": "2025-03-01T09:52:34.614Z"}
  },
  {
    "_id": {"$oid": "66cd94ad16d65b2324ac92e4"},
    "location": {
      "geopoint": {
        "type": "Point",
        "coordinates": [-80.1917902, 25.7616798]
      },
      "city": "Miami",
      "state": "Florida",
      "country": "USA",
      "address": "123 Marina Blvd, Miami, Florida"
    },
    "features": {
      "make": "Custom",
      "model": "Bottom Glass",
      "length": 45,
      "year": 2000,
      "engines": [
        {
          "number_engines": "2",
          "engine_horsepower": 300,
          "engine_brand": "Yamaha",
          "engine_model": "V8",
          "fuelType": "Diesel",
          "_id": {"$oid": "66f6e697e6f795bf92c80a6b"}
        }
      ],
      "amenities": []
    },
    "categories": [
      {
        "categoryId": "6761816f3255376bb7c03249",
        "categoryName": "Water Sports and Adventure",
        "subcategoryId": "JET3fX2Lsz",
        "subcategoryName": "Jet Skiing"
      }   
    ],
    "priceDetails": {
      "daily": {
        "rate": 100,
        "minDays": 1,
        "maxDays": 5
      },
      "hourly": {
        "rate": 20,
        "minDuration": 2,
        "maxDuration": 8
      },
      "person": {
        "rate": 50,
        "minPersons": 5
      },
      "currency": {
        "code": "USD",
        "symbol": "$"
      },
      "captainProvided": true,
      "captainPrice": 100
    },
    "ownerId": {"$oid": "6759244971ee2061ba7b4249"},
    "title": "Celebrate your Yacht Party up to 34PAX, Everything Included, Great Location",
    "status": "pending",
    "isLive": false,
    "stepCompleted": 0,
    "capacity": 13,
    "shortName": "Celebrate Yacht Party",
    "short_description": "Experience the ultimate luxury on the water with a custom yacht for your party.",
    "description": "This luxury yacht offers a spacious deck, modern amenities, and a professional crew to ensure your comfort.",
    "averageRating": 4.5,
    "rating": 4.5,
    "createdAt": {"$date": "2024-08-27T08:56:13.967Z"},
    "updatedAt": {"$date": "2025-04-04T05:13:05.800Z"}
  }
]
