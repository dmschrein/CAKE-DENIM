"use server";
// src/routes/checkoutRoutes.ts
import express, { Router } from "express";
import CheckoutController from "../controllers/checkoutController";
// import { handleStripeWebhook } from "../controllers/webhookController";

const checkoutRouter: Router = express.Router();

//  Checkout management
checkoutRouter.post(
  "/payments",
  CheckoutController.createCheckout.bind(CheckoutController)
);

// Invoice management
// stripeRouter.post(
//   "/invoices",
//   CheckoutController.createInvoice.bind(CheckoutController)
// );

export default checkoutRouter;
