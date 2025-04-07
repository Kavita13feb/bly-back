"use strict";

var BoatModel = require("../models/boatModel");

var BoatOwnerModel = require("../models/boatOwnerModel");

var InstaBookModel = require("../models/InstaBookModel"); // Create a new InstaBook entry


exports.createInstaBook = function _callee(req, res) {
  var instaBook;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          instaBook = new InstaBookModel(req.body);
          _context.next = 4;
          return regeneratorRuntime.awrap(instaBook.save());

        case 4:
          res.status(201).json(instaBook);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(400).json({
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Get all InstaBook entries
// exports.getAllInstaBooksByOwner = async (req, res) => {
//   const ownerId = req.userId;
//   // Assuming ownerId is passed as a URL parameter
//   console.log(ownerId);
//   try {
//     // Find all yachts owned by the owner
//     const yachts = await BoatModel.find({ ownerId }).select("_id title");
//     // Extract yacht IDs
//     const yachtIds = yachts.map((yacht) => yacht._id);
//     // Find all InstaBook entries for those yachts
//     const instaBooks = await InstaBookModel.find({
//       yachtId: { $in: yachtIds },
//     }).populate({ path: "yachtId", select: "title" });
//     // console.log(instaBooks);
//     res.status(200).json(instaBooks);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };


exports.getAllInstaBooksByOwner = function _callee2(req, res) {
  var userId, owner, ownerId, yachtId, yachts, yachtIds, instaBooks;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          userId = req.userId;
          _context2.next = 3;
          return regeneratorRuntime.awrap(BoatOwnerModel.findOne({
            userId: userId
          }));

        case 3:
          owner = _context2.sent;
          ownerId = owner._id;
          yachtId = req.query.yachtId; // ✅ Get yachtId from query param if provided

          _context2.prev = 6;

          if (!yachtId) {
            _context2.next = 13;
            break;
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(BoatModel.find({
            ownerId: ownerId,
            _id: yachtId
          }).select("_id title"));

        case 10:
          yachts = _context2.sent;
          _context2.next = 16;
          break;

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap(BoatModel.find({
            ownerId: ownerId
          }).select("_id title"));

        case 15:
          yachts = _context2.sent;

        case 16:
          // Extract yacht IDs
          yachtIds = yachts.map(function (yacht) {
            return yacht._id;
          });

          if (!(yachtIds.length === 0)) {
            _context2.next = 19;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "No yachts found for this owner"
          }));

        case 19:
          _context2.next = 21;
          return regeneratorRuntime.awrap(InstaBookModel.find({
            yachtId: {
              $in: yachtIds
            }
          }).populate({
            path: "yachtId",
            select: "title"
          }));

        case 21:
          instaBooks = _context2.sent;
          res.status(200).json(instaBooks);
          _context2.next = 29;
          break;

        case 25:
          _context2.prev = 25;
          _context2.t0 = _context2["catch"](6);
          console.error("Error fetching InstaBooks:", _context2.t0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 25]]);
};

exports.getInstaBooksByYacht = function _callee3(req, res) {
  var yachtId, _req$query, startDate, endDate, filter, instaBooks;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          yachtId = req.params.yachtId;
          _req$query = req.query, startDate = _req$query.startDate, endDate = _req$query.endDate;
          _context3.prev = 2;
          filter = {
            yachtId: yachtId
          }; // ✅ Validate and Convert Dates to ISO Format

          if (startDate) startDate = new Date(startDate).toISOString();
          if (endDate) endDate = new Date(endDate).toISOString(); // ✅ If only startDate is provided → Get bookings from that date onward

          if (startDate && !endDate) {
            filter.date = {
              $gte: startDate
            };
          } // ✅ If both startDate & endDate are provided → Fetch within range


          if (startDate && endDate) {
            filter.date = {
              $gte: startDate,
              $lte: endDate
            };
          }

          _context3.next = 10;
          return regeneratorRuntime.awrap(InstaBookModel.find(filter).sort({
            date: 1
          }));

        case 10:
          instaBooks = _context3.sent;
          console.log(instaBooks);

          if (!(!instaBooks || instaBooks.length === 0)) {
            _context3.next = 14;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "No InstaBooks found for this yacht"
          }));

        case 14:
          res.status(200).json(instaBooks);
          _context3.next = 21;
          break;

        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](2);
          console.error(_context3.t0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 17]]);
}; // Get a single InstaBook entry by ID


exports.getInstaBookById = function _callee4(req, res) {
  var instaBook;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(InstaBookModel.findById(req.params.id).populate("yachtId"));

        case 3:
          instaBook = _context4.sent;

          if (instaBook) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "InstaBook not found"
          }));

        case 6:
          res.status(200).json(instaBook);
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Update an InstaBook entry


exports.updateInstaBook = function _callee5(req, res) {
  var instaBook;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(InstaBookModel.findByIdAndUpdate(req.params.id, req.body, {
            "new": true,
            runValidators: true
          }));

        case 3:
          instaBook = _context5.sent;

          if (instaBook) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: "InstaBook not found"
          }));

        case 6:
          res.status(200).json(instaBook);
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          res.status(400).json({
            error: _context5.t0.message
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Delete an InstaBook entry


exports.deleteInstaBook = function _callee6(req, res) {
  var instaBook;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(InstaBookModel.findByIdAndDelete(req.params.id));

        case 3:
          instaBook = _context6.sent;

          if (instaBook) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: "InstaBook not found"
          }));

        case 6:
          res.status(200).json({
            message: "InstaBook deleted successfully"
          });
          _context6.next = 12;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            error: _context6.t0.message
          });

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
};