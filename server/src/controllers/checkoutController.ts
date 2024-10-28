// server/src/controllers/checkoutController.ts
"use server";

import { Request, Response } from "express";
import Stripe from "stripe";
import { CheckoutService } from "../services/checkoutService";
import { InvoiceService } from "../services/invoiceService";

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
  // Handle Webhooks
  public async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const event = req.body;
      // Process webhook event using appropriate service
      res.status(200).json({ received: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CheckoutController();
