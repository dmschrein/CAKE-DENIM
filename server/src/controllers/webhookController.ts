import { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { getSSMParameterValue } from "../utils/secrets";
import logger from "../utils/logger";

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
    logger.info("🟢 Webhook is being handled.");
    let event = req.body;

    if (this.endpointSecret) {
      const sig = req.headers["stripe-signature"] as string;
      if (!sig) {
        logger.error("Missing Stripe signature header");
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
        logger.error("Webhook signature verification failed:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      logger.info("Processing Webhook event:", event.type);

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          logger.info("🔔 PaymentIntent was successful:", paymentIntent.id);

          // Get orderId from metadata
          const orderId = paymentIntent.metadata?.orderId;
          if (!orderId) {
            logger.error("orderId missing from paymentIntent metadata.");
            res.status(400).send("Missing orderId in metadata");
            return;
          }

          try {
            const updatedOrder = await prisma.orders.update({
              where: { orderId },
              data: { status: "Paid" },
            });
            logger.info("✅ Order updated successfully:", updatedOrder.orderId);
            res.status(200).json({ received: true });
          } catch (err) {
            logger.error("Error updating order in database:", err);
            res.status(500).json({ error: "Failed to update order" });
          }
          break;
        }

        default:
          logger.warn(`Unhandled event type: ${event.type}`);
          res.status(400).send(`Unhandled event type: ${event.type}`);
          break;
      }
    } else {
      logger.error("Stripe Webhook Secret not configured");
      res.status(500).send("Webhook endpoint not properly configured");
    }
  }
}

// Export an async initializer for the controller
export const createWebhookController = async (): Promise<WebhookController> => {
  try {
    logger.info("🔄 Initializing WebhookController...");

    const stripeSecretKey =
      (await getSSMParameterValue("/stripe/secret_key")) ||
      process.env.STRIPE_SECRET_KEY;
    const stripeWebhookSecret =
      (await getSSMParameterValue("/stripe/webhook_secret")) ||
      process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey || !stripeWebhookSecret) {
      throw new Error("Critical Stripe secrets are missing.");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    });

    logger.info("🟢 WebhookController initialized successfully.");

    return new WebhookController(stripe, stripeWebhookSecret);
  } catch (error: any) {
    logger.error("❌ Failed to initialize WebhookController:", error.message);
    throw new Error("WebhookController initialization failed");
  }
};
