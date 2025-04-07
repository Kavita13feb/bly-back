"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BoatOwnerModel = require("../models/boatOwnerModel");

var UserModel = require("../models/userModel");

var CustomError = require("../utils/customError");

var saveboatOwnerDeatils = function saveboatOwnerDeatils(userId, userrole, boatOwner) {
  var storedboatOwner;
  return regeneratorRuntime.async(function saveboatOwnerDeatils$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (!(userrole == "b")) {
            _context.next = 3;
            break;
          }

          throw new CustomError("Registration failed: User is already registered as a boat owner", 400);

        case 3:
          console.log(userId);
          _context.next = 6;
          return regeneratorRuntime.awrap(BoatOwnerModel(_objectSpread({}, boatOwner, {
            userId: userId
          })));

        case 6:
          storedboatOwner = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(storedboatOwner.save());

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(userId, {
            role: "b"
          }));

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(UserModel.findOne(userId));

        case 13:
          user = _context.sent;
          return _context.abrupt("return", {
            status: "success",
            message: "Registration successful as yacht owner",
            user: user
          });

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0); //  throw new CustomError('Login failed: Invalid credentials.', 401);

          throw _context.t0;

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

var getboatOwnerDeatils = function getboatOwnerDeatils(ownerId) {
  var boatOwner;
  return regeneratorRuntime.async(function getboatOwnerDeatils$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            _id: ownerId
          }));

        case 3:
          boatOwner = _context2.sent;
          return _context2.abrupt("return", boatOwner);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          throw _context2.t0;

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var updateboatOwnerDeatils = function updateboatOwnerDeatils(ownerId, userId, details) {
  var updatedData, boatOwner;
  return regeneratorRuntime.async(function updateboatOwnerDeatils$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log(details);
          updatedData = {
            businessLocation: {
              "country": "USA",
              "state": "Floridaj",
              "city": "miami",
              "town": "",
              "revenue": "0"
            },
            "name": "rebal",
            "email": "jo@gmail.com",
            "boats": [],
            "Status": "Active",
            "revenue": 19521
          };
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(BoatOwnerModel.findByIdAndUpdate(ownerId, details));

        case 5:
          boatOwner = _context3.sent;
          return _context3.abrupt("return", boatOwner);

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](2);
          throw _context3.t0;

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

module.exports = {
  saveboatOwnerDeatils: saveboatOwnerDeatils,
  getboatOwnerDeatils: getboatOwnerDeatils,
  updateboatOwnerDeatils: updateboatOwnerDeatils
};