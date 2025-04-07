const CategoryModel = require("../models/CategoryModel");


const AddCategories = async (req, res) => {
    try {
      const { name, subcategories } = req.body;
  console.log(req.body)
      // Create category object with only `name` for subcategories
      const category = new CategoryModel({
        name,
        subcategories: subcategories.map((sub) => ({
          name: sub.name, // Only include the name
        })),
      });
  
      // Save the category, mongoose-sequence will auto-generate `categoryId`
      console.log(category)
      const savedCategory = await category.save();
      res.status(201).json({ message: "Category created", category: savedCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create category" });
    }
  };
  
  


 const getCategories= async (req, res) => {
    try {
      const categories = await CategoryModel.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  };
  
  module.exports= {AddCategories,getCategories}