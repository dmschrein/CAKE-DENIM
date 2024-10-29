// Handle Webhooks
import express, { Router } from "express";
import bodyParser from "body-parser";
import WebhookController from "../controllers/webhookController";

const stripeRouter: Router = express.Router();

stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  WebhookController.handleWebhook.bind(WebhookController)
);

export default stripeRouter;
