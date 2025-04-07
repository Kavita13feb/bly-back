"use strict";

// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const msg = {
//   to: 'kavitamali0515@gmail.com', // Change to your recipient
//   from: 'kavita@bookluxuryyacht.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })
var sgMail = require("../config/sendgrid");

var jwt = require("jsonwebtoken"); // ✅ Generate Email Verification Token


var generateVerificationToken = function generateVerificationToken(userId) {
  return jwt.sign({
    userId: userId
  }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
}; // ✅ Send Email Function (Reusable for Different Email Types)


var sendEmail = function sendEmail(to, email, subject, htmlContent) {
  var msg;
  return regeneratorRuntime.async(function sendEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          msg = {
            to: to,
            from: process.env.EMAIL_FROM,
            // Must be the verified sender email
            replyTo: email,
            subject: subject,
            html: htmlContent
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(sgMail.send(msg));

        case 4:
          console.log(msg);
          return _context.abrupt("return", {
            success: true,
            message: "Email sent successfully"
          });

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Error sending email:", _context.t0);
          return _context.abrupt("return", {
            success: false,
            message: "Error sending email",
            error: _context.t0
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // ✅ Send Email Verification


var sendVerificationEmail = function sendVerificationEmail(email, userId) {
  var verificationToken, verificationUrl, htmlContent;
  return regeneratorRuntime.async(function sendVerificationEmail$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          verificationToken = generateVerificationToken(userId);
          verificationUrl = "".concat(process.env.FRONTEND_URL, "/verify?token=").concat(verificationToken);
          htmlContent = "<p>Click <a href=\"".concat(verificationUrl, "\">here</a> to verify your email.</p>");
          _context2.next = 5;
          return regeneratorRuntime.awrap(sendEmail(email, "Verify Your Email", htmlContent));

        case 5:
          return _context2.abrupt("return", _context2.sent);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // ✅ Send Contact Form Email


var sendContactEmail = function sendContactEmail(name, email, message) {
  var htmlContent;
  return regeneratorRuntime.async(function sendContactEmail$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          htmlContent = "\n    <p><strong>Name:</strong> ".concat(name, "</p>\n    <p><strong>Email:</strong> ").concat(email, "</p>\n    <p><strong>Message:</strong> ").concat(message, "</p>\n  ");
          _context3.next = 3;
          return regeneratorRuntime.awrap(sendEmail(process.env.CONTACT_EMAIL, email, "New Contact Form Submission", htmlContent));

        case 3:
          return _context3.abrupt("return", _context3.sent);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = {
  sendVerificationEmail: sendVerificationEmail,
  sendContactEmail: sendContactEmail
};