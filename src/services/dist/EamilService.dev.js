"use strict";

var sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var msg = {
  to: 'kavitamali0515@gmail.com',
  // Change to your recipient
  from: 'kavita@bookluxuryyacht.com',
  // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>'
};
sgMail.send(msg).then(function () {
  console.log('Email sent');
})["catch"](function (error) {
  console.error(error);
});