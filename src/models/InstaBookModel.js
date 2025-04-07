const mongoose = require("mongoose");

const InstaBookSchema = new mongoose.Schema(
  {
    yachtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat", // Reference to the Yacht model
      required: true,
    },
    date: {
      type: Date,
      required: false,
    },
    tripDescription: {
      type: String,
      default: "",
    },
    subtotal: {
      type: Number,
      required: false,
    },
    currency: {
      type: String,
      default: "USD",
    },
    captained: {
      type: Boolean,
      default: true,
    },
    captainCostIncluded: {
      type: Boolean,
      default: false,
    },
    tripDuration: {
      type: String, // Duration format, e.g., "02:00:00"
      required: false,
    },
    instabookTripTimes: [
      {
        minStartTime: {
          type: String, // Format "HH:MM:SS"
          required: false,
        },
        maxStartTime: {
          type: String, // Format "HH:MM:SS"
          required: false,
        },
      },
    ],
    expiryUTC: {
      type: Date,
      required: false,
    },
    dateUTC: {
      type: Date,
      required: false,
    },
    dateAvailable: {
      type: Boolean,
      default: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    pricing: {
      baseCost: Number,
      captainCost: Number,
      totals: {
        totalPayout: Number,
        totalRenterPayment: Number,
        serviceCharge: Number,
        paymentServiceCharge: Number,
      },
    },
    transaction: {
      amounts: {
        offerAmount: { type: Number, required: false },
        hasCaptainAmount: { type: Boolean, default: false },
        captainAmount: { type: Number, default: 0 },
        renterBookingAmount: { type: Number, required: false },
        renterUsdBookingAmount: { type: Number, required: false },
        listingDeposit: { type: Number, default: 0 },
        bookingDeposit: { type: Number, default: 0 },
        cancellationPolicy: { type: String, default: "" },
      },
      ownerCurrency: {
        code: { type: String, default: "USD" },
        symbol: { type: String, default: "$" },
        precision: { type: Number, default: 2 },
      },
      renterCurrency: {
        code: { type: String, default: "USD" },
        symbol: { type: String, default: "$" },
        precision: { type: Number, default: 2 },
      },
      priceSections: [
        {
          id: { type: String },
          headerLabel: { type: String },
          footerLabel: { type: String },
          formattedAmount: { type: String },
          priceGroups: [
            {
              id: { type: String },
              label: { type: String },
              formattedAmount: { type: String },
              priceLines: [
                {
                  id: { type: String },
                  label: { type: String },
                  help: { type: String },
                  formattedAmount: { type: String },
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const InstaBookModel = mongoose.model("InstaBook", InstaBookSchema);
module.exports = InstaBookModel;
