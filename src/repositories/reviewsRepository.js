
const ReviewModel = require("../models/reviewModel");

// const saveReviews = async (userId, reviewDetails) => {
//   try {
//     let ReviewDetailsWithIds = {
//       ...reviewDetails,
//       userId
//     };

//     const Review = await ReviewModel(ReviewDetailsWithIds);
//     await Review.save();
//     return Review;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

const saveReviews = async (userId, reviewDetails) => {
  try {
    if (Array.isArray(reviewDetails)) {
      // ✅ Bulk Insert: Add userId to each review and insert multiple reviews
      const reviewsWithUserIds = reviewDetails.map(review => ({ ...review, userId }));
      const savedReviews = await ReviewModel.insertMany(reviewsWithUserIds);
      return savedReviews; // Returns an array of saved reviews
    } else {
      // ✅ Single Insert: Add userId and save one review
      const reviewWithUserId = new ReviewModel({ ...reviewDetails, userId });
      await reviewWithUserId.save();
      return reviewWithUserId; // Returns a single saved review
    }
  } catch (error) {
    console.error("Error saving reviews:", error);
    throw error;
  }
};


const getReviews = async (yachtId) => {
  try {
    let query = {yachtId};

    const Reviews = await ReviewModel.find(query)
      .populate("userId", "name profilePicture") // Fetch `name` & `profilePicture` from `User` collection
      .sort({ createdAt: -1 }); // Optional: Sort by latest reviews
// console.log(query,Reviews)
    return Reviews;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const editBoatReview = async (reviewId, reviewDetails) => {
  try {
    const upReview = await ReviewModel.findByIdAndUpdate(
      { _id: reviewId },
      reviewDetails
    );

    return upReview;
  } catch (error) {
    console.log(error);
  }
};

const deleteBoatReview = async (reviewId) => {
  try {
    const del_review = await ReviewModel.findByIdAndDelete(reviewId);

    return del_review;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  saveReviews,
  getReviews,
  editBoatReview,
  deleteBoatReview,
};
