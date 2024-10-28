// server/src/services/checkoutService.ts

import Stripe from "stripe";
import { getUsers } from "../controllers/userController";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // apiVersion: "2023-08-16", // Use the latest stable version
});

const prisma = new PrismaClient();

export class CheckoutService {
  // Create a new checkout session for single payment

  async createCheckout(data: any) {
    try {
      // get customer using email from auth log in session and update the userId
      const user = await prisma.users.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // If user does not have a stripeCustomerId, create one in Stripe and save it in the database
      if (!user.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          payment_method: data.paymentMethodId,
          invoice_settings: {
            default_payment_method: data.paymentMethod,
          },
        });
        user.stripeCustomerId = customer.id; // Update local referece
      }
      console.log("createCheckout executed");
      // Create a payment intent for the order using the user ID as the Stripe customer ID
      console.log("paymentIntent executed");
      const paymentIntent = await stripe.paymentIntents.create({
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
        },
      });
      console.log("PaymentIntent created: ", paymentIntent);
      if (!paymentIntent.client_secret) {
        console.error("client_secret is missing in Stripe response");
        throw new Error("Failed to retrieve client secret from Stripe");
      }
      console.log(
        "🟢🟢Payment Intent Client Secret: ",
        paymentIntent.client_secret
      );
      return paymentIntent;
    } catch (error: any) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }
}
