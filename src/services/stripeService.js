const BoatModel = require("../models/boatModel");
const bookingModel = require("../models/bookingModel");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CreateCheckoutSession = async (userEmail,pricing, bookingId, bookingRef,instabookId, yachtId) => {
  const totalAmount = pricing?.totals?.totalRenterPayment || 0;
  const amountInCents = Math.round(totalAmount * 100);

  const yacht = await BoatModel.findOne({_id:yachtId})

console.log(userEmail)
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // ✅ Only allow card payments
      mode: "payment",
      billing_address_collection: "required",
      customer_email: userEmail,
      
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: yacht.title,
              description: `Booking ID: ${bookingRef || 0}`,
            },
            unit_amount: amountInCents, // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: bookingId?.toString() || "0",
        yachtId: yachtId?.toString() || "unknown",
        instabookId: instabookId?.toString() || "unknown",
      },
      payment_intent_data: {
        setup_future_usage: "off_session", // ✅ Ensures 3D Secure when required
      },
      allow_promotion_codes: true,
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/book-now/${yachtId || "default-id"}/${instabookId}`,
    });

    console.log("✅ Stripe Checkout URL:", session.url);
    return session
  } catch (error) {
    console.error("❌ Error creating Stripe Checkout session:", error);
    return { error: "Something went wrong" };
  }
};


// const CreateCheckoutSession = async (pricing, bookingId, instabookId, yachtId) => {
//   console.log("Pricing:", pricing);

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"], // ✅ Allow only secure card payments
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: "Yacht Booking",
//               description: `Booking ID: ${bookingId || 0}`,
//             },
//             unit_amount: (pricing?.totals?.totalRenterPayment || 0) * 100, // Convert to cents
//           },
//           quantity: 1,
//         },
//       ],
//       metadata: {
//         bookingId: bookingId ? bookingId.toString() : "0",
//         yachtId: yachtId ? yachtId.toString() : "unknown",
//         instabookId: instabookId ? instabookId.toString() : "unknown",
//       },
//       payment_intent_data: {
//         capture_method: "automatic", // ✅ Automatically captures the payment
//         setup_future_usage: "off_session", // ✅ Ensures compliance with SCA
//         payment_method_options: {
//           card: {
//             request_three_d_secure: "automatic", // ✅ Enables 3D Secure where required
//           },
//         },
//       },
//       success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/book-now/${yachtId || "default-id"}/${instabookId}`,
//     });

//     console.log("Session URL:", session.url);
//     return { url: session.url };
//   } catch (error) {
//     console.error("❌ Error creating Stripe Checkout session:", error);
//     return { error: "Something went wrong" };
//   }
// };



// const CreateCheckoutSession = async (pricing, bookingId ,instabookId,yachtId) => {
//   console.log(pricing)
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: "Yacht Booking",
//               description: `\nbookingId     :        ${bookingId || 0}`,
//             },
//             unit_amount: (pricing?.totals?.totalRenterPayment || 0) * 100, // Amount in cents
//           },
//           quantity: 1,
//         },
//       ],
//       metadata: {
//         bookingId: bookingId.toString() // Pass the booking ID here
//       },
//       success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/book-now/${yachtId || "default-id"}/${instabookId}`, // Adjusted to refer to pricing details directly
//     });

//     console.log(session.url);
//     return { url: session.url }
//     // res.status(200).json({ url: session.url });
//   } catch (error) {
//     console.error("Error creating Stripe Checkout session:", error);
//     return { error: "Something went wrong" }
//     // res.status(500).json({ error: "Something went wrong" });

//   }
// };

const getSessionDetails = async (session_id) => {
console.log("session_id",session_id)
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const bookingId = session.metadata.bookingId;

    const bookingDetails = await bookingModel.findById({_id:bookingId});
    console.log(bookingDetails)
    return bookingDetails

  } catch (error) {
    console.error("Error retrieving session details:", error);
    // res.status(500).json({ error: "Failed to retrieve session details" });
  }
}

const convertToSmallestUnit = (amount, currency) => {
     const zeroDecimalCurrencies = ["jpy", "krw"]; // Add currencies without smaller units
     return zeroDecimalCurrencies.includes(currency.toLowerCase())
       ? amount // No conversion needed
       : Math.round(amount * 100); // Convert to smallest unit
   };
   
const createPaymentIntent = async (amount, currency = "usd", metadata = {}) => {
   const smallestUnitAmount=  convertToSmallestUnit(amount,currency)
console.log(smallestUnitAmount)
  try {
    const paymentIntent = await stripe.paymentIntents.create({
   amount:  smallestUnitAmount, // Total amount in the smallest currency unit (e.g., cents for USD)
      currency,
      metadata, // Optional metadata for tracking
    });
    return paymentIntent;
  } catch (error) {
    console.error("Error creating Payment Intent:", error);
    throw error;
  }
};

const retrievePaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Error retrieving Payment Intent:", error);
    throw error;
  }
};

const refundPayment = async (paymentIntentId) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
    return refund;
  } catch (error) {
    console.error("Error creating refund:", error);
    throw error;
  }
};


module.exports = {
  CreateCheckoutSession,
  getSessionDetails
};
