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

/* WEBHOOK ROUTES */
app.use("/api/stripe/", webhookRoutes);

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
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
