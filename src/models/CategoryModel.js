const mongoose = require("mongoose");
const shortid = require("shortid");

const generateShortId = () => shortid.generate().slice(0, 3);
const generateShortNumericId = () => {
  return Math.floor(10 + Math.random() * 990); // Generates 2- to 3-digit ID
};
const categorySchema = new mongoose.Schema({
  categoryId: { type: String, default: generateShortNumericId, unique: true },
  name: { type: String, required: true },
  subcategories: [
    {
      subcategoryId: { type: String, default: generateShortNumericId, unique: true },
      name: { type: String, required: true },
    },
  ],
},{
  timestamps: true, 
  versionKey: false
});

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
