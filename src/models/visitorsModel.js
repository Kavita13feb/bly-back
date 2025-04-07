const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, unique: true }, // Unique Visitor Identifier
  ipAddress: { type: String, required: false }, // Optional IP Address
  country: { type: String, required: false }, // Visitor's country
  region: { type: String, required: false }, // e.g., North America, Europe, Asia
  countryCode: { type: String, required: false }, // ISO country code (US, IN, GB, etc.)
  city: { type: String, required: false }, // City (if available)
  state: { type: String, required: false }, // State/Province
  stateCode: { type: String, required: false }, // ISO State Code (CA, NY, DL)
  postalCode: { type: String, required: false }, // Postal Code
  latitude: { type: Number, required: false }, // Geo-coordinates
  longitude: { type: Number, required: false },

  firstVisit: { type: Date, default: Date.now }, // When visitor first visited
  lastVisit: { type: Date, default: Date.now }, // Last activity date
  visitCount: { type: Number, default: 1 }, // Track multiple visits
  isReturning: { type: Boolean, default: false }, // True if visitor has returned
  deviceType: { type: String, enum: ["Mobile", "Tablet", "Desktop"], required: false }, // Optional Device Type
  browser: { type: String, required: false }, // Browser Name (Chrome, Safari, Edge, etc.)
  referrer: { type: String, required: false }, // Referrer URL (if came from external source)

}, { timestamps: true });


visitorSchema.index({ geoPoint: "2dsphere" });
visitorSchema.index({ countryCode: 1, region: 1 });


const VisitorModel = mongoose.model('Visitor', visitorSchema);

module.exports = VisitorModel;
