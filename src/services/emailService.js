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


  const sgMail = require("../config/sendgrid");
const jwt = require("jsonwebtoken");

// ✅ Generate Email Verification Token
const generateVerificationToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ✅ Send Email Function (Reusable for Different Email Types)
const sendEmail = async (to,  email, subject, htmlContent) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM, // Must be the verified sender email
      replyTo: email,
      subject,
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log(msg)
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error sending email", error };
  }
};

// ✅ Send Email Verification
const sendVerificationEmail = async (email, userId) => {
  const verificationToken = generateVerificationToken(userId);
  const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;

  const htmlContent = `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`;

  return await sendEmail(email, "Verify Your Email", htmlContent);
};

// ✅ Send Contact Form Email
const sendContactEmail = async (name, email, message) => {
  const htmlContent = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong> ${message}</p>
  `;

  return await sendEmail(process.env.CONTACT_EMAIL,email, "New Contact Form Submission", htmlContent);
};

module.exports = {
  sendVerificationEmail,
  sendContactEmail,
};
