import Stripe from "stripe";

export class InvoiceService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIP_SECRET_KEY as string, {
      apiVersion: "2024-09-30.acacia",
    });
  }

  async createInvoice(data: any) {
    try {
      const { customerId, items, autoAdvance = true } = data;

      // Step 1: Validate input data (basic validation, you can add more as needed)
      if (!customerId) {
        throw new Error("Customer ID is required to create an invoice.");
      }
      if (!items || items.length === 0) {
        throw new Error("Invoice must contain at least one item.");
      }
      // Step 2: Create invoice items for each line item
      const invoiceItemsPromises = items.map(async (items: any) => {
        return await this.stripe.invoiceItems.create({
          customer: customerId,
          amount: items.amount,
          currency: items.currency || "usd",
          description: items.description || "Invoice Item",
        });
      });
      // Wait for all invoice items to be created
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
      //Handles errors that might occur during the process
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
  }
}
