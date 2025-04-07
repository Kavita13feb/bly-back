"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var UserModel = require("../models/userModel");

var admin = require("../config/firebaseAdmin");

var functions = require("firebase-functions"); // const SupportTicket = require("../models/SupportTicket");


var bookingModel = require("../models/bookingModel");

var BoatModel = require("../models/boatModel");

var BoatOwnerModel = require("../models/boatOwnerModel");

var SupportTicketModel = require("../models/SupportTicketModel");

var NodeCache = require("node-cache");

var cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 320
}); // Cache for 5 minutes
// const registerAdmin = async (req, res) => {
//   const { email, password, name } = req.body;
//   if (!email || !password || !name) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   try {
//     // Check if the user already exists in MongoDB
//     const existingUser = await UserModel.findOne({email});
//     console.log(existingUser)
//     if (existingUser) {
//         return res.status(400).json({
//           message: `This email is already registered as a ${existingUser.role}.`,
//         });
//     }
//     // Create the admin in Firebase Authentication
//     const userRecord = await admin.auth().createUser({
//       email,
//       password,
//       name,
//     });
// console.log(userRecord)
//     // Save the admin details in MongoDB
//     const adminData = {
//       uid: userRecord.uid, // Firebase UID
//       email: userRecord.email,
//       name: userRecord.displayName,
//       role: "a", // Role set to admin
//     };
//     const newAdmin = new UserModel(adminData); // Create a new instance
//     await newAdmin.save();
//     res
//       .status(201)
//       .json({ message: "Admin registered successfully", admin: adminData });
//   } catch (error) {
//     console.error("Error creating admin:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

var registerAdmin = functions.https.onRequest(function _callee(req, res) {
  var _req$body, email, password, name, userRecord, existingUser, adminData;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password, name = _req$body.name; // Validate input

          if (!(!email || !password || !name)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "All fields are required."
          }));

        case 3:
          userRecord = null;
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: email
          }));

        case 7:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "This email is already registered."
          }));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(admin.auth().createUser({
            email: email,
            password: password,
            displayName: name
          }));

        case 12:
          userRecord = _context.sent;
          adminData = {
            uid: userRecord.uid,
            // Firebase UID
            email: userRecord.email,
            name: userRecord.displayName,
            role: "a" // Set role to admin

          };
          _context.next = 16;
          return regeneratorRuntime.awrap(UserModel.create(adminData));

        case 16:
          // Step 4: Respond with success if both Firebase and MongoDB succeed
          res.status(201).json({
            message: "Admin registered successfully",
            admin: adminData
          });
          _context.next = 33;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](4);
          console.error("Error during admin registration:", _context.t0); // Step 5: Rollback Firebase user creation if MongoDB operation fails

          if (!(userRecord && userRecord.uid)) {
            _context.next = 32;
            break;
          }

          _context.prev = 23;
          _context.next = 26;
          return regeneratorRuntime.awrap(admin.auth().deleteUser(userRecord.uid));

        case 26:
          // Delete Firebase user
          console.log("Firebase user rollback successful.");
          _context.next = 32;
          break;

        case 29:
          _context.prev = 29;
          _context.t1 = _context["catch"](23);
          console.error("Error during Firebase user rollback:", _context.t1);

        case 32:
          res.status(500).json({
            message: "Internal server error",
            error: _context.t0.message
          });

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 19], [23, 29]]);
});

var loginAdmin = function loginAdmin(req, res) {
  var idToken, decodedToken, email, user;
  return regeneratorRuntime.async(function loginAdmin$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          idToken = req.body.idToken;

          if (idToken) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "ID Token is required"
          }));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(admin.auth().verifyIdToken(idToken));

        case 6:
          decodedToken = _context2.sent;
          // Extract the email from the decoded token
          email = decodedToken.email;

          if (email) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Invalid ID Token"
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: email
          }));

        case 12:
          user = _context2.sent;
          console.log(user);

          if (user) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 16:
          if (!(user.role !== "a")) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.status(403).json({
            message: "Access denied: Not an admin"
          }));

        case 18:
          // Step 3: Respond with admin data
          res.status(200).json({
            admin: {
              id: user._id,
              //   uid: user.uid,
              email: user.email,
              name: user.name,
              role: user.role
            },
            token: idToken // Include the Firebase ID token

          });
          _context2.next = 25;
          break;

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](3);
          console.error("Error during admin login:", _context2.t0);
          res.status(500).json({
            message: "Internal server error",
            error: _context2.t0.message
          });

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 21]]);
};

var getAdminDashboardStats = function getAdminDashboardStats(req, res) {
  var cachedData, _ref, _ref2, totalBookings, totalYachtOwners, totalYachts, totalRevenue, recentBookings, pendingYachtApprovals, pendingOwnerApprovals, pendingTickets, resolvedTickets, bookingsTrend, revenueTrend, yachtOwnersTrend, yachtTrends, responseData;

  return regeneratorRuntime.async(function getAdminDashboardStats$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          // **🚀 Check Cache First**
          cachedData = cache.get("dashboardStats");

          if (!cachedData) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(200).json(cachedData));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(Promise.all([bookingModel.countDocuments(), // 🚀 Total Bookings
          UserModel.countDocuments({
            role: "b"
          }), // 🚀 Total Yacht Owners
          BoatModel.countDocuments(), // 🚀 Total Yachts
          bookingModel.aggregate([{
            $group: {
              _id: null,
              revenue: {
                $sum: "$price"
              }
            }
          }]), // 🚀 Total Revenue
          bookingModel.find().sort({
            createdAt: -1
          }).limit(3).select("_id userId yachtId, price createdAt").populate("userId", "name email").populate("yachtId", "title").lean(), // 🚀 Recent 3 Bookings
          BoatModel.find({
            status: "pending_review"
          }).limit(3).select("title ownerId status").populate("ownerId", "name") // ✅ Populate owner details
          .lean(), // 🚀 Pending Yacht Approvals
          BoatOwnerModel.find({
            approvalStatus: "pending"
          }) // ✅ Fetch pending yacht owners
          .limit(3).select("name approvalStatus").lean(), // 🚀 Pending Owner Approvals
          SupportTicketModel.countDocuments({
            status: "Pending"
          }), // 🚀 Pending Support Tickets
          SupportTicketModel.countDocuments({
            status: "Resolved"
          }), // 🚀 Resolved Support Tickets
          // 📈 Trends for the Last 6 Months
          // bookingModel.aggregate([
          //   { $group: { _id: { $month: "$bookingDate" }, count: { $sum: 1 } } },
          //   { $sort: { "_id": 1 } }
          // ]), // 🚀 Bookings Trend (Last 6 Months)
          bookingModel.aggregate([{
            $group: {
              _id: {
                $month: "$createdAt"
              },
              // ✅ Use `createdAt` to track when bookings were made
              count: {
                $sum: 1
              }
            }
          }, {
            $sort: {
              _id: 1
            }
          }]), bookingModel.aggregate([{
            $group: {
              _id: {
                $month: "$startDate"
              },
              // ✅ Use `startDate` to track revenue when yacht is used
              revenue: {
                $sum: "$pricing.totals.totalRenterPayment"
              } // ✅ Sum total payment

            }
          }, {
            $sort: {
              _id: 1
            }
          }]), // bookingModel.aggregate([
          //   { $group: { _id: { $month: "$bookingDate" }, revenue: { $sum: "$price" } } },
          //   { $sort: { "_id": 1 } }
          // ]), // 🚀 Revenue Trend (Last 6 Months)
          UserModel.aggregate([{
            $match: {
              role: "b"
            }
          }, {
            $group: {
              _id: {
                $month: "$createdAt"
              },
              count: {
                $sum: 1
              }
            }
          }, {
            $sort: {
              _id: 1
            }
          }]), // 🚀 Yacht Owners Trend (Last 6 Months)
          BoatModel.aggregate([{
            $group: {
              _id: {
                $month: "$createdAt"
              },
              count: {
                $sum: 1
              }
            }
          }, {
            $sort: {
              _id: 1
            }
          }])]));

        case 6:
          _ref = _context3.sent;
          _ref2 = _slicedToArray(_ref, 13);
          totalBookings = _ref2[0];
          totalYachtOwners = _ref2[1];
          totalYachts = _ref2[2];
          totalRevenue = _ref2[3];
          recentBookings = _ref2[4];
          pendingYachtApprovals = _ref2[5];
          pendingOwnerApprovals = _ref2[6];
          pendingTickets = _ref2[7];
          resolvedTickets = _ref2[8];
          bookingsTrend = _ref2[9];
          revenueTrend = _ref2[10];
          yachtOwnersTrend = _ref2[11];
          yachtTrends = _ref2[12];
          // **🚀 Format Response Efficiently**
          responseData = {
            summary: {
              totalBookings: totalBookings,
              totalYachtOwners: totalYachtOwners,
              totalYachts: totalYachts,
              totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].revenue : 0
            },
            recentBookings: recentBookings.map(function (booking) {
              return {
                customerName: booking.customerName,
                price: booking.price,
                hoursAgo: Math.floor((Date.now() - booking.bookingDate) / (1000 * 60 * 60))
              };
            }),
            pendingYachtApprovals: pendingYachtApprovals,
            pendingOwnerApprovals: pendingOwnerApprovals,
            supportTracker: {
              pendingTickets: pendingTickets,
              resolvedTickets: resolvedTickets
            },
            trends: {
              bookingsTrend: bookingsTrend.map(function (b) {
                return b.count;
              }),
              revenueTrend: revenueTrend.map(function (r) {
                return r.revenue;
              }),
              yachtOwnersTrend: yachtOwnersTrend.map(function (y) {
                return y.count;
              }),
              yachtTrends: yachtTrends.map(function (y) {
                return y.count;
              })
            }
          }; // **🚀 Store Data in Cache**

          cache.set("dashboardStats", responseData);
          res.status(200).json(responseData);
          _context3.next = 29;
          break;

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: "Error fetching dashboard stats",
            error: _context3.t0
          });

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

module.exports = {
  registerAdmin: registerAdmin,
  loginAdmin: loginAdmin,
  getAdminDashboardStats: getAdminDashboardStats
};