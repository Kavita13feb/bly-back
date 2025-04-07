const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const bookingModel = require("../models/bookingModel");
const PaymentModel = require("../models/PaymentModel"); 

const webhookRouter = express.Router();

// Stripe webhook secret
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// webhookRouter.post(
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


webhookRouter.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret); 
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`✅ Event received: ${event.type}`);
console.log("event",event)
  const session = event.data.object;
  const paymentIntentId = session.payment_intent;
  const sessionId = session.id;

  try {
    let booking, payment;

    switch (event.type) {

      case 'checkout.session.completed':
        console.log('✅ Checkout Session Completed!');

        // Retrieve paymentIntentId if available
        if (session.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

          payment = await PaymentModel.findOne({ sessionId: sessionId });
          if (!payment) {
            console.error(`Payment with sessionId ${sessionId} not found.`);
            return res.status(404).send('Payment not found');
          }

          booking = await bookingModel.findById(payment.bookingId);
          if (!booking) {
            console.error(`Booking with ID ${payment.bookingId} not found.`);
            return res.status(404).send('Booking not found');
          }

          payment.paymentStatus = paymentIntent.status === 'succeeded' ? 'completed' : 'pending';
          payment.paymentIntentId = paymentIntent.id;
          payment.status = paymentIntent.status === 'succeeded' ? 'completed' : 'pending';
          await payment.save();

          booking.status = paymentIntent.status === 'succeeded' ? 'confirmed' : 'pending';
          booking.paymentStatus = paymentIntent.status === 'succeeded' ? 'completed' : 'pending';
          await booking.save();

          console.log(`✅ Booking ${booking._id} and Payment ${payment._id} marked as ${payment.status}.`);
        }
        break;

      case 'payment_intent.succeeded':
        console.log('✅ Payment was successful!', paymentIntentId);

        payment = await PaymentModel.findOne({ paymentIntentId });
        if (!payment) {
          console.error(`Payment with paymentIntentId ${paymentIntentId} not found.`);
          return res.status(404).send('Payment not found');
        }

        booking = await bookingModel.findById(payment.bookingId);
        if (!booking) {
          console.error(`Booking with ID ${payment.bookingId} not found.`);
          return res.status(404).send('Booking not found');
        }

        payment.paymentStatus = 'completed';
        payment.status = 'completed';
        await payment.save();

        booking.status = 'confirmed';
        await booking.save();

        console.log(`✅ Booking ${booking._id} and Payment ${payment._id} marked as completed.`);
        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed!');

        payment = await PaymentModel.findOne({ paymentIntentId });
        if (!payment) {
          console.error(`Payment with paymentIntentId ${paymentIntentId} not found.`);
          return res.status(404).send('Payment not found');
        }

        payment.paymentStatus = 'failed';
        payment.status = 'failed';
        payment.failureMessage = event.data.last_payment_error ? event.data.last_payment_error.message : 'Unknown error';
        await payment.save();

        console.log(`❌ Payment ${payment._id} marked as failed.`);
        break;

      case 'payment_intent.requires_action':
        console.log('⚠️ Payment requires additional action! User must authenticate.');

        payment = await PaymentModel.findOne({ paymentIntentId });
        if (payment) {
          payment.paymentStatus = 'requires_action';
          payment.status = 'pending';
          await payment.save();
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error(`Error handling webhook event: ${error.message}`);
    res.status(500).send(`Webhook handling error: ${error.message}`);
  }
});

module.exports = webhookRouter;

