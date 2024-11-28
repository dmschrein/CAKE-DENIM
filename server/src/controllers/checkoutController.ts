// server/src/controllers/checkoutController.ts
"use server";

import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { CheckoutService } from "../services/checkoutService";
// import { InvoiceService } from "../services/invoiceService";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import { loadSecretsToEnv } from "../utils/secrets";

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
  //private invoiceService: InvoiceService;

  constructor() {
    this.checkoutService = new CheckoutService();
    //this.invoiceService = new InvoiceService();
  }

  public async initialize(): Promise<void> {
    try {
      logger.info("Loading secrets for CheckoutController...");
      await loadSecretsToEnv();
      logger.info("Secrets loaded successfully for CheckoutController.");
    } catch (error) {
      logger.error("Failed to initialize CheckoutController", { error });
      throw new Error("CheckoutController initialization failed.");
    }
  }

  // Checkout management
  public async createCheckout(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      logger.debug("Received checkout data", { data });
      const result = await this.checkoutService.createCheckout(data);
      logger.info("Successfully created checkout", { result });
      res.status(201).json(result);
    } catch (error: any) {
      logger.error("Error creating checkout: ", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Invoice Management
  // public async createInvoice(req: Request, res: Response): Promise<void> {
  //   try {
  //     const data = req.body;
  //     logger.debug("Received invoice data:", data);
  //     const result = await this.invoiceService.createInvoice(data);
  //     logger.info("Successfully created invoice:", result);
  //     res.status(201).json(result);
  //   } catch (error: any) {
  //     logger.error("Error creating invoice", { error });
  //     res.status(500).json({ error: error.message });
  //   }
  // }
}

export default new CheckoutController();
