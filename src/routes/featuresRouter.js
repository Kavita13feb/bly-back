const express = require('express');
const featuresRouter = express.Router()
const featuresController = require("../controllers/featuresController");

featuresRouter.post("/make", featuresController.addManufacturers);
featuresRouter.post("/model", featuresController.addModel);
featuresRouter.get("/model", featuresController.getModelsByManufacturer);
featuresRouter.get("/make", featuresController.getManufacturers);
featuresRouter.get("/amenities",featuresController.getAmenities)
featuresRouter.post("/amenities/bulk",featuresController.getAmenitiesOfYachtByIds)


  module.exports=featuresRouter