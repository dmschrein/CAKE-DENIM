// Import necessary components and hooks

"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "@/components/forms/checkout-form"; // Update with your actual path to CheckoutForm
import { useCart } from "@/providers/CartProvider";
import Image from "next/image";

// Load Stripe using the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  // Assuming price and store are provided, perhaps fetched from your backend or passed as props
  // const price = { amount: 5000 }; // $50 in cents for example
  // const store = { id: "store-id", name: "My Store" }; // Store details
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

  return (
    <div className="flex min-h-screen items-start justify-center space-x-10 p-5">
      <div className="flex flex-col space-x-10 md:flex-row">
        {/* Ensure Stripe Elements are wrapped in the Elements component */}
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
      <h1>Checkout Page</h1>
      {/* Cart Details */}
      <div className="w-72 bg-white p-10 shadow-md">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.product.productId} className="mb-4">
              <Image
                src={item.product.imageURL}
                alt={item.product.name}
                width={80}
                height={80}
              />
              <p>{item.product.name}</p>
              <p>{item.product.description}</p>
              <p>{item.product.category}</p>
              <p>Quantity: {item.count}</p>
              <p>Price: ${item.product.price}</p>
              <p>Total: ${item.product.price * item.count}</p>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}
