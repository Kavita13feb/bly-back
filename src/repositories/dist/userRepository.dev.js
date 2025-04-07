"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('../config/firebase'),
    firestore = _require.firestore;

var UserModel = require('../models/userModel');

var BookingModel = require('../models/bookingModel'); // Fetch user role from Firestore


var storeUserDeatils = function storeUserDeatils(user) {
  var storedUser;
  return regeneratorRuntime.async(function storeUserDeatils$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(UserModel(user));

        case 3:
          storedUser = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(storedUser.save());

        case 6:
          return _context.abrupt("return", storedUser);

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          throw new Error("Error fetching user role: ".concat(_context.t0.message));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getUserById = function getUserById(userId) {
  var totalUserBookings, user;
  return regeneratorRuntime.async(function getUserById$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(BookingModel.countDocuments({
            userId: userId
          }));

        case 3:
          totalUserBookings = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(UserModel.findById(userId).select("-password").lean());

        case 6:
          user = _context2.sent;
          return _context2.abrupt("return", _objectSpread({}, user, {
            totalBookings: totalUserBookings
          }));

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('Error getting user by ID:', _context2.t0);
          throw _context2.t0;

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getUserByEmail = function getUserByEmail(email) {
  return regeneratorRuntime.async(function getUserByEmail$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: email
          }).select('-password'));

        case 3:
          return _context3.abrupt("return", _context3.sent);

        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](0);
          console.error('Error getting user by ID:', _context3.t0);
          throw _context3.t0;

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

var updateUserById = function updateUserById(userId, updatedData) {
  return regeneratorRuntime.async(function updateUserById$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, updatedData, {
            "new": true
          }).select('-password'));

        case 3:
          return _context4.abrupt("return", _context4.sent);

        case 6:
          _context4.prev = 6;
          _context4.t0 = _context4["catch"](0);
          console.error('Error updating user by ID:', _context4.t0);
          throw _context4.t0;

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

module.exports = {
  storeUserDeatils: storeUserDeatils,
  getUserById: getUserById,
  updateUserById: updateUserById,
  getUserByEmail: getUserByEmail
};