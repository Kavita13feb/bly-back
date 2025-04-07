"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("mongoose"),
    mongoose = _require["default"];

var _require2 = require("../models/faqModel"),
    FAQ = _require2.FAQ;

var _require3 = require("../models/faqModel"),
    FaqCategory = _require3.FaqCategory; // Get all FAQ categories


exports.getAllFAQCategories = function _callee(req, res) {
  var _req$query, search, _req$query$sort, sort, _req$query$order, order, filter, sortObj, _req$query2, _req$query2$page, page, _req$query2$limit, limit, skip, categories, total, totalPages;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Extract search and sort parameters from query
          _req$query = req.query, search = _req$query.search, _req$query$sort = _req$query.sort, sort = _req$query$sort === void 0 ? 'order' : _req$query$sort, _req$query$order = _req$query.order, order = _req$query$order === void 0 ? 'asc' : _req$query$order;
          console.log(req.query); // Build filter object

          filter = {
            active: true
          };

          if (search) {
            filter.name = {
              $regex: search,
              $options: 'i'
            }; // Case-insensitive search
          } // Build sort object


          sortObj = {};
          sortObj[sort] = order === 'asc' ? 1 : -1;
          _req$query2 = req.query, _req$query2$page = _req$query2.page, page = _req$query2$page === void 0 ? 1 : _req$query2$page, _req$query2$limit = _req$query2.limit, limit = _req$query2$limit === void 0 ? 10 : _req$query2$limit;
          skip = (page - 1) * limit; // Apply filter and sort to query

          _context.next = 11;
          return regeneratorRuntime.awrap(FaqCategory.find(filter).sort(sortObj).skip(skip).limit(parseInt(limit)));

        case 11:
          categories = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(FaqCategory.countDocuments(filter));

        case 14:
          total = _context.sent;
          totalPages = Math.ceil(total / parseInt(limit));
          return _context.abrupt("return", res.json({
            categories: categories,
            totalPages: totalPages,
            totalCategories: total
          }));

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Error fetching FAQ categories",
            error: _context.t0
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
}; // Get single FAQ category by ID


exports.getFAQCategory = function _callee2(req, res) {
  var category;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(FaqCategory.findById(req.params.id));

        case 3:
          category = _context2.sent;

          if (category) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "FAQ category not found"
          }));

        case 6:
          res.json(category);
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Error fetching FAQ category",
            error: _context2.t0
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Create new FAQ category


exports.createFAQCategory = function _callee3(req, res) {
  var _req$body, name, description, slug, order, userType, icon, existingCategory, category;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log(req.body);
          _req$body = req.body, name = _req$body.name, description = _req$body.description, slug = _req$body.slug, order = _req$body.order, userType = _req$body.userType, icon = _req$body.icon; // Check if slug already exists

          _context3.next = 5;
          return regeneratorRuntime.awrap(FaqCategory.findOne({
            slug: slug
          }));

        case 5:
          existingCategory = _context3.sent;

          if (!existingCategory) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Category with this slug already exists"
          }));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(FaqCategory.create({
            name: name,
            description: description,
            slug: slug,
            order: order,
            userType: "both",
            icon: icon,
            active: true
          }));

        case 10:
          category = _context3.sent;
          res.status(201).json(category);
          _context3.next = 17;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: "Error creating FAQ category",
            error: _context3.t0
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; // Update FAQ category


exports.updateFAQCategory = function _callee4(req, res) {
  var _req$body2, name, description, slug, order, userType, icon, active, existingCategory, category;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body2 = req.body, name = _req$body2.name, description = _req$body2.description, slug = _req$body2.slug, order = _req$body2.order, userType = _req$body2.userType, icon = _req$body2.icon, active = _req$body2.active;
          console.log(req.body); // Check if slug already exists for other categories

          _context4.next = 5;
          return regeneratorRuntime.awrap(FaqCategory.findOne({
            slug: slug,
            _id: {
              $ne: req.params.id
            }
          }));

        case 5:
          existingCategory = _context4.sent;

          if (!existingCategory) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "Category with this slug already exists"
          }));

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap(FaqCategory.findByIdAndUpdate(req.params.id, {
            name: name,
            description: description,
            slug: slug,
            order: order,
            userType: userType,
            icon: icon,
            active: active
          }, {
            "new": true
          }));

        case 10:
          category = _context4.sent;

          if (category) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "FAQ category not found"
          }));

        case 13:
          console.log(category);
          res.json(category);
          _context4.next = 20;
          break;

        case 17:
          _context4.prev = 17;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: "Error updating FAQ category",
            error: _context4.t0
          });

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 17]]);
}; // Delete FAQ category


exports.deleteFAQCategory = function _callee5(req, res) {
  var category;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(FaqCategory.findByIdAndDelete(req.params.id));

        case 3:
          category = _context5.sent;

          if (category) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "FAQ category not found"
          }));

        case 6:
          res.json({
            message: "FAQ category deleted successfully"
          });
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: "Error deleting FAQ category",
            error: _context5.t0
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getAllFAQs = function _callee6(req, res) {
  var _req$query3, _req$query3$page, page, _req$query3$limit, limit, _req$query3$sort, sort, _req$query3$order, order, search, category, status, featured, query, skip, sortObj, total, totalPages, faqs;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$query3 = req.query, _req$query3$page = _req$query3.page, page = _req$query3$page === void 0 ? 1 : _req$query3$page, _req$query3$limit = _req$query3.limit, limit = _req$query3$limit === void 0 ? 5 : _req$query3$limit, _req$query3$sort = _req$query3.sort, sort = _req$query3$sort === void 0 ? 'order' : _req$query3$sort, _req$query3$order = _req$query3.order, order = _req$query3$order === void 0 ? 'asc' : _req$query3$order, search = _req$query3.search, category = _req$query3.category, status = _req$query3.status, featured = _req$query3.featured; // Build query object

          query = {}; // Add search filter if provided

          if (search) {
            query.$or = [{
              question: {
                $regex: search,
                $options: "i"
              }
            }, {
              answer: {
                $regex: search,
                $options: "i"
              }
            }];
          } // Add category filter if provided


          if (category) {
            // Convert category ID to ObjectId if it's a valid ObjectId
            if (mongoose.Types.ObjectId.isValid(category)) {
              query.categoryId = new mongoose.Types.ObjectId(category);
            } else {
              query.categoryId = category;
            } // query.categoryId = category;

          } // Add status filter if provided  


          if (status) {
            query.status = status;
          }

          console.log(featured); // Add featured filter if provided

          if (featured) {
            query.featured = featured === 'true';
          } // Calculate skip value for pagination


          skip = (page - 1) * limit; // Build sort object

          sortObj = {};
          sortObj[sort] = order === 'asc' ? 1 : -1; // Get total count for pagination

          _context6.next = 13;
          return regeneratorRuntime.awrap(FAQ.countDocuments(query));

        case 13:
          total = _context6.sent;
          totalPages = Math.ceil(total / limit);
          console.log(totalPages);
          console.log(query); // Get FAQs with pagination and sorting

          _context6.next = 19;
          return regeneratorRuntime.awrap(FAQ.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)));

        case 19:
          faqs = _context6.sent;
          // Send response with FAQs and pagination info
          res.json({
            faqs: faqs,
            currentPage: parseInt(page),
            totalPages: totalPages,
            totalFaqs: total
          });
          _context6.next = 27;
          break;

        case 23:
          _context6.prev = 23;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          res.status(500).json({
            message: "Error fetching FAQs",
            error: _context6.t0
          });

        case 27:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 23]]);
}; // ✅ Get FAQs by category & user type


exports.getFAQs = function _callee7(req, res) {
  var _req$params, category, userType, faqs;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$params = req.params, category = _req$params.category, userType = _req$params.userType; // Find FAQs matching the category and userType (or both)

          _context7.next = 4;
          return regeneratorRuntime.awrap(FAQ.find({
            category: category,
            isVisible: true,
            $or: [{
              userType: userType
            }, {
              userType: "both"
            }] // Show FAQs for specific user or both

          }).sort({
            order: 1
          }));

        case 4:
          faqs = _context7.sent;
          res.json(faqs);
          _context7.next = 11;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          res.status(500).json({
            message: "Error fetching FAQs",
            error: _context7.t0
          });

        case 11:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // ✅ Search FAQs for specific user type


exports.searchFAQs = function _callee8(req, res) {
  var _req$params2, query, userType, faqs;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$params2 = req.params, query = _req$params2.query, userType = _req$params2.userType;
          _context8.next = 4;
          return regeneratorRuntime.awrap(FAQ.find(_defineProperty({
            $or: [{
              question: {
                $regex: query,
                $options: "i"
              }
            }, {
              answer: {
                $regex: query,
                $options: "i"
              }
            }],
            isVisible: true
          }, "$or", [{
            userType: userType
          }, {
            userType: "both"
          }])));

        case 4:
          faqs = _context8.sent;
          res.json(faqs);
          _context8.next = 11;
          break;

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          res.status(500).json({
            message: "Error searching FAQs",
            error: _context8.t0
          });

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // ✅ Create a new FAQ (Admin only)


exports.createFAQ = function _callee9(req, res) {
  var category, newFAQ;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          console.log(req.body); // Convert categoryId string to ObjectId and fetch category name

          if (!req.body.categoryId) {
            _context9.next = 13;
            break;
          }

          // Convert to ObjectId
          req.body.categoryId = new mongoose.Types.ObjectId(req.body.categoryId); // Fetch category name

          _context9.next = 6;
          return regeneratorRuntime.awrap(FaqCategory.findById(req.body.categoryId));

        case 6:
          category = _context9.sent;

          if (!category) {
            _context9.next = 12;
            break;
          }

          req.body.category = category.name;
          req.body.userType = "both";
          _context9.next = 13;
          break;

        case 12:
          return _context9.abrupt("return", res.status(400).json({
            message: "Invalid category ID"
          }));

        case 13:
          newFAQ = new FAQ(req.body);
          _context9.next = 16;
          return regeneratorRuntime.awrap(newFAQ.save());

        case 16:
          res.status(201).json(newFAQ);
          _context9.next = 23;
          break;

        case 19:
          _context9.prev = 19;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          res.status(400).json({
            message: "Error creating FAQ",
            error: _context9.t0
          });

        case 23:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 19]]);
}; // exports.createFAQ = async (req, res) => {
//   try {
//     const faqs = req.body; // Expecting either a single object or an array of objects
//     if (!Array.isArray(faqs)) {
//       // If it's a single object, convert it into an array for uniform handling
//       faqs = [faqs];
//     }
//     // Insert multiple FAQs in bulk
//     const createdFAQs = await FAQ.insertMany(faqs);
//     res.status(201).json({ message: "FAQs added successfully", data: createdFAQs });
//   } catch (error) {
//     res.status(400).json({ message: "Error creating FAQs", error });
//   }
// };
// ✅ Update an FAQ (Admin only)


exports.updateFAQ = function _callee10(req, res) {
  var id, updatedFAQ;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          id = req.params.id;
          console.log(id);
          _context10.next = 5;
          return regeneratorRuntime.awrap(FAQ.findByIdAndUpdate(id, req.body, {
            "new": true
          }));

        case 5:
          updatedFAQ = _context10.sent;
          res.json(updatedFAQ);
          _context10.next = 13;
          break;

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          res.status(400).json({
            message: "Error updating FAQ",
            error: _context10.t0
          });

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // ✅ Delete an FAQ (Admin only)


exports.deleteFAQ = function _callee11(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          id = req.params.id;
          _context11.next = 4;
          return regeneratorRuntime.awrap(FAQ.findByIdAndDelete(id));

        case 4:
          res.json({
            message: "FAQ deleted successfully"
          });
          _context11.next = 10;
          break;

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          res.status(400).json({
            message: "Error deleting FAQ",
            error: _context11.t0
          });

        case 10:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // category: {
//   type: String,
//   enum: ["platform", "yacht", "cancellation", "pricing", "general"],
//   // required: true,
// },