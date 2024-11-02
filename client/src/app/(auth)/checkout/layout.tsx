// src/app/checkout/layout.tsx
"use client";

import OrderSummary from "@/components/layout/OrderSummary";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import EmbeddedCheckoutButton from "@/components/layout/EmbeddedCheckoutButton";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const stripe = useStripe();
  // const elements = useElements();

  const handleBack = () => {
    router.back();
  };
  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (!stripe || !elements) {
  //     setError("Card details not entered.");
  //     setIsProcessing(false);
  //     return;
  //   }
  //   const cardElement = elements.getElement(CardElement);
  //   if (!cardElement) {
  //     setError("Card details not entered.");
  //     setIsProcessing(false);
  //     return;
  //   }
  //   // Create the payment method using Stripe
  //   const { error: stripeError, paymentMethod } =
  //     await stripe.createPaymentMethod({
  //       type: "card",
  //       card: cardElement,
  //     });
  //   if (stripeError) {
  //     setError(stripeError.message || "Failed to process payment.");
  //     setIsProcessing(false);
  //     return;
  //   }
  //   setPaymentMethodId(paymentMethod?.id || "");
  //   setIsProcessing(false);
  //   onNext();
  // };
  return (
    <div className="flex min-h-screen justify-center bg-gray-100 p-10">
      {/* Main content on the left side */}
      <div className="relative min-h-[80vh] w-2/3 overflow-y-auto pb-10 pr-10">
        {/* Signed in email at the top */}

        {/* Back button and Signed in email, stacked vertically */}
        <div className="mb-4 flex flex-col items-start space-y-2">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center rounded p-2 text-lg text-black underline hover:bg-gray-400"
          >
            <ChevronLeftIcon className="h-6 w-6" />
            Back
          </button>
        </div>
        {session?.user?.email && (
          <div className="text-black-600 text-md px-20">
            Signed in as {session.user.email}
          </div>
        )}
        {/* Main content */}
        <div className="my-4 border-t-2 border-black"></div>
        {children}
      </div>
      {/* Vertical divider */}
      <div className="mx-10 border-l-2 border-black">
        <OrderSummary />
      </div>
    </div>
  );
}
