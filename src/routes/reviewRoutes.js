// const express = require("express");
// const {
//   getBoatReviws,
//   addReview,
//   updateReviews,
//   deleteReviews,
// } = require("../controllers/reviewController");
// const authenticate = require("../middlewares/authenticate");

// const reviewRouter = express.Router();

// reviewRouter.get("/:yachtId", getBoatReviws);

// //admin //owner if allowed
// reviewRouter.post("/", authenticate, addReview);

// reviewRouter.patch("/:reviewId", updateReviews);
// reviewRouter.delete("/:reviewId", deleteReviews);

// module.exports = reviewRouter;

const express = require("express");
const {
  addReview,
  getReviwsAndTestimonials,
  updateReviews, 
  deleteReviews
} = require("../controllers/reviewController");
const authenticate = require("../middlewares/authenticate");

const reviewRouter = express.Router();

// Get reviews for a specific yacht
reviewRouter.get("/yacht/:yachtId", getReviwsAndTestimonials);

// Get all reviews (can be filtered in controller)
reviewRouter.get("/", getReviwsAndTestimonials);

// Add new review - requires authentication
reviewRouter.post("/", addReview);

// Update review
reviewRouter.patch("/:reviewId", updateReviews);

// Delete review
reviewRouter.delete("/:reviewId", deleteReviews);

module.exports = reviewRouter;
