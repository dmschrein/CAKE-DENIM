// server/src/index.ts
import express, { Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import Stripe from "stripe";

/* ROUTE IMPORTS */
import homeRoutes from "./routes/homeRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import orderRoutes from "./routes/orderRoutes";
import webhookRoutes from "./routes/webhookRoutes";
// import { handleStripeWebhook } from "./controllers/webhookController";

/* CONFIGURATIONS */
dotenv.config();
const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-09-30.acacia",
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
app.use("/api/stripe/", webhookRoutes);
// Stripe Webhook Route - Move this before the global middleware
// app.post(
//   "/api/stripe/webhook",
//   express.raw({ type: "application/json" }), // Use raw body for Stripe webhook
//   (request: Request, response: Response) => {
//     let event = request.body;

//     if (endpointSecret) {
//       const signature = request.headers["stripe-signature"];
//       try {
//         event = stripe.webhooks.constructEvent(
//           request.body, // raw body
//           signature as string, // Stripe signature
//           endpointSecret // Webhook secret
//         );
//       } catch (err: any) {
//         console.log(`⚠️  Webhook signature verification failed:`, err.message);
//         return response.sendStatus(400); // Return 400 if signature verification fails
//       }
//     }

//     // Handle the event here
//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntent = event.data.object;
//         console.log(`PaymentIntent was successful: ${paymentIntent.id}`);
//         break;

//       // Add more event types as needed

//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     // Return a response to acknowledge receipt of the event
//     response.sendStatus(200);
//   }
// );
/* Middleware applied globally after webhook route */
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS configuration to allow requests from frontend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

/* ROUTES */
app.use("/home", homeRoutes); // http://localhost:8000/home
app.use("/products", productRoutes); // http://localhost:8000/products
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
console.log("Checkout Routes executed");
app.use("/api/stripe", checkoutRoutes); // TODO: check if i need api

/* Error handling middleware */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "An error occurrred on the server." });
});

/* SERVER */
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
