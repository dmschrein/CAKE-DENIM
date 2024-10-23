import express, { Router } from "express";
import CheckoutController from "../controllers/checkoutController";

const stripeRouter: Router = express.Router();

//  Checkout management
stripeRouter.post(
  "/checkouts",
  CheckoutController.createCheckout.bind(CheckoutController)
);

// Invoice management
stripeRouter.post(
  "/invoices",
  CheckoutController.createInvoice.bind(CheckoutController)
);

export default stripeRouter;
