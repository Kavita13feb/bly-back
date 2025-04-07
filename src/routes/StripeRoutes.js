const express = require("express");
const { createPaymentIntent, refundPayment, retrievePaymentIntent } = require("../services/stripeService");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const StripeRouter = express.Router();
StripeRouter.post("/create-checkout-session", async (req, res) => {
  const { items, currency } = req.body;
console.log(items)
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: currency || "usd",
          product_data: {
            name: item.yachtId.title,
            description:`\nSubtotal         $${(item. pricing?.totals.totalRenterPayment || 0) }`,
          },
          unit_amount: (item. pricing?.totals.totalRenterPayment || 0) * 100, // Amount in cents
        },
        quantity: item.quantity||1,

        
      })),
     
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/book-now/${items[0].yachtId._id}/${items[0]._id}`,
    });
console.log(session.url)
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

StripeRouter.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;

    // Use the service function
    const paymentIntent = await createPaymentIntent(amount, currency, metadata);

    res.status(200).json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error in creating Payment Intent:", error);
    res.status(500).json({ error: "Failed to create Payment Intent" });
  }
});

StripeRouter.get("/retrieve-payment-intent/:id", async (req, res) => {
     try {
       const { id } = req.params;
   
       // Use the service function
       const paymentIntent = await retrievePaymentIntent(id);
   
       res.status(200).json(paymentIntent);
     } catch (error) {
       console.error("Error in retrieving Payment Intent:", error);
       res.status(500).json({ error: "Failed to retrieve Payment Intent" });
     }
   });

   StripeRouter.post("/refund-payment", async (req, res) => {
     try {
       const { paymentIntentId } = req.body;
   
       // Use the service function
       const refund = await refundPayment(paymentIntentId);
   
       res.status(200).json(refund);
     } catch (error) {
       console.error("Error in refunding Payment Intent:", error);
       res.status(500).json({ error: "Failed to refund Payment Intent" });
     }
   });

module.exports = StripeRouter;
