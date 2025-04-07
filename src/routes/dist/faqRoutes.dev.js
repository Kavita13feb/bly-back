"use strict";

var express = require("express");

var _require = require("../controllers/faqController"),
    getFAQs = _require.getFAQs,
    searchFAQs = _require.searchFAQs,
    createFAQ = _require.createFAQ,
    updateFAQ = _require.updateFAQ,
    deleteFAQ = _require.deleteFAQ,
    getAllFAQs = _require.getAllFAQs,
    getAllFAQCategories = _require.getAllFAQCategories,
    getFAQCategory = _require.getFAQCategory,
    createFAQCategory = _require.createFAQCategory,
    updateFAQCategory = _require.updateFAQCategory,
    deleteFAQCategory = _require.deleteFAQCategory;

var _require2 = require("../middlewares/authorise"),
    authorise = _require2.authorise;

var faqRouter = express.Router(); // FAQ Category Routes

faqRouter.get("/categories", getAllFAQCategories);
faqRouter.get("/categories/:id", getFAQCategory);
faqRouter.post("/categories", createFAQCategory);
faqRouter.patch("/categories/:id", updateFAQCategory);
faqRouter["delete"]("/categories/:id", deleteFAQCategory); // Get FAQs by category & user type

faqRouter.get("/", getAllFAQs);
faqRouter.get("/:category/:userType", getFAQs); // Search FAQs

faqRouter.get("/search/:query/:userType", searchFAQs); // faqRouter.use(authorise(["b"]))
// Admin: Create a new FAQ

faqRouter.post("/", createFAQ); // Admin: Update an FAQ

faqRouter.put("/:id", updateFAQ); // Admin: Delete an FAQ

faqRouter["delete"]("/:id", deleteFAQ);
module.exports = faqRouter;