"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { useCart } from "@/providers/CartProvider";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PaymentForm from "@/components/forms/PaymentForm";
import ReviewForm from "@/components/forms/ReviewForm";
import { ShippingInfo, BillingInfo } from "@/interfaces";
import OrderSummary from "@/components/layout/OrderSummary";

// Load Stripe using the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const previousStep = () => setCurrentStep((prev) => prev - 1);

  const { items } = useCart();

  const calculateTotalPrice = () => {
    if (!items || items.length === 0) {
      return 0;
    }
    return items.reduce(
      (acc, item) => acc + item.product.price * item.count,
      0,
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center space-y-4 p-6">
      {/* Navigation and Signed-in Text */}
      <div className="flex w-full max-w-6xl flex-col space-y-2">
        {/* Back Button */}
        <div className="mb-4 flex w-full justify-between">
          {currentStep > 1 && (
            <button
              onClick={previousStep}
              className="rounded bg-gray-400 p-2 text-white"
            >
              Back
            </button>
          )}
        </div>
        {session?.user?.email && (
          <div className="text-md mx-20 mb-4 text-gray-600">
            Signed in as {session.user.email}
          </div>
        )}
      </div>

      <Elements stripe={stripePromise}>
        <div className="flex w-full space-x-8">
          {/* Left side: Checkout Forms */}
          <div className="flex-1">
            <hr className="mb-8 border-gray-300" />
            {currentStep === 1 && (
              <CheckoutForm
                shippingInfo={shippingInfo}
                setShippingInfo={setShippingInfo}
                nextStep={nextStep}
              />
            )}
            {currentStep === 2 && (
              <PaymentForm
                shippingInfo={shippingInfo}
                billingInfo={billingInfo}
                setBillingInfo={setBillingInfo}
                setPaymentMethodId={setPaymentMethodId}
                nextStep={nextStep}
                previousStep={previousStep}
              />
            )}
            {currentStep === 3 && (
              <ReviewForm
                shippingInfo={shippingInfo!}
                billingInfo={billingInfo}
                paymentMethodId={paymentMethodId!}
                previousStep={previousStep}
              />
            )}
          </div>

          {/* Right side: Order Summary */}
          {/* <div className="w-1/3 border-l-2 border-gray-300 p-4">
            <OrderSummary />
          </div> */}
        </div>
      </Elements>
    </div>
  );
}
