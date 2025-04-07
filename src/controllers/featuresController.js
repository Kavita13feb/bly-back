// const Model = require("../models/Model");
// const Manufacturer = require("../models/Manufacturer");
// const ManufacturerModel = require("../models/ManufacturerModel");

const {
  ManufacturerModel,
  yachtBrandModel,
  AmenityModel,
} = require("../models/featuresModel");

const addManufacturers = async (req, res) => {
  const { name } = req.body;

  try {
    const manufacturer = new ManufacturerModel({ name });
    await manufacturer.save();
    res
      .status(201)
      .json({ message: "Manufacturer added successfully", manufacturer });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add manufacturer", details: error.message });
  }
};

const getManufacturers = async (req, res) => {
  try {
    const manufacturers = await ManufacturerModel.find();
    res.status(200).json(manufacturers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch manufacturers" });
  }
};

const addModel = async (req, res) => {
  const { manufacturerId } = req.query;

  console.log("req",manufacturerId);

  try {
    const make = await ManufacturerModel.findOne({ _id: manufacturerId });
    console.log(make)
    const model = new yachtBrandModel({
     ...req.body,
     manufacturer: {
        id: make._id,
        name: make.name,
      },
    });
    await model.save();
    res.status(201).json({ message: "Model added successfully", model });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add model", details: error.message });
  }
};

const getModelsByManufacturer = async (req, res) => {
  const { manufacturerId } = req.query;

  try {
    // Find all models matching the manufacturer ID
    const models = await yachtBrandModel.find({ "manufacturer.id": manufacturerId });

    // If no models are found, return a 404 response
    if (!models || models.length === 0) {
      return res.status(404).json({ message: "No models found for the given manufacturer ID." });
    }

    // Return the models in the response
    res.status(200).json(models);
  } catch (error) {
    console.error("Error fetching models by manufacturer ID:", error);
    res.status(500).json({ error: "Failed to fetch models.", details: error.message });
  }
};



// const addAmenities = async (req, res) => {
//   const { manufacturerId } = req.query;

//   console.log("req",manufacturerId);

//   try {
//     const make = await ManufacturerModel.findOne({ _id: manufacturerId });
//     console.log(make)
//     const model = new yachtBrandModel({
//      ...req.body,
//      manufacturer: {
//         id: make._id,
//         name: make.name,
//       },
//     });
//     await model.save();
//     res.status(201).json({ message: "Model added successfully", model });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to add model", details: error.message });
//   }
// };

const getAmenities =async (req,res)=>{
  try {
  const amenities =await AmenityModel.find()
   res.status(200).send(amenities) 
  } catch (error) {
    console.error("Error fetching models by manufacturer ID:", error);
    res.status(500).json({ error: "Failed to fetch models.", details: error.message });
  }

}

// POST /api/amenities/bulk

const getAmenitiesOfYachtByIds =async (req,res)=>{
  const { ids } = req.body; 
  try {
    const amenities = await AmenityModel.find({ _id: { $in: ids } });
    res.status(200).json(amenities);
} catch (error) {
    res.status(500).json({ error: 'Failed to fetch amenities' });
}

}

module.exports = {
  addManufacturers,
  getManufacturers,
  getModelsByManufacturer,
  addModel,
  getAmenities,
  getAmenitiesOfYachtByIds
};
