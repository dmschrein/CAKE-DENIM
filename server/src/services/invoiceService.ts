import Stripe from "stripe";
import { getSSMParameter } from "../utils/secrets";

export class InvoiceService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-09-30.acacia",
    });
  }

  public async initializeStripe() {
    const stripeSecretKey = await getSSMParameter("/stripe/secret_key");
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-09-30.acacia",
    });
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
