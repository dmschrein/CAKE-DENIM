import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { getSSMParameterValue } from "../utils/secrets";
import logger from "../utils/logger";

const prisma = new PrismaClient();

interface CheckoutData {
  email: string;
  paymentMethodId: string;
  amount: number;
  currency?: string;
  orderId: string;
}

export class CheckoutService {
  private stripe!: Stripe; // Delay initialization until secrets are available

  public async initializeStripe(): Promise<void> {
    try {
      // Load the Stripe secret key dynamically
      const stripeSecretKey =
        process.env.STRIPE_SECRET_KEY ||
        (await getSSMParameterValue("/stripe/secret_key"));

      if (!stripeSecretKey) {
        throw new Error("Stripe Secret Key is missing.");
      }
      console.log();
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2025-01-27.acacia", // Corrected API version
      });

      logger.info("Stripe initialized successfully for CheckoutService.");
    } catch (error) {
      logger.error("Failed to initialize Stripe in CheckoutService", { error });
      throw new Error("Stripe initialization failed.");
    }
  }

  public async createCheckout(data: unknown): Promise<Stripe.PaymentIntent> {
    try {
      // Ensure Stripe is initialized before proceeding
      if (!this.stripe) {
        await this.initializeStripe();
      }

      console.log("Secrets loaded:", {
        stripeSecretKey: process.env.STRIPE_SECRET_KEY,
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      });
      // Validate and cast data to CheckoutData
      const { email, paymentMethodId, amount, currency, orderId } =
        data as CheckoutData;

      // Fetch user details
      const user = await prisma.users.findUnique({
        where: { email: email },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      // Create Stripe customer if not already present
      if (!user.stripeCustomerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          payment_method: paymentMethodId,
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });

        user.stripeCustomerId = customer.id;

        // Update user in database
        await prisma.users.update({
          where: { email: email },
          data: { stripeCustomerId: user.stripeCustomerId },
        });
      }
      // return URL
      let returnUrl: string;

      switch (process.env.NODE_ENV) {
        case "local":
          returnUrl =
            process.env.LOCAL_RETURN_URL ||
            "http://localhost:3000/checkout/success";
          break;
        case "production":
          returnUrl =
            process.env.PRODUCTION_RETURN_URL ||
            "https://cake-denim.vercel.app/checkout/success";
          break;
        case "development":
          returnUrl =
            process.env.DEVELOPMENT_RETURN_URL ||
            "https://cake-denim-development.vercel.app/checkout/success";
          break;
        default:
          logger.warn("ENVIRONMENT not recognized. Using fallback URL.");
          returnUrl = "https://cake-denim.vercel.app/checkout/success";
          break;
      }

      if (!returnUrl) {
        throw new Error(
          "Return URL is not defined for the current environment"
        );
      }

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount, // Smallest currency unit (e.g., cents)
        currency: currency || "usd",
        customer: user.stripeCustomerId,
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: { enabled: true },
        metadata: { orderId: orderId, userId: user.userId },
        return_url: returnUrl,
      });

      logger.info("PaymentIntent created successfully", { paymentIntent });

      if (!paymentIntent.client_secret) {
        throw new Error("Failed to retrieve client secret from Stripe.");
      }

      return paymentIntent;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("Error creating chekckout", { error });
        throw new Error(`Failed to create payment: ${error.message}`);
      }
      logger.error("Unknown error during create checkout", { error });
      throw new Error(`Create Payment Error: Unknown error`);
    }
  }
}
