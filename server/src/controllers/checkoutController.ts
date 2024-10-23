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
      const result = await this.checkoutService.createCheckout(data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Invoice Management
  public async createInvoice(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const result = await this.invoiceService.createInvoice(data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CheckoutController();
