"use strict";

var _require = require("../services/emailService"),
    sendVerificationEmail = _require.sendVerificationEmail,
    sendContactEmail = _require.sendContactEmail;

exports.sendVerification = function _callee(req, res) {
  var _req$body, email, userId, response;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, email = _req$body.email, userId = _req$body.userId;
          _context.next = 4;
          return regeneratorRuntime.awrap(sendVerificationEmail(email, userId));

        case 4:
          response = _context.sent;

          if (response.success) {
            res.status(200).json({
              message: response.message
            });
          } else {
            res.status(500).json({
              message: response.message,
              error: response.error
            });
          }

          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Error sending verification email",
            error: _context.t0
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.contactUs = function _callee2(req, res) {
  var _req$body2, name, email, message, response;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, message = _req$body2.message;
          _context2.next = 4;
          return regeneratorRuntime.awrap(sendContactEmail(name, email, message));

        case 4:
          response = _context2.sent;

          if (response.success) {
            res.status(200).json({
              message: response.message
            });
          } else {
            res.status(500).json({
              message: response.message,
              error: response.error
            });
          }

          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Error sending contact form email",
            error: _context2.t0
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};