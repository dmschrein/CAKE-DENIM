// server/src/services/checkoutService.ts

import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";

{
  /* Update for  */
}
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
//   apiVersion: "2024-09-30.acacia",
// });

{
  /* AWS Secrets Manager setup for deployment*/
}
const secretsManager = new AWS.SecretsManager();

const getSecret = async (secretName: string): Promise<string> => {
  const response = await secretsManager
    .getSecretValue({
      SecretId: secretName,
    })
    .promise();
  if (!response.SecretString) {
    throw new Error(`Secret ${secretName} is missing or invalid.`);
  }
  return response.SecretString;
};

const prisma = new PrismaClient();

export class CheckoutService {
  // Create a new checkout session for single payment
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-09-30.acacia",
    });
  }
  public async initializeStripe() {
    const stripeSecretKey = await getSecret("/stripe/secret_key");
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-09-30.acacia",
    });
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
      console.log("createCheckout executed");
      // Create a payment intent for the order using the user ID as the Stripe customer ID
      console.log("paymentIntent executed");

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
