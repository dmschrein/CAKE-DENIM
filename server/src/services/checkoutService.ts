import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { getSSMParameterValue } from "../utils/secrets";
import logger from "../utils/logger";

const prisma = new PrismaClient();

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

      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2024-11-20.acacia", // Corrected API version
      });

      logger.info("Stripe initialized successfully for CheckoutService.");
    } catch (error) {
      logger.error("Failed to initialize Stripe in CheckoutService", { error });
      throw new Error("Stripe initialization failed.");
    }
  }

  public async createCheckout(data: any): Promise<Stripe.PaymentIntent> {
    try {
      // Ensure Stripe is initialized before proceeding
      if (!this.stripe) {
        await this.initializeStripe();
      }

      // Fetch user details
      const user = await prisma.users.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      // Create Stripe customer if not already present
      if (!user.stripeCustomerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          payment_method: data.paymentMethodId,
          invoice_settings: {
            default_payment_method: data.paymentMethodId,
          },
        });

        user.stripeCustomerId = customer.id;

        // Update user in database
        await prisma.users.update({
          where: { email: data.email },
          data: { stripeCustomerId: user.stripeCustomerId },
        });
      }
      // return URL
      const returnUrl =
        process.env.ENVIRONMENT === "development"
          ? process.env.LOCAL_RETURN_URL
          : process.env.PRODUCTION_RETURN_URL;

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount, // Smallest currency unit (e.g., cents)
        currency: data.currency || "usd",
        customer: user.stripeCustomerId,
        payment_method: data.paymentMethodId,
        confirm: true,
        automatic_payment_methods: { enabled: true },
        metadata: { orderId: data.orderId, userId: user.userId },
        return_url: returnUrl,
      });

      logger.info("PaymentIntent created successfully", { paymentIntent });

      if (!paymentIntent.client_secret) {
        throw new Error("Failed to retrieve client secret from Stripe.");
      }

      return paymentIntent;
    } catch (error: any) {
      logger.error("Error creating checkout", { error });
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }
}
