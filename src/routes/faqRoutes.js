const express = require("express");
const {
  getFAQs,
  searchFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getAllFAQs,
  getAllFAQCategories,
  getFAQCategory,
  createFAQCategory,
  updateFAQCategory,
  deleteFAQCategory,
} = require("../controllers/faqController");
const { authorise } = require("../middlewares/authorise");

const faqRouter = express.Router();
// FAQ Category Routes
faqRouter.get("/categories", getAllFAQCategories);
faqRouter.get("/categories/:id", getFAQCategory);
faqRouter.post("/categories", createFAQCategory); 
faqRouter.patch("/categories/:id", updateFAQCategory);
faqRouter.delete("/categories/:id", deleteFAQCategory);

// Get FAQs by category & user type
faqRouter.get("/", getAllFAQs);

faqRouter.get("/:category/:userType", getFAQs);

// Search FAQs
faqRouter.get("/search/:query/:userType", searchFAQs);

// faqRouter.use(authorise(["b"]))
// Admin: Create a new FAQ
faqRouter.post("/", createFAQ);

// Admin: Update an FAQ
faqRouter.put("/:id", updateFAQ);

// Admin: Delete an FAQ
faqRouter.delete("/:id", deleteFAQ);

module.exports = faqRouter;
