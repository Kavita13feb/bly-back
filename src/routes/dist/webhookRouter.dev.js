"use strict";

var express = require("express");

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

var bodyParser = require("body-parser");

var bookingModel = require("../models/bookingModel");

var PaymentModel = require("../models/PaymentModel");

var webhookRouter = express.Router(); // Stripe webhook secret

var endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // webhookRouter.post(
//   "/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event;
//     try {
//       // Verify Stripe's webhook signature
//       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err) {
//       console.error("Webhook signature verification failed:", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }
//     console.log("event",event);
//     // Handle the event type
//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object;
//         try {
//           const bookingId = session.metadata.bookingId;
//           // Update booking status to confirmed
//           await bookingModel.findByIdAndUpdate(bookingId, {
//             status: "confirmed",
//             paymentId: session.id,
//             txnId:paymentIntent.charges.data[0].balance_transaction
//           });
//           console.log("Booking and payment updated successfully!");
//           // Create payment record
//           await Payment.create({
//             sessionId: session.id,
//             bookingId: bookingId,
//             amount: session.amount_total / 100,
//             currency: session.currency,
//             paymentStatus: session.payment_status,
//             customerEmail: session.customer_details.email,
//           });
//           console.log("Booking and payment updated successfully!");
//         } catch (err) {
//           console.error("Error updating booking or payment:", err);
//         }
//         break;
//       }
//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }
//     // Respond to Stripe
//     res.status(200).send("Webhook received");
//   }
// );

webhookRouter.post('/', express.raw({
  type: 'application/json'
}), function _callee(req, res) {
  var sig, event, session, paymentIntentId, sessionId, booking, payment, paymentIntent;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          sig = req.headers['stripe-signature'];
          _context.prev = 1;
          event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
          _context.next = 9;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](1);
          console.error("\u26A0\uFE0F Webhook signature verification failed: ".concat(_context.t0.message));
          return _context.abrupt("return", res.status(400).send("Webhook Error: ".concat(_context.t0.message)));

        case 9:
          console.log("\u2705 Event received: ".concat(event.type));
          console.log("event", event);
          session = event.data.object;
          paymentIntentId = session.payment_intent;
          sessionId = session.id;
          _context.prev = 14;
          _context.t1 = event.type;
          _context.next = _context.t1 === 'checkout.session.completed' ? 18 : _context.t1 === 'payment_intent.succeeded' ? 46 : _context.t1 === 'payment_intent.payment_failed' ? 68 : _context.t1 === 'payment_intent.requires_action' ? 82 : 92;
          break;

        case 18:
          console.log('✅ Checkout Session Completed!'); // Retrieve paymentIntentId if available

          if (!session.payment_intent) {
            _context.next = 45;
            break;
          }

          _context.next = 22;
          return regeneratorRuntime.awrap(stripe.paymentIntents.retrieve(session.payment_intent));

        case 22:
          paymentIntent = _context.sent;
          _context.next = 25;
          return regeneratorRuntime.awrap(PaymentModel.findOne({
            sessionId: sessionId
          }));

        case 25:
          payment = _context.sent;

          if (payment) {
            _context.next = 29;
            break;
          }

          console.error("Payment with sessionId ".concat(sessionId, " not found."));
          return _context.abrupt("return", res.status(404).send('Payment not found'));

        case 29:
          _context.next = 31;
          return regeneratorRuntime.awrap(bookingModel.findById(payment.bookingId));

        case 31:
          booking = _context.sent;

          if (booking) {
            _context.next = 35;
            break;
          }

          console.error("Booking with ID ".concat(payment.bookingId, " not found."));
          return _context.abrupt("return", res.status(404).send('Booking not found'));

        case 35:
          payment.paymentStatus = paymentIntent.status === 'succeeded' ? 'completed' : 'pending';
          payment.paymentIntentId = paymentIntent.id;
          payment.status = paymentIntent.status === 'succeeded' ? 'completed' : 'pending';
          _context.next = 40;
          return regeneratorRuntime.awrap(payment.save());

        case 40:
          booking.status = paymentIntent.status === 'succeeded' ? 'confirmed' : 'pending';
          booking.paymentStatus = paymentIntent.status === 'succeeded' ? 'completed' : 'pending';
          _context.next = 44;
          return regeneratorRuntime.awrap(booking.save());

        case 44:
          console.log("\u2705 Booking ".concat(booking._id, " and Payment ").concat(payment._id, " marked as ").concat(payment.status, "."));

        case 45:
          return _context.abrupt("break", 93);

        case 46:
          console.log('✅ Payment was successful!', paymentIntentId);
          _context.next = 49;
          return regeneratorRuntime.awrap(PaymentModel.findOne({
            paymentIntentId: paymentIntentId
          }));

        case 49:
          payment = _context.sent;

          if (payment) {
            _context.next = 53;
            break;
          }

          console.error("Payment with paymentIntentId ".concat(paymentIntentId, " not found."));
          return _context.abrupt("return", res.status(404).send('Payment not found'));

        case 53:
          _context.next = 55;
          return regeneratorRuntime.awrap(bookingModel.findById(payment.bookingId));

        case 55:
          booking = _context.sent;

          if (booking) {
            _context.next = 59;
            break;
          }

          console.error("Booking with ID ".concat(payment.bookingId, " not found."));
          return _context.abrupt("return", res.status(404).send('Booking not found'));

        case 59:
          payment.paymentStatus = 'completed';
          payment.status = 'completed';
          _context.next = 63;
          return regeneratorRuntime.awrap(payment.save());

        case 63:
          booking.status = 'confirmed';
          _context.next = 66;
          return regeneratorRuntime.awrap(booking.save());

        case 66:
          console.log("\u2705 Booking ".concat(booking._id, " and Payment ").concat(payment._id, " marked as completed."));
          return _context.abrupt("break", 93);

        case 68:
          console.log('❌ Payment failed!');
          _context.next = 71;
          return regeneratorRuntime.awrap(PaymentModel.findOne({
            paymentIntentId: paymentIntentId
          }));

        case 71:
          payment = _context.sent;

          if (payment) {
            _context.next = 75;
            break;
          }

          console.error("Payment with paymentIntentId ".concat(paymentIntentId, " not found."));
          return _context.abrupt("return", res.status(404).send('Payment not found'));

        case 75:
          payment.paymentStatus = 'failed';
          payment.status = 'failed';
          payment.failureMessage = event.data.last_payment_error ? event.data.last_payment_error.message : 'Unknown error';
          _context.next = 80;
          return regeneratorRuntime.awrap(payment.save());

        case 80:
          console.log("\u274C Payment ".concat(payment._id, " marked as failed."));
          return _context.abrupt("break", 93);

        case 82:
          console.log('⚠️ Payment requires additional action! User must authenticate.');
          _context.next = 85;
          return regeneratorRuntime.awrap(PaymentModel.findOne({
            paymentIntentId: paymentIntentId
          }));

        case 85:
          payment = _context.sent;

          if (!payment) {
            _context.next = 91;
            break;
          }

          payment.paymentStatus = 'requires_action';
          payment.status = 'pending';
          _context.next = 91;
          return regeneratorRuntime.awrap(payment.save());

        case 91:
          return _context.abrupt("break", 93);

        case 92:
          console.log("Unhandled event type ".concat(event.type));

        case 93:
          res.status(200).json({
            received: true
          });
          _context.next = 100;
          break;

        case 96:
          _context.prev = 96;
          _context.t2 = _context["catch"](14);
          console.error("Error handling webhook event: ".concat(_context.t2.message));
          res.status(500).send("Webhook handling error: ".concat(_context.t2.message));

        case 100:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 5], [14, 96]]);
});
module.exports = webhookRouter;