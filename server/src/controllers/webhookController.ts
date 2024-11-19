import { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";

{
  /* AWS Parameters for production deployment */
}
const ssm = new AWS.SSM();
const getParameter = async (name: string): Promise<string> => {
  const result = await ssm
    .getParameter({
      Name: name,
      WithDecryption: true,
    })
    .promise();
  return result.Parameter?.Value || "";
};

const prisma = new PrismaClient();

class WebhookController {
  private prisma: PrismaClient; //remove?
  private stripe: Stripe;
  private endpointSecret: string | undefined;

  constructor(stripe: Stripe, endpointSecret: string) {
    this.prisma = new PrismaClient();
    this.stripe = stripe;
    this.endpointSecret = endpointSecret;
  }

  // Handle Webhooks
  public async handleWebhook(req: Request, res: Response): Promise<void> {
    console.log("🟢🟢Webhook is being handled.");
    let event = req.body;

    if (this.endpointSecret) {
      const sig = req.headers["stripe-signature"];
      if (!sig) {
        res.status(400).send("Missing Stripe signature header");
        return; // Just exit the function, don't return anything explicitly
      }

      console.log("🟢🟢Trying to create the event.");
      try {
        console.log("Raw body received: ", req.body.toString());
        // Construct the event using Stripe's signature and raw body
        event = this.stripe.webhooks.constructEvent(
          req.body,
          sig,
          this.endpointSecret || ""
        );
      } catch (err: any) {
        console.error(
          "⛔️ Webhook signature verification failed: ",
          err.message
        );
        res.status(400).send(`Webhook Error: ${err.message}`);
        return; // Exit after sending the response
      }

      console.log("🟢🟢Event is being handled.", event.type);

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log("🔔 PaymentIntent was successful:", paymentIntent.id);

          // Get orderId from metadata and update order status to "Paid"
          const orderId = paymentIntent.metadata.orderId;
          if (!orderId) {
            console.error("orderId missing from paymentIntent metadata.");
            res.status(400).send("Missing orderId in metadata");
            return; // Exit after sending the response
          }

          console.log("Updating order with orderId:", orderId);
          try {
            const updatedOrder = await prisma.orders.update({
              where: { orderId: orderId },
              data: { status: "Paid" },
            });
            console.log("✅ Order updated successfully:", updatedOrder.orderId);
            res.status(200).json({ received: true });
          } catch (err) {
            console.error("Error updating order:", err);
            res.status(500).json({ error: "Failed to update order" });
          }
          return; // Exit after sending the response
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
          res.status(400).send(`Unhandled event type: ${event.type}`);
          return; // Exit after sending the response
      }
    } else {
      res.status(405).send("Method Not Allowed");
    }
  }
}

// Export an async initializer for the controller
export const createWebhookController = async (): Promise<WebhookController> => {
  try {
    const stripeSecretKey = await getParameter("/stripe/secret_key");
    const stripeWebhookSecret = await getParameter("/stripe/webhook_secret");

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-09-30.acacia",
    });

    return new WebhookController(stripe, stripeWebhookSecret);
  } catch (error) {
    console.error("Failed to initialize Stripe keys:", error);
    throw new Error("Failed to initialize WebhookController");
  }
};
