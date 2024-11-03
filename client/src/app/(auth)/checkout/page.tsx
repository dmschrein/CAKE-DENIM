"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { useCart } from "@/providers/CartProvider";
import Image from "next/image";
import { useState } from "react";
import PaymentForm from "@/components/forms/PaymentForm";
import ReviewForm from "@/components/forms/ReviewForm";
import { ShippingInfo, PaymentInfo, BillingInfo } from "@/interfaces";

// Load Stripe using the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
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
    <div className="flex w-full max-w-2xl items-start justify-center space-x-20">
      {/* Left side: Checkout forms */}
      <div className="w-full">
        <Elements stripe={stripePromise}>
          <div className="flex flex-col space-y-6">
            {currentStep === 1 && (
              // <CheckoutForm
              //   shippingInfo={shippingInfo}
              //   setShippingInfo={setShippingInfo}
              //   nextStep={nextStep}
              // />

              <PaymentForm
                shippingInfo={shippingInfo}
                billingInfo={billingInfo}
                setBillingInfo={setBillingInfo}
                setPaymentMethodId={setPaymentMethodId}
                nextStep={nextStep}
                previousStep={previousStep}
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
                paymentMethodId={paymentMethodId!}
                previousStep={previousStep}
              />
            )}
          </div>
        </Elements>
      </div>

      {/* Right side: Order Summary */}
      {/* <div className="w-1/2 rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
        {items && items.length > 0 ? (
          <div>
            {items.map((item) => (
              <div
                key={item.product.productId}
                className="mb-4 flex items-center"
              >
                <Image
                  src={item.product.imageURL}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="mr-4"
                />
                <div>
                  <p className="font-bold">{item.product.name}</p>
                  <p className="text-gray-600">Quantity: {item.count}</p>
                  <p className="text-gray-600">Price: ${item.product.price}</p>
                  <p className="font-bold">
                    Total: ${item.product.price * item.count}
                  </p>
                </div>
              </div>
            ))}
            <div className="mt-6 border-t pt-4">
              <p className="font-bold">Subtotal: ${calculateTotalPrice()}</p>
              <p className="font-bold">
                Tax: ${(calculateTotalPrice() * 0.1).toFixed(2)}
              </p>
              <p className="font-bold">Shipping: FREE</p>
              <p className="text-lg font-bold">
                Order Total: ${(calculateTotalPrice() * 1.1).toFixed(2)}
              </p>
            </div>
            <button className="mt-6 w-full bg-black p-3 text-white">
              Review order
            </button>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div> */}
    </div>
  );
}
