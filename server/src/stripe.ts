import Stripe from "stripe";

// Temporary workaround if TypeScript is enforcing an outdated type
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});
