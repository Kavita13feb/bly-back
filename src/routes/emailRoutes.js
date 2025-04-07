const express = require("express");
const { sendVerification, contactUs } = require("../controllers/emailController");


const emailRouter = express.Router();

// ✅ Route for sending email verification
emailRouter.post("/send-verification", sendVerification);

// ✅ Route for sending contact form email
emailRouter.post("/contact-us", contactUs);

module.exports = emailRouter;
