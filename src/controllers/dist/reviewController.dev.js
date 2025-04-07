"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// const { getReviews, saveReviews } = require("../repositories/reviewsRepository");
// const addReview = async (req, res,next) => {
//     try {
//         const userId = req.userId;
//         const reviewDetails = req.body;
//         const Review = await saveReviews(userId, reviewDetails);
//         res.status(200).send(Review);
//       } catch (error) {
//         console.log(error);
//         next(error)
//       }
//   };
// const getReviwsAndTestimonials = async (req, res) => {
//   try {
//     const {yachtId} = req.params;
//     const Reviews = await getReviews(yachtId);
//     res.status(200).json({ status: "success", data: Reviews });
//   } catch (error) {
//     console.error('Error retrieving user profile:', error);
//     res.status(500).json({ status: "failed", message: 'Server error' });
//   }
// };
// const updateReviews = async (req, res) => {
//   try {
//     const reviewId = req.params.reviewId;
//     const reviewDetails = req.body;
//     // Ensure the user has permission to update this profile
//     if(req.userId.toString()!==userId.toString()){
//       return res.status(403).json({ status: "failed", message: 'Not Authorised' }); 
//     }
//     const updatedUser = await updateUserById(userId, updatedData);
//     if (!updatedUser) {
//       return res.status(404).json({ status: "failed", message: 'User not found' });
//     }
//     res.status(200).json({ status: "success", data: updatedUser });
//   } catch (error) {
//     console.error('Error updating user profile:', error);
//     res.status(500).json({ status: "failed", message: 'Server error' });
//   }
// };
// const deleteReviews = async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const updatedData = req.body;
//       // Ensure the user has permission to update this profile
//       if(req.userId.toString()!==userId.toString()){
//         return res.status(403).json({ status: "failed", message: 'Not Authorised' }); 
//       }
//       const updatedUser = await updateUserById(userId, updatedData);
//       if (!updatedUser) {
//         return res.status(404).json({ status: "failed", message: 'User not found' });
//       }
//       res.status(200).json({ status: "success", data: updatedUser });
//     } catch (error) {
//       console.error('Error updating user profile:', error);
//       res.status(500).json({ status: "failed", message: 'Server error' });
//     }
//   };
// module.exports = {
//  addReview,
//  getReviwsAndTestimonials,
//  updateReviews,
//  deleteReviews
// };
var ReviewModel = require('../models/reviewModel'); // Get reviews and testimonials with filtering, sorting and pagination


var getReviwsAndTestimonials = function getReviwsAndTestimonials(req, res) {
  var _req$query, _req$query$page, page, _req$query$limit, limit, _req$query$order, order, _req$query$sort, sort, rating, category, type, status, featured, yachtId, search, filter, total, sortDirection, sortField, sortObj, reviews, formattedReviews;

  return regeneratorRuntime.async(function getReviwsAndTestimonials$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 5 : _req$query$limit, _req$query$order = _req$query.order, order = _req$query$order === void 0 ? 'desc' : _req$query$order, _req$query$sort = _req$query.sort, sort = _req$query$sort === void 0 ? '-createdAt' : _req$query$sort, rating = _req$query.rating, category = _req$query.category, type = _req$query.type, status = _req$query.status, featured = _req$query.featured, yachtId = _req$query.yachtId, search = _req$query.search; // Build filter object

          filter = {};
          if (rating) filter.rating = rating;
          if (category) filter.category = category;
          if (type) filter.type = type;
          if (status) filter.status = status;
          if (featured) filter.featured = featured === 'true';
          if (yachtId) filter.yachtId = yachtId;

          if (search) {
            filter.$or = [{
              userName: {
                $regex: search,
                $options: 'i'
              }
            }, {
              yachtName: {
                $regex: search,
                $options: 'i'
              }
            }];
          } // Get total count for pagination


          _context.next = 12;
          return regeneratorRuntime.awrap(ReviewModel.countDocuments(filter));

        case 12:
          total = _context.sent;
          // Handle sort direction
          sortDirection = order === 'asc' ? 1 : -1; // If sort is 'date', use 'createdAt' field
          // If sort is 'name', use 'userName' field

          if (sort === 'date') {
            sortField = 'createdAt';
          } else if (sort === 'name') {
            sortField = 'userName';
          } else {
            sortField = sort;
          } // Build sort object


          sortObj = {};
          sortObj[sortField] = sortDirection;
          console.log(sortObj); // Get paginated and sorted results

          _context.next = 20;
          return regeneratorRuntime.awrap(ReviewModel.find(filter).sort(sortObj).limit(limit * 1).skip((page - 1) * limit).populate('userId', 'name profilePicture').populate('yachtId', 'name images'));

        case 20:
          reviews = _context.sent;
          // Format data for frontend use
          formattedReviews = reviews.map(function (review) {
            return {
              id: review._id,
              userName: review.userName,
              userAvatar: review.userAvatar,
              yachtName: review.yachtName,
              rating: review.rating,
              title: review.title,
              comment: review.comment,
              date: review.createdAt.toISOString().split('T')[0],
              status: review.status,
              featured: review.featured,
              responded: review.responded,
              response: review.response,
              responseDate: review.responseDate ? review.responseDate.toISOString().split('T')[0] : null,
              category: review.category,
              type: review.type,
              verified: review.verified,
              position: review.position,
              profession: review.profession,
              photos: review.photos
            };
          });
          res.status(200).json({
            status: 'success',
            data: {
              reviews: formattedReviews,
              totalPages: Math.ceil(total / limit),
              currentPage: page,
              totalResults: total
            }
          });
          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](0);
          console.error('Error getting reviews:', _context.t0);
          res.status(500).json({
            status: 'failed',
            message: 'Server error'
          });

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 25]]);
}; // Add new review or testimonial


var addReview = function addReview(req, res) {
  var reviewData, review;
  return regeneratorRuntime.async(function addReview$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req.body);
          _context2.prev = 1;

          // Set isTestimonial to true if type is testimonial
          if (req.body.type === 'testimonial') {
            req.body.isTestimonial = true;
          }

          reviewData = _objectSpread({}, req.body);
          review = new ReviewModel(reviewData);
          _context2.next = 7;
          return regeneratorRuntime.awrap(review.save());

        case 7:
          console.log(review);
          res.status(200).json({
            status: 'success',
            message: 'Review added successfully',
            data: review
          });
          _context2.next = 16;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](1);
          console.log(_context2.t0);
          console.error('Error adding review:', _context2.t0);
          res.status(500).json({
            status: 'failed',
            message: 'Server error'
          });

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 11]]);
}; // Update review or testimonial


var updateReviews = function updateReviews(req, res) {
  var reviewId, updateData, review, updatedReview;
  return regeneratorRuntime.async(function updateReviews$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          reviewId = req.params.reviewId;
          updateData = req.body;
          _context3.next = 5;
          return regeneratorRuntime.awrap(ReviewModel.findById(reviewId));

        case 5:
          review = _context3.sent;

          if (review) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            status: 'failed',
            message: 'Review not found'
          }));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(ReviewModel.findByIdAndUpdate(reviewId, updateData, {
            "new": true
          }));

        case 10:
          updatedReview = _context3.sent;
          res.status(200).json({
            status: 'success',
            data: updatedReview
          });
          _context3.next = 18;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.error('Error updating review:', _context3.t0);
          res.status(500).json({
            status: 'failed',
            message: 'Server error'
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; // Delete review or testimonial


var deleteReviews = function deleteReviews(req, res) {
  var reviewId, review;
  return regeneratorRuntime.async(function deleteReviews$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          reviewId = req.params.reviewId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ReviewModel.findById(reviewId));

        case 4:
          review = _context4.sent;

          if (review) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            status: 'failed',
            message: 'Review not found'
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(ReviewModel.findByIdAndDelete(reviewId));

        case 9:
          res.status(200).json({
            status: 'success',
            message: 'Review deleted successfully'
          });
          _context4.next = 16;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error('Error deleting review:', _context4.t0);
          res.status(500).json({
            status: 'failed',
            message: 'Server error'
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  getReviwsAndTestimonials: getReviwsAndTestimonials,
  addReview: addReview,
  updateReviews: updateReviews,
  deleteReviews: deleteReviews
};