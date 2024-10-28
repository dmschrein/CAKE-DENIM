// // src/app/api/webhooks/stripe.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import Stripe from "stripe";
// import { buffer } from "micro";
// import dotenv from "dotenv";

// // Load the environment variables
// dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2024-09-30.acacia",
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const sig = req.headers["stripe-signature"] as string;

//   let event;

//   try {
//     const rawBody = await buffer(req);
//     event = stripe.webhooks.constructEvent(
//       rawBody.toString(),
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET as string,
//     );
//   } catch (err: any) {
//     console.error(`⛔️ Webhook signature verification failed.`, err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event
//   switch (event.type) {
//     case "payment_intent.succeeded":
//       const paymentIntent = event.data.object;
//       console.log("PaymentIntent was successful!");
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }
//   res.json({ received: true });
// };

// export default webhookHandler;
