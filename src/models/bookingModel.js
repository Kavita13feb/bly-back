const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "boatOwner",
      required: true,
    },
    yachtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },
    txnId: { type: String, unique: true },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    // Snapshot of name at time of booking (denormalized)
    ownerName: { type: String, index: true },
    userName: { type: String, index: true },
    userEmail: { type: String, index: true },
    userPhone: { type: String },
    yachtTitle: { type: String, index: true },
    bookingRef: { type: String, unique: true, required: true, index: true },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // e.g., "10:00 AM"
      required: true,
    },
    endTime: {
      type: String, // e.g., "12:00 PM"
      required: true,
    },
    tripDuration: {
      type: String, // e.g., "2 hour trip"
      required: true,
    },
    groupSize: {
      type: Number,
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    pricing: {
      baseCost: Number,
      captainCost: Number,
      totals: {
        totalPayout: Number,
        serviceCharge: Number,
        totalRenterPayment: Number,
        paymentServiceCharge: Number,
      },
    },
    captained: Boolean,
    paidAmount: { type: Number, default: 0 },
    
    specialRequest: String,
    occasion: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "refunded","partially_paid"],
      default: "pending",
    },
    refundDetails: {
      amount: Number,
      reason: String,
      status: {
        type: String,
        enum: ["Initiated", "Processed", "Failed"],
        default: "Initiated",
      },
      refundedAt: Date,
    },
    location: {
      country: { type: String },
      countryCode: { type: String },
      state: { type: String },
      stateCode: { type: String },
      city: { type: String },
      region: { type: String }, // e.g., Europe, North America
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number },
      postalCode: { type: String, required: false }, // "90001"
      timeZone: { type: String }, // e.g., "America/New_York"

      geoPoint: {
        type: { type: String, enum: ["Point"], default: "Point" }, // GeoJSON Point Type
        coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude] -> GeoJSON standard
      },
    },
    yachtRegion: { type: String },
    bookingSource: {
      type: String,
      enum: ["web", "mobile", "manual_admin"],
      default: "web"
    }
    
  },

  { timestamps: true, versionKey: false }
);
BookingSchema.index({ "location.countryCode": 1, "location.region": 1 });

BookingSchema.index({ "location.geoPoint": "2dsphere" });

module.exports = mongoose.model("Booking", BookingSchema);
