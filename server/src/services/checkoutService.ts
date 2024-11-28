// server/src/services/checkoutService.ts

import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";
import { getSSMParameterValue } from "../utils/secrets";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class CheckoutService {
  // Create a new checkout session for single payment
  private stripe: Stripe;

  constructor() {
    // Initialize Stripe with a placeholder key; it will be dynamically set later
    const secretKey = process.env.STRIPE_SECRET_KEY || "";
    if (!secretKey) {
      logger.warn("Stripe Secret Key is not set at initialization.");
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: "2024-11-20.acacia",
    });
  }

  public async initializeStripe(): Promise<void> {
    try {
      const stripeSecretKey =
        process.env.STRIPE_SECRET_KEY ||
        (await getSSMParameterValue("/stripe/secret_key"));
      if (!stripeSecretKey) {
        throw new Error("Stripe Secret Key is missing.");
      }
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2024-11-20.acacia",
      });
      logger.info("Stripe initialized successfully for CheckoutService.");
    } catch (error) {
      logger.error("Failed to initialize Stripe in CheckoutService", { error });
      throw new Error("Stripe initialization failed.");
    }
  }

  async createCheckout(data: any) {
    try {
      await this.initializeStripe();
      // get customer using email from auth log in session and update the userId
      const user = await prisma.users.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // If user does not have a stripeCustomerId, create one in Stripe and save it in the database
      if (!user.stripeCustomerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          payment_method: data.paymentMethodId,
          invoice_settings: {
            default_payment_method: data.paymentMethod,
          },
        });
        user.stripeCustomerId = customer.id; // Update local referece
      }

      // Save the customer Id to the database
      await prisma.users.update({
        where: { email: data.email },
        data: { stripeCustomerId: user.stripeCustomerId },
      });

      // Create the payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount, // Order amount in smallest currency unit (e.g., cents)
        currency: data.currency, // Currency (e.g., USD)
        customer: user.stripeCustomerId, // Assuming you store the Stripe customer ID in the user record
        payment_method: data.paymentMethodId, // Payment method ID from the request
        confirm: true, // Automatically confirm the payment intent
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never", // TODO: Update when adding other payment methods (other than CC)
        },
        metadata: {
          orderId: data.orderId, // Store order ID for reference
          userId: user.userId,
        },
      });
      logger.info("PaymentIntent created: ", paymentIntent);
      if (!paymentIntent.client_secret) {
        logger.error("client_secret is missing in Stripe response");
        throw new Error("Failed to retrieve client secret from Stripe");
      }

      return paymentIntent;
    } catch (error: any) {
      logger.error("Error creating checkout", { error });
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }
}
