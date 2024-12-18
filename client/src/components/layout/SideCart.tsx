"use client";

import React from "react";
import { useCart } from "@/providers/CartProvider"; // Custom hook for accessing the cart context
import { useSession } from "next-auth/react"; // Functions for authentication and session management from NextAuth.js
import { useRouter } from "next/navigation"; // Hook for navigating between pages in Next.js
import Image from "next/image"; // Component for optimized image rendering in Next.js

// Define the props the component will receive
interface Props {
  visible?: boolean; // Boolean prop to control visibility of the side cart
  onRequestClose?(): void; // Optional callback function for closing the side cart
}

{
  /* SideCart component to display the subtotal, tax, shipping cost, and the final order total. */
}
const SideCart: React.FC<Props> = ({ visible, onRequestClose }) => {
  // Destructure cart-related functions and data from the custom useCart hook
  const {
    items: cartItems, // List of items in the cart
    updateCart, // Function to update cart items
    removeFromCart, // Function to remove an item from the cart
    clearCart,
    countTotalPrice, // Function to calculate the total price of items in the cart
  } = useCart();

  // Initialize the router for page navigation
  const router = useRouter();

  // Retrieve the user's session status from NextAuth
  const { status } = useSession();
  console.log("SideCart user status:", status);
  const isLoggedIn = status === "authenticated"; // Boolean to check if the user is authenticated

  return (
    // Render the SideCart container, which will slide in from the right based on the visibility prop
    <div
      style={{ right: visible ? "0" : "-100%" }}
      className="fixed right-0 top-0 z-50 flex min-h-screen w-96 flex-col bg-white shadow-md transition-all"
    >
      {/* Header section with cart title and close cart button */}
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

      {/* Clear Cart Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => {
            clearCart();
            if (onRequestClose) {
              onRequestClose();
            }
          }}
          className="text-sm uppercase text-red-500 hover:text-red-700"
        >
          Clear Cart
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
                src="https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png" // Replace with cartItem.product.thumbnail if applicable
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
                {/* Display color and size if variant exists */}
                {cartItem.variant ? (
                  <div className="text-sm text-gray-500">
                    <p>Color: {cartItem.variant.color}</p>
                    <p>Size: {cartItem.variant.size}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <p>Color: Not specified</p>
                    <p>Size: Not specified</p>
                  </div>
                )}
              </div>

              <div className="ml-auto">
                {/* Remove item button */}
                <button
                  onClick={() =>
                    cartItem.variant &&
                    removeFromCart(
                      cartItem.product,
                      cartItem.variant.variantId,
                      cartItem.variant.color,
                      cartItem.variant.size,
                    )
                  }
                  className="text-xs uppercase hover:underline"
                >
                  Remove
                </button>

                {/* Quantity control buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() =>
                      cartItem.variant &&
                      updateCart(
                        cartItem.product,
                        cartItem.variant.variantId,
                        cartItem.variant.color,
                        cartItem.variant.size,
                        -1,
                      )
                    }
                  >
                    -
                  </button>
                  <span className="text-xs">{cartItem.count}</span>
                  <button
                    onClick={() =>
                      cartItem.variant &&
                      updateCart(
                        cartItem.product,
                        cartItem.variant.variantId,
                        cartItem.variant.color,
                        cartItem.variant.size,
                        1,
                      )
                    }
                  >
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
              // User is authenticated, proceed to checkout
              console.log("User is authenticated, proceeding to checkout");
              router.push("/checkout");
            } else {
              // User is not authenticated, redirect to sign-in
              console.log("User is not authenticated, redirecting to sign-in");
              const signInUrl = `/sign-in?callbackUrl=${encodeURIComponent("/checkout")}`;
              router.push(signInUrl);
            }
            // Close the cart if onRequestClose is provided
            if (onRequestClose) {
              onRequestClose();
            }
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
