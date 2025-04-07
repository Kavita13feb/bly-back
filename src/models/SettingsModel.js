const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "general",
        "ownerManagement",
        "bookingAndTransaction",
        "reportsAndAnalytics",
        "notificationsAndAlerts",
        "apiAndIntegration",
        "dataAndPrivacy",
        "chatSupport"
      ]
    },

    settings: {
      type: mongoose.Schema.Types.Mixed, // Flexible nested object per section
      required: true
    },

    locale: {
      type: String,
      default: "en-US", // future-ready for multi-language settings
    },

    region: {
      type: String,
      default: "US", // current default, supports expansion
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Only Admins can update
      required: false
    },

    isLocked: {
      type: Boolean,
      default: false, // if true, only SuperAdmins can modify
    },

    version: {
      type: Number,
      default: 1, // useful if you want to version changes per section
    }
  },
  {
    timestamps: true // ✅ createdAt, updatedAt
  }
);

// Index for fast lookups
settingSchema.index({ section: 1 });

const SettingModel = mongoose.model("Setting", settingSchema);
module.exports = SettingModel;


