"use strict";

var _ref;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require("mongoose");

var PaymentSchema = new mongoose.Schema((_ref = {
  txnId: {
    type: String,
    "default": ""
  },
  // txnType: {
  //   type: String,
  //   enum: ["payment", "payout", "refund"],
  //   required: true,
  // },
  paymentIntentId: {
    type: String,
    "default": ""
  },
  paymentStatus: {
    type: String,
    "enum": ["pending", "completed", "failed"],
    "default": "pending"
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  // Link to Booking
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  stripePaymentId: {
    type: String,
    unique: true
  },
  sessionId: {
    type: String,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    "default": "USD"
  },
  method: {
    type: String,
    "enum": ["Stripe", "PayPal", "Bank Transfer"]
  },
  exchangeRate: {
    type: Number,
    required: true
  },
  partialPayments: [{
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      "enum": ["pending", "completed", "failed"],
      "default": "pending"
    }
  }],
  refundDetails: {
    amount: Number,
    reason: String,
    status: {
      type: String,
      "enum": ["Initiated", "Processed", "Failed"],
      "default": "Initiated"
    },
    refundedAt: Date
  },
  status: {
    type: String,
    "enum": ["pending", "completed", "failed"],
    "default": "pending"
  },
  ownerPayoutDetails: {
    payoutAmount: {
      type: Number,
      required: true
    },
    payoutCurrency: {
      type: String,
      required: true,
      "default": "USD"
    },
    exchangeRate: {
      type: Number,
      required: true
    },
    payoutStatus: {
      type: String,
      "enum": ["pending", "completed", "failed"],
      "default": "pending"
    }
  },
  refundReason: String
}, _defineProperty(_ref, "refundDetails", {
  amount: Number,
  reason: String,
  status: {
    type: String,
    "enum": ["Initiated", "Processed", "Failed"],
    "default": "Initiated"
  },
  refundedAt: Date
}), _defineProperty(_ref, "initiatedBy", {
  type: String,
  "enum": ["user", "admin", "system"],
  "default": "system"
}), _defineProperty(_ref, "initiatedAt", {
  type: Date,
  "default": Date.now
}), _defineProperty(_ref, "completedAt", {
  type: Date
}), _defineProperty(_ref, "referenceNote", {
  type: String
}), _defineProperty(_ref, "error", {
  type: String
}), _defineProperty(_ref, "metadata", {
  ipAddress: {
    type: String
  },
  device: {
    type: String
  }
}), _ref), {
  timestamps: true,
  versionKey: false
});
var PaymentModel = mongoose.model("Payment", PaymentSchema);
module.exports = PaymentModel; // refundDetails: {
//   amount: Number,
//   reason: String,
//   status: { type: String, enum: ['Initiated', 'Processed', 'Failed'], default: 'Initiated' },
//   refundedAt: Date,
// },
// ownerPayoutDetails: {
//   payoutAmount: { type: Number, required: true },
//   payoutCurrency: { type: String, required: true, default: "USD" },
//   exchangeRate: { type: Number, required: true },
//   payoutStatus: {
//     type: String,
//     enum: ["pending", "completed", "failed"],
//     default: "pending",
//   },
// },"