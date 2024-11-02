"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your publishable key
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
// );

interface EmbeddedCheckoutButtonProps {
  isProcessing: boolean;
  currentPath: string;
  onClick: () => void;
}

const EmbeddedCheckoutButton: React.FC<EmbeddedCheckoutButtonProps> = ({
  isProcessing,
  currentPath,
  onClick,
}) => {
  // Define the button label based on the path
  const buttonLabel = isProcessing
    ? "Processing..."
    : currentPath === "/checkout/review"
      ? "Place Order"
      : "Next";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full max-w-2xl bg-black p-2 text-white"
      disabled={isProcessing}
    >
      {buttonLabel}
    </button>
  );
};

// const [clientSecret, setClientSecret] = useState<string | null>(null);

// const handleCheckout = async () => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/checkout/create-checkout-session`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           lineItems: [
//             {
//               price: "price_12345", // This should be your Stripe price ID
//               quantity: 1,
//             },
//           ],
//         }),
//       },
//     );
//     const data = await response.json();

//     if (data.clientSecret) {
//       // Store the client secret for further payment processing in the Payment Form
//       setClientSecret(data.clientSecret);
//     }

//     if (data.sessionId) {
//       // Redirect to Stripe Checkout using the sessionId
//       const stripe = await stripePromise;
//       if (stripe) {
//         stripe.redirectToCheckout({ sessionId: data.sessionId });
//       }
//     }
//   } catch (error) {
//     console.error("Error creating checkout session: ", error);
//   }
// };
//   return (
//     <button onClick={onClick} className="w-full bg-black p-2 text-white">
//       {getButtonLabel()}
//     </button>
//   );
// };

export default EmbeddedCheckoutButton;
