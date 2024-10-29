// server/src/controllers/checkoutController.ts
"use server";

import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { CheckoutService } from "../services/checkoutService";
import { InvoiceService } from "../services/invoiceService";
import { PrismaClient } from "@prisma/client";
// import bodyParser from "body-parser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-09-30.acacia",
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
  private prisma: PrismaClient;

  constructor() {
    this.checkoutService = new CheckoutService();
    this.invoiceService = new InvoiceService();
    this.prisma = new PrismaClient();
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

  // // Handle Webhooks
  // public async handleWebhook(req: Request, res: Response): Promise<void> {
  //   console.log("🟢🟢Webhook is being handled.");
  //   let event = req.body;

  //   if (endpointSecret) {
  //     const sig = req.headers["stripe-signature"];
  //     if (!sig) {
  //       res.status(400).send("Missing Stripe signature header");
  //       return;
  //     }

  //     console.log("🟢🟢Trying to create the event.");

  //     try {
  //       console.log("Raw body received: ", req.body.toString());
  //       // Construct the event using Stripe's signature and raw body
  //       event = stripe.webhooks.constructEvent(
  //         req.body,
  //         sig,
  //         endpointSecret || ""
  //       );
  //     } catch (err: any) {
  //       console.error(
  //         "⛔️ Webhook signature verification failed: ",
  //         err.message
  //       );
  //       res.status(400).send(`Webhook Error: ${err.message}`);
  //       return;
  //     }
  //     console.log("🟢🟢Event is being handled.", event.type);
  //     // Handle the event
  //     switch (event.type) {
  //       case "payment_intent.succeeded": {
  //         const paymentIntent = event.data.object as Stripe.PaymentIntent;
  //         console.log("🔔 PaymentIntent was successful:", paymentIntent.id);

  //         // Get orderId from metadata and update order status to "paid"
  //         const orderId = paymentIntent.metadata.orderId;
  //         if (!orderId) {
  //           console.error("orderId missing from paymentIntent metadata.");
  //           res.status(400).send("Missing orderId in metadata");
  //           return;
  //         }
  //         console.log("Updating order with orderId:", orderId);
  //         try {
  //           const updatedOrder = await prisma.orders.update({
  //             where: { orderId: orderId },
  //             data: { status: "paid" },
  //           });
  //           console.log("✅ Order updated successfully:", updatedOrder.orderId);
  //           res.status(200).json({ received: true });
  //         } catch (err) {
  //           console.error("Error updating order:", err);
  //           res.status(500).json({ error: "Failed to update order" });
  //           return;
  //         }
  //         break;
  //       }
  //       default:
  //         console.log(`Unhandled event type: ${event.type}`);
  //     }

  //     // Return a 200 response to acknowledge receipt of the event
  //     res.status(200).json({ received: true });
  //   } else {
  //     res.status(405).send("Method Not Allowed");
  //   }
  // }
}

export default new CheckoutController();
