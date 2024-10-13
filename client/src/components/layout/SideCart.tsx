"use client";

import React from "react";
import { useCart } from "@/providers/CartProvider"; // Custom hook for accessing the cart context
import { signIn, useSession } from "next-auth/react"; // Functions for authentication and session management from NextAuth.js
import { useRouter } from "next/navigation"; // Hook for navigating between pages in Next.js
import Image from "next/image"; // Component for optimized image rendering in Next.js

// Define the props the component will receive
interface Props {
  visible?: boolean; // Boolean prop to control visibility of the side cart
  onRequestClose?(): void; // Optional callback function for closing the side cart
}

// Functional component definition for the SideCart
const SideCart: React.FC<Props> = ({ visible, onRequestClose }) => {
  // Destructure cart-related functions and data from the custom useCart hook
  const {
    items: cartItems, // List of items in the cart
    updateCart, // Function to update cart items
    removeFromCart, // Function to remove an item from the cart
    countTotalPrice, // Function to calculate the total price of items in the cart
    clearCart, // Function to clear all items from the cart
  } = useCart();

  // Initialize the router for page navigation
  const router = useRouter();

  // Retrieve the user's session status from NextAuth
  const { status } = useSession();
  console.log(status);
  const isLoggedIn = status === "authenticated"; // Boolean to check if the user is authenticated

  return (
    // Render the SideCart container, which will slide in from the right based on the visibility prop
    <div
      style={{ right: visible ? "0" : "-100%" }}
      className="fixed right-0 top-0 z-50 flex min-h-screen w-96 flex-col bg-white shadow-md transition-all"
    >
      {/* Header section with cart title and clear cart button */}
      <div className="flex justify-between p-4">
        <h1 className="mt-4 text-xl font-semibold uppercase text-blue-950">
          In your bag ({cartItems.length})
        </h1>
        {/* Close button */}
        <button
          onClick={onRequestClose}
          className="text-right text-4xl"
          aria-label="Close cart"
        >
          &times;
        </button>
      </div>

      {/* Divider Line */}
      <div className="h-0.5 w-full bg-gray-200" />

      {/* Iterate over the cart items and render each product in the cart */}
      {cartItems.map((cartItem) => {
        if (!cartItem.product) return null;

        return (
          <div key={cartItem.product.productId} className="p-4">
            <div className="flex space-x-4">
              {/* Display product image using Next.js Image component for optimization */}
              <Image
                src="/assets/cakebabe.png" // Replace with cartItem.product.thumbnail if applicable
                alt=""
                className="rounded object-cover"
                width={64}
                height={64}
              />
              <div className="flex-1">
                <h2 className="font-semibold">{cartItem.product.name}</h2>
                {/* Quantity and total price for this item */}
                <div className="flex space-x-1 text-sm text-gray-400">
                  <span>x</span>
                  <span>
                    {cartItem.product
                      ? cartItem.count * cartItem.product.price
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="ml-auto">
                {/* Remove item button */}
                <button
                  onClick={() => removeFromCart(cartItem.product)}
                  className="text-xs uppercase hover:underline"
                >
                  Remove
                </button>

                {/* Quantity control buttons */}
                <div className="flex items-center justify-between">
                  <button onClick={() => updateCart(cartItem.product, -1)}>
                    -
                  </button>
                  <span className="text-xs">{cartItem.count}</span>
                  <button onClick={() => updateCart(cartItem.product, 1)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Divider Line */}
      <div className="h-0.5 w-full bg-gray-200" />

      {/* Footer section with total price and checkout button */}
      <div className="mt-auto p-4">
        <div className="py-4">
          <h1 className="text-xl font-semibold uppercase">Total</h1>
          <p className="font-semibold">
            <span className="font-normal text-gray-400">
              The total of your cart is:
            </span>{" "}
            ${countTotalPrice()}
          </p>
        </div>

        {/* Checkout button, conditional on user authentication */}
        <button
          onClick={() => {
            if (isLoggedIn) {
              // Proceed to checkout if user is authenticated
              // TODO: Send create user info to backend
              console.log("send data to the server and create payment link");
              router.push("/checkout");
            } else {
              // Redirect to sign-in page if user is not authenticated
              router.push("/auth/sign-in");
            }
            onRequestClose && onRequestClose(); // Close the cart if onRequestClose is provided
          }}
          className="w-full rounded border-2 border-blue-950 py-2 uppercase text-blue-950"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

// Export the SideCart component as the default export
export default SideCart;
