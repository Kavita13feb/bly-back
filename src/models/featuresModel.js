const mongoose = require("mongoose");

const manufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Manufacturer name
//   country: { type: String }, // Optional: Country of origin
//   foundedYear: { type: Number }, // Optional: Year the manufacturer was founded
},{
    timestamps: true, 
    versionKey: false
  });

const ManufacturerModel = mongoose.model("Manufacturer", manufacturerSchema);

const modelSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Model name
  year: { type: Number, required: true }, // Year of manufacture
  max_length: { type: Number }, // Maximum length
  max_speed: { type: Number }, // Maximum speed
  capacity: { type: Number }, // Passenger capacity
  engine_horsepower: { type: Number }, // Total engine horsepower
  number_engines:{ type: Number },
  engine_brand: { type: String }, // Engine brand
  engine_model: { type: String }, // Engine model
  manufacturer: { 
    id:{type: mongoose.Schema.Types.ObjectId},
     name:String
   }, // Reference to Manufacturer _id
},{
    timestamps: true, 
    versionKey: false
  });


const AmenitySchema = new mongoose.Schema({
  title: { type: String, required: true },  // Name of the amenity (e.g., WiFi, Pool)
  icon: { type: String, required: false }, // Icon URL or identifier for the amenity
  category: { type: String, required: false }, // Optional grouping/category (e.g., "Comfort", "Safety")
  description: { type: String, required: false }, // Brief description of the amenity
  available: { type: Boolean, default: false },    // To mark if an amenity is currently available
});

const AmenityModel = mongoose.model('Amenity', AmenitySchema);


 const yachtBrandModel = mongoose.model("Model", modelSchema);

 module.exports={ManufacturerModel,yachtBrandModel,AmenityModel}