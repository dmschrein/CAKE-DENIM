import express, { Router, Request, Response } from "express";
import { createWebhookController } from "../controllers/webhookController";

const webhookRouter: Router = express.Router();

(async () => {
  try {
    // Initialize WebhookController
    const webhookController = await createWebhookController();

    // Define the webhook route
    webhookRouter.post(
      "/webhook",
      express.raw({ type: "application/json" }), // Parse raw body required by Stripe
      async (req: Request, res: Response) => {
        try {
          // Delegate the request to the controller
          await webhookController.handleWebhook(req, res);
        } catch (error) {
          console.error("Error handling webhook:", error);
          res.status(500).send("Internal Server Error");
        }
      }
    );
  } catch (error) {
    console.error("Failed to initialize WebhookController:", error);
    throw new Error("Failed to set up webhook routes");
  }
})();

export default webhookRouter;
