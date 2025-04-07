const express = require('express');
const app = express();
const authRouter = require('./routes/authRoutes');
const  connection  = require("./config/db");
const boatOwnerRouter = require('./routes/boatOwnerRoutes');
const authenticate = require('./middlewares/authenticate');
const boatRouter = require('./routes/boatRoutes');
const errorHandler = require('./middlewares/errorHandler');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRoutes');
const availabilityRouter = require('./routes/availabilityRoute');
const bookingRouter = require('./routes/bookingRoutes');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

require('dotenv').config();
const cors =require("cors");
const ImageRouter = require('./routes/ImagesRoutes');
const { fetchLocations } = require('./services/locationService');
const CategoryRouter = require('./routes/CategoryRoute');
const featuresRouter = require('./routes/featuresRouter');
const InstaBookRouter = require('./routes/InstaBookRoutes');
const StripeRouter = require('./routes/StripeRoutes');
const adminRouter = require('./routes/adminRoutes');
const wishListRouter = require('./routes/whishListRoutes');
const faqRouter = require('./routes/faqRoutes');
const emailRouter = require('./routes/emailRoutes');
const VisitorRouter = require('./routes/visitorRoutes');
const payoutRouter = require('./routes/payoutRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const settingRouter = require('./routes/settingsRoutes');
const destinationRouter = require('./routes/destinastionRoute');
const yachtTypeRouter = require('./routes/yachtTypeRoute');
const webhookRouter = require('./routes/webhookRouter');



const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE',"PATCH"], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));

app.use("/webhook", webhookRouter);


app.use(express.json());




app.use('/auth', authRouter);

app.use('/boatOwners', boatOwnerRouter);
app.use('/boats',  boatRouter)
app.use('/users',  userRouter)
app.use('/reviews',  reviewRouter)
app.use('/availability', availabilityRouter);
app.use('/bookings', bookingRouter);
app.use('/images',ImageRouter)
app.use('/features',featuresRouter)
app.use("/instabook", InstaBookRouter);
// app.use("/owner", blockedAvailabilityRouter);
app.use("/wishlist", wishListRouter);
app.use("/admin", adminRouter);
app.use("/email", emailRouter);
app.use('/visitors',VisitorRouter );

app.use("/payouts", payoutRouter);
app.use("/transactions", transactionRouter);
app.use("/faqs", faqRouter);
app.use("/settings", settingRouter);
app.use("/destinations", destinationRouter);  
app.use("/yachtTypes", yachtTypeRouter);
app.use("/locations",async(req,res)=>{
  const { locationQuery } = req.query;
  
  try {
   locations= await fetchLocations(locationQuery)
   res.status(200).send(locations)
  } catch (error) {
    console.log(error)
   res.status(400).send(error)
    
  }

})

app.get("/test-stripe", async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    res.status(200).json(balance);
  } catch (error) {
    console.error("Stripe API Error:", error);
    res.status(500).json({ error: "Failed to connect to Stripe" });
  }
});


app.use('/categories',CategoryRouter)
// app.use(errorHandler)

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, async() => {
  try {
    await connection
    console.log("Server connected to db" )
  } catch (error) {
    console.log(error)
  }
  console.log(`Server is running on port ${PORT}`);
});
