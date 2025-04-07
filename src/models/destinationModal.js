const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  region: { type: String, required: true }, // e.g. Caribbean, Mediterranean, etc.
  popularActivities: [{ type: String }], // Array of popular activities at this destination
  bestTimeToVisit: {
    months: [{ type: String }], // Array of best months to visit
    notes: { type: String }
  },

  weatherInfo: {
    averageTemp: { type: Number }, // Average temperature in Celsius
    rainfall: { type: String }, // Rainfall description
    humidity: { type: String }
  },

  marinas: [{
    name: { type: String },
    coordinates: { type: [Number] }, // [longitude, latitude]
    facilities: [{ type: String }]
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'upcoming'],
    default: 'active'
  },
  rating: {
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  pricing: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: '€' },
     unit: { type: String,enum: ['day', 'week', 'month', 'hour'], default: 'hour' }
  },
  price: { type: String, default: "0/hour" },
  city: { type: String },
  country: { type: String },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  yachtCount: { type: Number, default: 0 },
  bookingCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  geoPoint: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  image: { type: String }, // URL of the destination image
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Destination = mongoose.model("Destination", destinationSchema);
module.exports = Destination;
