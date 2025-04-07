const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "BoatOwner", required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true }, // e.g., Stripe, Bank
  status: { type: String, enum: ["Pending", "Approved", "Declined", "Paid", "Failed","Hold"], default: "Pending" },
  requestedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  exchangeRate: { type: Number, required: true },
  currency: { type: String, required: true, default: "USD" },
  ownerName: { type: String, index: true },
  onwerEmail: { type: String, index: true },
  // payoutChannelDetails: {
  //   bankName, accountLast4, stripePayoutId, paypalEmail, 
  // },
  countryCode: { type: String, required: false }, // e.g., "US"
  region: { type: String, required: false },

  txnId: { type: String, default: "" }, // After payment
  payoutRef: { type: String, default: "" }, // TXN ref for tracking
  bookingIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }], // Optional if linked to specific bookings
}, { timestamps: true });

const PayoutModel=mongoose.model("Payout", payoutSchema);
module.exports = PayoutModel
