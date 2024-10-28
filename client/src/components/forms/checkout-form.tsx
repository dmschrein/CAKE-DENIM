"use client";

import {
  useElements,
  PaymentElement,
  useStripe,
  LinkAuthenticationElement,
  CardElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

import { useCreatePaymentMutation } from "@/state/api";
import { useCart } from "@/providers/CartProvider";

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPaymentProcessing, setPaymentProcessing] = useState(false);

  const [createPayment] = useCreatePaymentMutation(); // Hook to call API for payment

  const { items } = useCart();

  const calculateTotalPrice = () => {
    if (!items || items.length === 0) {
      return 0; // if no items, return 0
    }
    // Reduce the items array to sum up the total price of all items
    return items.reduce(
      (acc, item) => acc + item.product.price * item.count,
      0,
    );
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not been properly initialized.");
      return;
    }

    setError(null); // Reset errors
    setPaymentProcessing(true); // Indicate that payment is processing

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details not entered correctly.");
      setPaymentProcessing(false);
      return;
    }

    try {
      // Step 1: Create Payment Method
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            email,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Failed to process payment.");
        setPaymentProcessing(false);
        return;
      }

      // Step 2: Create the Payment Intent on the server and get the client secret
      const paymentAmount = calculateTotalPrice() * 100; // Convert to cents for Stripe
      const { data: paymentResponse } = await createPayment({
        email,
        paymentMethodId: paymentMethod?.id,
        amount: paymentAmount,
        currency: "usd",
        orderId: "uniqueOrderId", // Replace with the actual order ID
      });

      const clientSecret = paymentResponse?.client_secret;

      if (!clientSecret) {
        setError("Failed to retrieve client secret from the server.");
        setPaymentProcessing(false);
        return;
      }
      console.log("Payment Response is: ", paymentResponse);
      // Step 3: Check if the Payment Intent is already confirmed to avoid duplicate requests
      if (paymentResponse?.status === "succeeded") {
        console.log("Payment already confirmed, skipping further action.");
        router.push("/checkout/success");
        setPaymentProcessing(false);
        return;
      }

      // Step 4: Confirm the Payment Intent with the client secret
      const { error: confirmationError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret);

      if (confirmationError) {
        setError(confirmationError.message || "Failed to confirm payment.");
        setPaymentProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        console.log("Payment succeeded: ", paymentIntent);
        router.push("/checkout/success");
      } else {
        setError("Payment processing failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred during payment processing.");
      console.error(error);
    }

    setPaymentProcessing(false);
  };

  return (
    <div>
      <form
        id="payment-form"
        onSubmit={handlePaymentSubmit}
        className="space-y-6"
      >
        <h2>Checkout</h2>
        {/* <LinkAuthenticationElement id="link-authentication-element" />
          <PaymentElement id="payment-element" /> */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Email input */}
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Stripe Card Element */}
        <div>
          <label>Card Details:</label>
          <CardElement />
        </div>

        {/* Display total price */}
        <p>Total Price: ${(calculateTotalPrice() / 100).toFixed(2)}</p>
        <Button className="w-full" type="submit" disabled={isPaymentProcessing}>
          {isPaymentProcessing ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
}
