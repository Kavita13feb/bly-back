const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashPassword: {
      type: String,
      // required: true,
    },
    contacts: {
      countryCode: { type: String }, // e.g., '+1', '+91'
      number: { type: String }, // e.g., '9876543210'
      phoneNumber: { type: String }, // e.g., '+19876543210'
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number in E.164 format.']
    },
    location: {
      country: { type: String, required: false }, // Country is required
      countryCode: { type: String, required: false },
      state: { type: String, required: false }, // Optional: State or province
      stateCode: { type: String, required: false },
      city: { type: String, required: false }, // Optional: City
      postalCode: { type: String, required: false },
      town: { type: String, required: false }, // Optional: Town or district
      address: { type: String, required: false }, // Full address

      lat: { type: Number, required: false }, // Latitude
      lng: { type: Number, required: false }, // Longitude
      geoPoint: {
        type: { type: String, enum: ["Point"], default: "Point" }, // GeoJSON Point Type
        coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude] -> GeoJSON standard
      },
      region: { type: String },
    },
    dateOfBirth: {
      type: Date,
      // required: true
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["a", "b", "c","g"],
      default: "g",
      required: true,
    },
    isGuest: {
      type: Boolean,
      default: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Active", "rejected","Suspended"], // ✅ Tracks admin approval
        default: "Pending",
      },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
