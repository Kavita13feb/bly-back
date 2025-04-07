"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ReviewModel = require("../models/reviewModel"); // const saveReviews = async (userId, reviewDetails) => {
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


var saveReviews = function saveReviews(userId, reviewDetails) {
  var reviewsWithUserIds, savedReviews, reviewWithUserId;
  return regeneratorRuntime.async(function saveReviews$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (!Array.isArray(reviewDetails)) {
            _context.next = 9;
            break;
          }

          // ✅ Bulk Insert: Add userId to each review and insert multiple reviews
          reviewsWithUserIds = reviewDetails.map(function (review) {
            return _objectSpread({}, review, {
              userId: userId
            });
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(ReviewModel.insertMany(reviewsWithUserIds));

        case 5:
          savedReviews = _context.sent;
          return _context.abrupt("return", savedReviews);

        case 9:
          // ✅ Single Insert: Add userId and save one review
          reviewWithUserId = new ReviewModel(_objectSpread({}, reviewDetails, {
            userId: userId
          }));
          _context.next = 12;
          return regeneratorRuntime.awrap(reviewWithUserId.save());

        case 12:
          return _context.abrupt("return", reviewWithUserId);

        case 13:
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error("Error saving reviews:", _context.t0);
          throw _context.t0;

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var getReviews = function getReviews(yachtId) {
  var query, Reviews;
  return regeneratorRuntime.async(function getReviews$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          query = {
            yachtId: yachtId
          };
          _context2.next = 4;
          return regeneratorRuntime.awrap(ReviewModel.find(query).populate("userId", "name profilePicture") // Fetch `name` & `profilePicture` from `User` collection
          .sort({
            createdAt: -1
          }));

        case 4:
          Reviews = _context2.sent;
          return _context2.abrupt("return", Reviews);

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          throw _context2.t0;

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var editBoatReview = function editBoatReview(reviewId, reviewDetails) {
  var upReview;
  return regeneratorRuntime.async(function editBoatReview$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(ReviewModel.findByIdAndUpdate({
            _id: reviewId
          }, reviewDetails));

        case 3:
          upReview = _context3.sent;
          return _context3.abrupt("return", upReview);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var deleteBoatReview = function deleteBoatReview(reviewId) {
  var del_review;
  return regeneratorRuntime.async(function deleteBoatReview$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(ReviewModel.findByIdAndDelete(reviewId));

        case 3:
          del_review = _context4.sent;
          return _context4.abrupt("return", del_review);

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  saveReviews: saveReviews,
  getReviews: getReviews,
  editBoatReview: editBoatReview,
  deleteBoatReview: deleteBoatReview
};