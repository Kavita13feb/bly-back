const express = require('express');
const CategoryRouter = express.Router()
const categoryController = require("../controllers/CategoryController");

CategoryRouter.post("/", categoryController.AddCategories);
CategoryRouter.get("/", categoryController.getCategories);

  module.exports=CategoryRouter