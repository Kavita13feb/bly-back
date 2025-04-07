"use strict";

var express = require('express');

var app = express();

var authRouter = require('./routes/authRoutes');

var connection = require("./config/db");

var boatOwnerRouter = require('./routes/boatOwnerRoutes');

var authenticate = require('./middlewares/authenticate');

var boatRouter = require('./routes/boatRoutes');

var errorHandler = require('./middlewares/errorHandler');

var userRouter = require('./routes/userRouter');

var reviewRouter = require('./routes/reviewRoutes');

var availabilityRouter = require('./routes/availabilityRoute');

var bookingRouter = require('./routes/bookingRoutes');

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

require('dotenv').config();

var cors = require("cors");

var ImageRouter = require('./routes/ImagesRoutes');

var _require = require('./services/locationService'),
    fetchLocations = _require.fetchLocations;

var CategoryRouter = require('./routes/CategoryRoute');

var featuresRouter = require('./routes/featuresRouter');

var InstaBookRouter = require('./routes/InstaBookRoutes');

var StripeRouter = require('./routes/StripeRoutes');

var adminRouter = require('./routes/adminRoutes');

var wishListRouter = require('./routes/whishListRoutes');

var faqRouter = require('./routes/faqRoutes');

var emailRouter = require('./routes/emailRoutes');

var VisitorRouter = require('./routes/visitorRoutes');

var payoutRouter = require('./routes/payoutRoutes');

var transactionRouter = require('./routes/transactionRoutes');

var settingRouter = require('./routes/settingsRoutes');

var destinationRouter = require('./routes/destinastionRoute');

var yachtTypeRouter = require('./routes/yachtTypeRoute');

var webhookRouter = require('./routes/webhookRouter');

var corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', "PATCH"],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use("/webhook", webhookRouter);
app.use(express.json());
app.use('/auth', authRouter);
app.use('/boatOwners', boatOwnerRouter);
app.use('/boats', boatRouter);
app.use('/users', userRouter);
app.use('/reviews', reviewRouter);
app.use('/availability', availabilityRouter);
app.use('/bookings', bookingRouter);
app.use('/images', ImageRouter);
app.use('/features', featuresRouter);
app.use("/instabook", InstaBookRouter); // app.use("/owner", blockedAvailabilityRouter);

app.use("/wishlist", wishListRouter);
app.use("/admin", adminRouter);
app.use("/email", emailRouter);
app.use('/visitors', VisitorRouter);
app.use("/payouts", payoutRouter);
app.use("/transactions", transactionRouter);
app.use("/faqs", faqRouter);
app.use("/settings", settingRouter);
app.use("/destinations", destinationRouter);
app.use("/yachtTypes", yachtTypeRouter);
app.use("/locations", function _callee(req, res) {
  var locationQuery;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          locationQuery = req.query.locationQuery;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(fetchLocations(locationQuery));

        case 4:
          locations = _context.sent;
          res.status(200).send(locations);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);
          res.status(400).send(_context.t0);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
app.get("/test-stripe", function _callee2(req, res) {
  var balance;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(stripe.balance.retrieve());

        case 3:
          balance = _context2.sent;
          res.status(200).json(balance);
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error("Stripe API Error:", _context2.t0);
          res.status(500).json({
            error: "Failed to connect to Stripe"
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
app.use('/categories', CategoryRouter); // app.use(errorHandler)
// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   let event = request.body;
//   // Only verify the event if you have an endpoint secret defined.
//   // Otherwise use the basic event deserialized with JSON.parse
//   const stripe = require('stripe')('sk_test_51QestwIrVeAE1EIBBRNGHr2HFevUxBUjoDR3zr0zKWpyEWeF3HEGlMbOosmzErZ8UuYtsSa978R7DAC44og2jPYQ00z3LWaNFc');
// const endpointSecret = 'whsec_RapUnuFU8SdsMCc0TDw61zjfPVt9iLUf';
//   if (endpointSecret) {
//   console.log(endpointSecret);
//     // Get the signature sent by Stripe
//     const signature = request.headers['stripe-signature'];
//     try {
//       event = stripe.webhooks.constructEvent(
//         request.body,
//         signature,
//         endpointSecret
//       );
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`, err);
//       return response.sendStatus(400);
//     }
//   }
//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }
//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

var PORT = process.env.PORT || 8080;
app.listen(PORT, function _callee3() {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(connection);

        case 3:
          console.log("Server connected to db");
          _context3.next = 9;
          break;

        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 9:
          console.log("Server is running on port ".concat(PORT));

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 6]]);
});