"use strict";

var express = require("express");

var _require = require("../controllers/emailController"),
    sendVerification = _require.sendVerification,
    contactUs = _require.contactUs;

var emailRouter = express.Router(); // ✅ Route for sending email verification

emailRouter.post("/send-verification", sendVerification); // ✅ Route for sending contact form email

emailRouter.post("/contact-us", contactUs);
module.exports = emailRouter;