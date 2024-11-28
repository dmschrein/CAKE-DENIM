import Stripe from "stripe";
import logger from "../utils/logger";
import { getSSMParameterValue, getSecretValue } from "../utils/secrets";

export class InvoiceService {
  private stripe: Stripe;

  constructor() {
    // Initialize Stripe with a placeholder key; ti will updated during runtime
    const secretKey = process.env.STRIPE_SECRET_KEY || "";
    if (!secretKey) {
      logger.warn("Stripe Secret Key is not set at initialization.");
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: "2024-11-20.acacia",
    });
  }

  /**
   * Dynamically loads the Stripe secret and updates the Stripe instance
   */
  public async initializeStripe(): Promise<void> {
    try {
      logger.info("Initializing Stripe for InvoiceService...");
      const stripeSecretKey =
        process.env.STRIPE_SECRET_KEY ||
        (await getSSMParameterValue("/stripe/secret_key")) ||
        (await getSecretValue("/stripe/secret_key"));

      if (!stripeSecretKey) {
        throw new Error("Stripe Secret Key is missing.");
      }
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2024-11-20.acacia",
      });
      logger.info("Stripe initialized successfully for InvoiceService.");
    } catch (error) {
      logger.error("Failed to initialize Stripe in InvoiceService", { error });
      throw new Error("Stripe initialization failed.");
    }
  }

  async createInvoice(data: any) {
    try {
      await this.initializeStripe();
      const { customerId, items, autoAdvance = true } = data;

      // Step 1: Validate input data (basic validation, you can add more as needed)
      if (!customerId) {
        throw new Error("Customer ID is required to create an invoice.");
      }
      if (!items || items.length === 0) {
        throw new Error("Invoice must contain at least one item.");
      }

      // Step 2: Create invoice items for each line item
      const invoiceItemsPromises = items.map(async (item: any) => {
        return await this.stripe.invoiceItems.create({
          customer: customerId,
          amount: item.amount,
          currency: item.currency || "usd",
          description: item.description || "Invoice Item",
        });
      });
      await Promise.all(invoiceItemsPromises);

      // Step 3: Create the invoice
      const invoice = await this.stripe.invoices.create({
        customer: customerId,
        auto_advance: autoAdvance, // Auto-finalize the invoice if set to true
      });

      // Optional: Automatically finalize the invoice if autoAdvance is true
      if (autoAdvance) {
        const finalizedInvoice = await this.stripe.invoices.finalizeInvoice(
          invoice.id
        );
        return finalizedInvoice;
      }

      return invoice;
    } catch (error: any) {
      // Handle errors that might occur during the process
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
  }
}
