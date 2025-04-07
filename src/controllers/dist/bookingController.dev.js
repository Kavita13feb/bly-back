"use strict";

var bookingModel = require("../models/bookingModel");

var PaymentModel = require("../models/PaymentModel");

var UserModel = require("../models/userModel");

var _require = require("../repositories/bookingsRepository"),
    saveBookingData = _require.saveBookingData,
    getBoatBookings = _require.getBoatBookings,
    getOwnerBookings = _require.getOwnerBookings,
    getBookingDetails = _require.getBookingDetails,
    editBookingData = _require.editBookingData,
    deleteBookingData = _require.deleteBookingData;

var _require2 = require("../services/stripeService"),
    CreateCheckoutSession = _require2.CreateCheckoutSession,
    getSessionDetails = _require2.getSessionDetails;

var crypto = require("crypto");

var generateIds = function generateIds(type) {
  return "".concat(type, "-") + crypto.randomBytes(4).toString("hex").toUpperCase();
};

var addBooking = function addBooking(req, res) {
  var _req$body, yachtId, startDate, endDate, startTime, endTime, tripDuration, groupSize, maxCapacity, pricing, amount, occasion, exchangeRate, instabookId, userId, newBooking, savedBooking, user, session, newPayment, savedPayment;

  return regeneratorRuntime.async(function addBooking$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, yachtId = _req$body.yachtId, startDate = _req$body.startDate, endDate = _req$body.endDate, startTime = _req$body.startTime, endTime = _req$body.endTime, tripDuration = _req$body.tripDuration, groupSize = _req$body.groupSize, maxCapacity = _req$body.maxCapacity, pricing = _req$body.pricing, amount = _req$body.amount, occasion = _req$body.occasion, exchangeRate = _req$body.exchangeRate, instabookId = _req$body.instabookId, userId = _req$body.userId; // console.log(req.body);
          // const userId = "671cfe89a108e0747a02a788";

          newBooking = new bookingModel({
            userId: userId,
            yachtId: yachtId,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime,
            tripDuration: tripDuration,
            groupSize: groupSize,
            maxCapacity: maxCapacity,
            pricing: pricing,
            bookingRef: generateIds('YB'),
            txnId: generateIds('TXN'),
            occasion: occasion,
            amount: amount,
            exchangeRate: exchangeRate,
            status: "pending"
          });
          console.log(exchangeRate);
          _context.next = 6;
          return regeneratorRuntime.awrap(newBooking.save());

        case 6:
          savedBooking = _context.sent;
          console.log(savedBooking);
          console.log(userId);
          _context.next = 11;
          return regeneratorRuntime.awrap(UserModel.findById({
            _id: userId
          }));

        case 11:
          user = _context.sent;
          console.log(user);
          _context.next = 15;
          return regeneratorRuntime.awrap(CreateCheckoutSession(user.email, pricing, savedBooking._id, savedBooking.bookingRef, instabookId, yachtId));

        case 15:
          session = _context.sent;

          if (!session) {
            _context.next = 24;
            break;
          }

          newPayment = new PaymentModel({
            bookingId: savedBooking._id,
            userId: userId,
            currency: "usd",
            txnId: savedBooking.txnId,
            amountPaid: amount || pricing.totals.totalRenterPayment,
            sessionId: session.id,
            totalAmount: pricing.totals.totalRenterPayment,
            partialPayments: [{
              amount: 0,
              method: "Card",
              status: "pending"
            }],
            paymentStatus: "pending",
            ownerPayoutDetails: {
              payoutAmount: pricing.totals.totalPayout,
              payoutCurrency: "USD",
              exchangeRate: exchangeRate
            },
            status: "pending"
          });
          _context.next = 20;
          return regeneratorRuntime.awrap(newPayment.save());

        case 20:
          savedPayment = _context.sent;
          res.status(201).json({
            url: session.url
          });
          _context.next = 25;
          break;

        case 24:
          res.status(400).json({
            error: "try again"
          });

        case 25:
          _context.next = 31;
          break;

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          console.error("Error creating booking:", _context.t0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

var updateBooking = function updateBooking(req, res) {
  var bookingId, status, updatedBooking;
  return regeneratorRuntime.async(function updateBooking$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          bookingId = req.params.bookingId; // Booking ID

          status = req.body.status; // New status

          _context2.prev = 2;

          if (["pending", "confirmed", "completed", "cancelled"].includes(status)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Invalid booking status"
          }));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(bookingModel.findByIdAndUpdate({
            _id: bookingId
          }, {
            status: status
          }, {
            "new": true
          } // Return the updated document
          ));

        case 7:
          updatedBooking = _context2.sent;

          if (updatedBooking) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Booking not found"
          }));

        case 10:
          res.status(200).json({
            message: "Booking status updated successfully",
            booking: updatedBooking
          });
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](2);
          console.error("Error updating booking status:", _context2.t0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 13]]);
};

var addBookingsController = function addBookingsController(req, res, next) {
  var BookingDetails, booking;
  return regeneratorRuntime.async(function addBookingsController$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          BookingDetails = req.body;
          _context3.next = 4;
          return regeneratorRuntime.awrap(saveBookingData(BookingDetails));

        case 4:
          booking = _context3.sent;
          res.status(200).send({
            status: "success",
            booking: booking
          });
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          next(_context3.t0);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getBookingsController = function getBookingsController(req, res) {
  var boatId, bookings;
  return regeneratorRuntime.async(function getBookingsController$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          boatId = req.params;
          _context4.next = 4;
          return regeneratorRuntime.awrap(getBoatBookings(boatId));

        case 4:
          bookings = _context4.sent;
          res.status(200).send({
            status: "success",
            bookings: bookings
          });
          _context4.next = 12;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          throw _context4.t0;

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getOwnerBookingsController = function getOwnerBookingsController(req, res) {
  var ownerId, boatId, bookings;
  return regeneratorRuntime.async(function getOwnerBookingsController$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          ownerId = req.userId;
          boatId = req.params.boatId;
          _context5.next = 5;
          return regeneratorRuntime.awrap(getOwnerBookings(ownerId, boatId));

        case 5:
          bookings = _context5.sent;
          res.status(200).send(bookings);
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getBookingDeatilsController = function getBookingDeatilsController(req, res, next) {
  var bookingId, booking;
  return regeneratorRuntime.async(function getBookingDeatilsController$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          bookingId = req.params.bookingId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(getBookingDetails(bookingId));

        case 4:
          booking = _context6.sent;
          res.status(200).send({
            status: "success",
            booking: booking
          });
          _context6.next = 11;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var editBookingController = function editBookingController(req, res) {
  var bookingId, list;
  return regeneratorRuntime.async(function editBookingController$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          bookingId = req.params.bookingId;
          _context7.prev = 1;
          _context7.next = 4;
          return regeneratorRuntime.awrap(editBookingData(bookingId, req.body));

        case 4:
          list = _context7.sent;
          res.status(200).send({
            message: "booking updated successfully"
          });
          _context7.next = 11;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](1);
          console.log(_context7.t0);

        case 11:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var getBookingDeatilsBySessionId = function getBookingDeatilsBySessionId(req, res) {
  var session_id, bookingDetails;
  return regeneratorRuntime.async(function getBookingDeatilsBySessionId$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          session_id = req.query.session_id;
          console.log(session_id);
          _context8.prev = 2;
          _context8.next = 5;
          return regeneratorRuntime.awrap(getSessionDetails(session_id));

        case 5:
          bookingDetails = _context8.sent;
          res.status(200).send(bookingDetails);
          _context8.next = 12;
          break;

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](2);
          console.log(_context8.t0);

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

var deleteBookingController = function deleteBookingController(req, res) {
  var bookingId, booking;
  return regeneratorRuntime.async(function deleteBookingController$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          bookingId = req.params.bookingId;
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap(deleteBookingData(bookingId));

        case 4:
          booking = _context9.sent;
          res.status(200).send({
            message: "booking deleted successfully",
            booking: booking
          });
          _context9.next = 11;
          break;

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](1);
          console.log(_context9.t0);

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // const getAllBookings = async (req, res) => {
//   try {
//     const { page = 1, limit = 5, sort = "createdAt", order = "desc", status, userId, yachtId, startDate, endDate } = req.query;
//     const filters = {};
//     // ✅ Filter by Status
//     if (status) filters.status = status;
//     // ✅ Filter by User (User ID)
//     if (userId) filters.userId = userId;
//     // ✅ Filter by Yacht (Yacht ID)
//     if (yachtId) filters.yachtId = yachtId;
//     // ✅ Filter by Date Range (Start Date - End Date)
//     if (startDate && endDate) {
//       filters.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     }
//     // ✅ Fetch Paginated Data
//     const bookings = await bookingModel.find(filters)
//       .sort({ [sort]: order === "desc" ? -1 : 1 }) // ✅ Sorting (default: newest first)
//       .skip((page - 1) * limit) // ✅ Pagination
//       .limit(parseInt(limit))
//       .populate("userId", "name email") // ✅ Populate User Info
//       .populate("yachtId", "title location") // ✅ Populate Yacht Info
//       .populate("paymentId", "txnId")
//       .lean();
//       const formattedBookings = bookings.map((booking) => ({
//         id: booking.bookingRef,
//         user: booking.userId.name,
//         yacht: booking.yachtId.title,
//         status: booking.status,
//         amount: booking.pricing.totals.totalRenterPayment || "N/A",
//         txnId: booking.paymentId?.txnId || booking.txnId, // ✅ If no payment yet, show "Pending"
//         createdAt: booking.createdAt.toISOString().split("T")[0], // ✅ Format Date (YYYY-MM-DD)
//       }));
//     // ✅ Get Total Count for Pagination
//     const total = await bookingModel.countDocuments(filters);
//     res.status(200).json({
//       total,
//       page: parseInt(page),
//       totalPages: Math.ceil(total / limit),
//       limit: parseInt(limit),
//       data: formattedBookings,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching bookings:", error);
//     res.status(500).json({ message: "Failed to fetch bookings" });
//   }
// };


module.exports = {
  getAllBookings: getAllBookings,
  addBooking: addBooking,
  updateBooking: updateBooking,
  addBookingsController: addBookingsController,
  getBookingsController: getBookingsController,
  getOwnerBookingsController: getOwnerBookingsController,
  getBookingDeatilsController: getBookingDeatilsController,
  editBookingController: editBookingController,
  deleteBookingController: deleteBookingController,
  getBookingDeatilsBySessionId: getBookingDeatilsBySessionId
};