import { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { getSSMParameter } from "../utils/secrets";

const prisma = new PrismaClient();

class WebhookController {
  private stripe: Stripe;
  private endpointSecret: string | undefined;

  constructor(stripe: Stripe, endpointSecret: string) {
    this.stripe = stripe;
    this.endpointSecret = endpointSecret;
  }

  // Handle Webhooks
  public async handleWebhook(req: Request, res: Response): Promise<void> {
    console.log("🟢 Webhook is being handled.");
    let event = req.body;

    if (this.endpointSecret) {
      const sig = req.headers["stripe-signature"] as string;
      if (!sig) {
        console.error("Missing Stripe signature header");
        res.status(400).send("Missing Stripe signature header");
        return;
      }

      try {
        // Construct the event using Stripe's signature and raw body
        event = this.stripe.webhooks.constructEvent(
          req.body,
          sig,
          this.endpointSecret
        );
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      console.log("Processing Webhook event:", event.type);

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log("🔔 PaymentIntent was successful:", paymentIntent.id);

          // Get orderId from metadata
          const orderId = paymentIntent.metadata?.orderId;
          if (!orderId) {
            console.error("orderId missing from paymentIntent metadata.");
            res.status(400).send("Missing orderId in metadata");
            return;
          }

          console.log("Updating order status to 'Paid' for orderId:", orderId);
          try {
            const updatedOrder = await prisma.orders.update({
              where: { orderId },
              data: { status: "Paid" },
            });
            console.log("✅ Order updated successfully:", updatedOrder.orderId);
            res.status(200).json({ received: true });
          } catch (err) {
            console.error("Error updating order in database:", err);
            res.status(500).json({ error: "Failed to update order" });
          }
          break;
        }

        default:
          console.warn(`Unhandled event type: ${event.type}`);
          res.status(400).send(`Unhandled event type: ${event.type}`);
          break;
      }
    } else {
      console.error("Stripe Webhook Secret not configured");
      res.status(500).send("Webhook endpoint not properly configured");
    }
  }
}

// Export an async initializer for the controller
export const createWebhookController = async (): Promise<WebhookController> => {
  try {
    console.log("🔄 Initializing WebhookController...");

    // Fetch Stripe secrets from SSM
    const stripeSecretKey = await getSSMParameter("/stripe/secret_key");
    const stripeWebhookSecret = await getSSMParameter("/stripe/webhook_secret");

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-09-30.acacia",
    });

    console.log("🟢 WebhookController initialized successfully.");

    return new WebhookController(stripe, stripeWebhookSecret);
  } catch (error: any) {
    console.error("❌ Failed to initialize WebhookController:", error.message);
    throw new Error("WebhookController initialization failed");
  }
};
