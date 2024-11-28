"use server";
// src/routes/checkoutRoutes.ts
import express, { Router } from "express";
import bodyParser from "body-parser";
import CheckoutController from "../controllers/checkoutController";
// import { handleStripeWebhook } from "../controllers/webhookController";

const stripeRouter: Router = express.Router();

//  Checkout management
stripeRouter.post(
  "/payments",
  CheckoutController.createCheckout.bind(CheckoutController)
);

// Invoice management
// stripeRouter.post(
//   "/invoices",
//   CheckoutController.createInvoice.bind(CheckoutController)
// );

export default stripeRouter;
