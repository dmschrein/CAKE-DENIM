"use server";
// src/routes/checkoutRoutes.ts
import express, { Router } from "express";
import CheckoutController from "../controllers/checkoutController";

const stripeRouter: Router = express.Router();

//  Checkout management
stripeRouter.post(
  "/payments",
  CheckoutController.createCheckout.bind(CheckoutController)
);

// Invoice management
stripeRouter.post(
  "/invoices",
  CheckoutController.createInvoice.bind(CheckoutController)
);

export default stripeRouter;
