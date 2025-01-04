import express, { Router, Request, Response } from "express";
import { createWebhookController } from "../controllers/webhookController";

const webhookRouter: Router = express.Router();

(async () => {
  try {
    const webhookController = await createWebhookController(); // create webhook controller

    webhookRouter.post(
      "/webhook",
      express.raw({ type: "application/json" }), // Ensures raw body for Stripe
      async (req: Request, res: Response) => {
        try {
          // delegate request to webhook
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
