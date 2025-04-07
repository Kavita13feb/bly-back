"use strict";

var UserModel = require("../models/userModel");

var _require = require("../repositories/userRepository"),
    getUserById = _require.getUserById,
    updateUserById = _require.updateUserById;

var getUserProfile = function getUserProfile(req, res) {
  var userId, user;
  return regeneratorRuntime.async(function getUserProfile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.params.userId;
          console.log(req.userId, userId);

          if (!(req.userId.toString() !== userId.toString())) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            status: "failed",
            message: 'Not Authorised'
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(getUserById(userId));

        case 7:
          user = _context.sent;

          if (user) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            status: "failed",
            message: 'User not found'
          }));

        case 10:
          res.status(200).json({
            status: "success",
            data: user
          });
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error('Error retrieving user profile:', _context.t0);
          res.status(500).json({
            status: "failed",
            message: 'Server error'
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var updateUserProfile = function updateUserProfile(req, res) {
  var userId, updatedData, updatedUser;
  return regeneratorRuntime.async(function updateUserProfile$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.params.userId;
          updatedData = req.body; // Ensure the user has permission to update this profile

          if (!(req.userId.toString() !== userId.toString())) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(403).json({
            status: "failed",
            message: 'Not Authorised'
          }));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(updateUserById(userId, updatedData));

        case 7:
          updatedUser = _context2.sent;

          if (updatedUser) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            status: "failed",
            message: 'User not found'
          }));

        case 10:
          res.status(200).json({
            status: "success",
            data: updatedUser
          });
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error('Error updating user profile:', _context2.t0);
          res.status(500).json({
            status: "failed",
            message: 'Server error'
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var getAllUsers = function getAllUsers(req, res) {
  var users;
  return regeneratorRuntime.async(function getAllUsers$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(UserModel.find());

        case 3:
          users = _context3.sent;
          res.status(200).json({
            success: true,
            users: users
          });
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: "Failed to fetch users"
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var updateUserRole = function updateUserRole(req, res) {
  var role, updatedUser;
  return regeneratorRuntime.async(function updateUserRole$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          role = req.body.role;
          _context4.next = 4;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(req.params.id, {
            role: role
          }, {
            "new": true
          }));

        case 4:
          updatedUser = _context4.sent;

          if (updatedUser) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 7:
          res.status(200).json({
            success: true,
            message: "User role updated",
            user: updatedUser
          });
          _context4.next = 13;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: "Error updating user role"
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  getAllUsers: getAllUsers,
  updateUserRole: updateUserRole,
  getUserProfile: getUserProfile,
  updateUserProfile: updateUserProfile
};