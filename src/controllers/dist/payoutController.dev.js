"use strict";

var PayoutModel = require("../models/payoutModel");

var crypto = require('crypto');

var generateReferenceId = function generateReferenceId() {
  return "PAYOUT-" + crypto.randomBytes(5).toString("hex").toUpperCase(); // Example: PAYOUT-AB12CD34E
};

var calculateOwnerBalance = function calculateOwnerBalance(ownerId) {
  var completedBookings, totalEarnings;
  return regeneratorRuntime.async(function calculateOwnerBalance$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(BookingModel.find({
            ownerId: ownerId,
            status: "Completed",
            isPaidOut: false
          }));

        case 2:
          completedBookings = _context.sent;
          totalEarnings = completedBookings.reduce(function (sum, booking) {
            return sum + booking.ownerEarning;
          }, 0);
          return _context.abrupt("return", totalEarnings);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}; // 📌 1. Create Payout Request (Owner)


var createPayoutRequest = function createPayoutRequest(req, res) {
  var _req$body, amount, note, owner, completedBookings, availableBalance, bookingIds, _generateReferenceId, payout;

  return regeneratorRuntime.async(function createPayoutRequest$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, amount = _req$body.amount, note = _req$body.note; // ✅ Find owner profile linked to authenticated user

          _context2.next = 4;
          return regeneratorRuntime.awrap(BoatOwnerModel.findOne({
            userId: req.userId
          }));

        case 4:
          owner = _context2.sent;

          if (owner) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Owner profile not found."
          }));

        case 7:
          if (!(!amount || amount <= 0)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Invalid payout amount."
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(BookingModel.find({
            ownerId: owner._id,
            // ✅ Use owner._id here
            status: "Completed",
            isPaidOut: false
          }));

        case 11:
          completedBookings = _context2.sent;
          availableBalance = completedBookings.reduce(function (sum, booking) {
            return sum + booking.ownerEarning;
          }, 0);
          bookingIds = completedBookings.map(function (b) {
            return b._id;
          }); // Collect bookings for payout
          // ✅ Validate amount

          if (!(amount > availableBalance)) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Requested amount exceeds available balance."
          }));

        case 16:
          // ✅ Generate reference ID
          _generateReferenceId = function _generateReferenceId() {
            return "PAYOUT-" + crypto.randomBytes(5).toString("hex").toUpperCase();
          }; // ✅ Create payout request


          _context2.next = 19;
          return regeneratorRuntime.awrap(PayoutModel.create({
            ownerId: owner._id,
            // Correct ownerId
            amount: amount,
            note: note,
            referenceId: _generateReferenceId(),
            bookingIds: bookingIds,
            // Add booking references
            status: "Pending"
          }));

        case 19:
          payout = _context2.sent;
          res.status(201).json({
            message: "Payout request created successfully.",
            payout: payout
          });
          _context2.next = 27;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](0);
          console.error("Error creating payout:", _context2.t0);
          res.status(500).json({
            message: "Internal server error."
          });

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 23]]);
}; // 📌 2. Get All Payout Requests for Logged-in Owner


var getOwnerPayoutRequests = function getOwnerPayoutRequests(req, res) {
  var ownerId, payouts;
  return regeneratorRuntime.async(function getOwnerPayoutRequests$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          ownerId = req.user._id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(PayoutModel.find({
            ownerId: ownerId
          }).sort({
            createdAt: -1
          }));

        case 4:
          payouts = _context3.sent;
          res.status(200).json(payouts);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error("Error fetching owner's payouts:", _context3.t0);
          res.status(500).json({
            message: "Internal server error."
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // 📌 3. Get a Single Payout by ID (Owner)


var getPayoutById = function getPayoutById(req, res) {
  var payoutId, payout;
  return regeneratorRuntime.async(function getPayoutById$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          payoutId = req.params.payoutId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(PayoutModel.findById(payoutId));

        case 4:
          payout = _context4.sent;

          if (payout) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Payout not found."
          }));

        case 7:
          res.status(200).json(payout);
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.error("Error fetching payout by ID:", _context4.t0);
          res.status(500).json({
            message: "Internal server error."
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
};
/* ========================================================
 ✅ ADMIN CONTROLLERS
======================================================== */
// 📌 4. Admin: Get All Payout Requests (Filtered)


var getAllPayoutRequests = function getAllPayoutRequests(req, res) {
  var status, filters, payouts;
  return regeneratorRuntime.async(function getAllPayoutRequests$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          status = req.query.status;
          filters = status ? {
            status: status
          } : {};
          _context5.next = 5;
          return regeneratorRuntime.awrap(PayoutModel.find(filters).populate("ownerId", "name email contact profilePic").sort({
            createdAt: -1
          }));

        case 5:
          payouts = _context5.sent;
          res.status(200).json(payouts);
          _context5.next = 13;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.error("Error fetching all payouts:", _context5.t0);
          res.status(500).json({
            message: "Internal server error."
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // 📌 5. Admin: Approve/Reject/Mark Paid a Payout (Single Dynamic Route)


var updatePayoutStatus = function updatePayoutStatus(req, res) {
  var payoutId, _req$body2, status, transactionId, adminNote, updateData, updatedPayout;

  return regeneratorRuntime.async(function updatePayoutStatus$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          payoutId = req.params.payoutId;
          _req$body2 = req.body, status = _req$body2.status, transactionId = _req$body2.transactionId, adminNote = _req$body2.adminNote;

          if (["Approved", "Rejected", "Paid"].includes(status)) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: "Invalid status value."
          }));

        case 5:
          updateData = {
            status: status,
            adminNote: adminNote || ""
          };

          if (!(status === "Paid")) {
            _context6.next = 11;
            break;
          }

          if (transactionId) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: "Transaction ID is required for marking as Paid."
          }));

        case 9:
          updateData.transactionId = transactionId;
          updateData.processedAt = new Date();

        case 11:
          _context6.next = 13;
          return regeneratorRuntime.awrap(PayoutModel.findByIdAndUpdate(payoutId, {
            $set: updateData
          }, {
            "new": true
          }));

        case 13:
          updatedPayout = _context6.sent;

          if (updatedPayout) {
            _context6.next = 16;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: "Payout not found."
          }));

        case 16:
          res.status(200).json({
            message: "Payout updated successfully.",
            payout: updatedPayout
          });
          _context6.next = 23;
          break;

        case 19:
          _context6.prev = 19;
          _context6.t0 = _context6["catch"](0);
          console.error("Error updating payout status:", _context6.t0);
          res.status(500).json({
            message: "Internal server error."
          });

        case 23:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

module.exports = {
  createPayoutRequest: createPayoutRequest,
  getOwnerPayoutRequests: getOwnerPayoutRequests,
  getPayoutById: getPayoutById,
  getAllPayoutRequests: getAllPayoutRequests,
  updatePayoutStatus: updatePayoutStatus
};