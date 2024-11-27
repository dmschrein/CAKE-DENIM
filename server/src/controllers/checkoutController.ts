// server/src/controllers/checkoutController.ts
"use server";

import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { CheckoutService } from "../services/checkoutService";
import { InvoiceService } from "../services/invoiceService";
import { PrismaClient } from "@prisma/client";

// import bodyParser from "body-parser";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2024-09-30.acacia",
// });
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

class CheckoutController {
  private checkoutService: CheckoutService;
  // TODO: add additional services if needed
  private invoiceService: InvoiceService;

  constructor() {
    this.checkoutService = new CheckoutService();
    this.invoiceService = new InvoiceService();
  }

  // Checkout management
  public async createCheckout(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      console.log("Received checkout data:", data);
      const result = await this.checkoutService.createCheckout(data);
      console.log("Successfully created checkout:", result);
      res.status(201).json(result);
    } catch (error: any) {
      console.log("Error creating checkout: ", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Invoice Management
  public async createInvoice(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      console.log("Received invoice data:", data);
      const result = await this.invoiceService.createInvoice(data);
      console.log("Successfully created invoice:", result);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CheckoutController();
