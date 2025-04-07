"use strict";

var _require = require("mongoose"),
    mongoose = _require["default"];

var TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    "enum": ["payment", "payout", "refund"],
    required: true
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    "default": null
  },
  payoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payout",
    "default": null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  // Renter
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BoatOwner"
  },
  yachtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Boat"
  },
  ownerName: {
    type: String,
    index: true
  },
  userName: {
    type: String,
    index: true
  },
  userEmail: {
    type: String,
    index: true
  },
  userPhone: {
    type: String
  },
  yachtTitle: {
    type: String,
    index: true
  },
  txnRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // bookingId or payoutId or paymentId
  // Stripe/Bank reference
  txnId: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    "default": "USD"
  },
  status: {
    type: String,
    "enum": ["completed", "pending", "failed"],
    "default": "pending"
  },
  paymentMethod: {
    type: String,
    "enum": ["stripe", "paypal", "bank", "wallet", "manual"],
    "default": "stripe"
  },
  metadata: {
    ip: String,
    userAgent: String,
    device: String
  },
  reason: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    "default": Date.now
  }
}, {
  timestamps: true
});
var TransactionModel = mongoose.model("Transaction", TransactionSchema);
module.exports = TransactionModel;