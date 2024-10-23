"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/providers/CartProvider";
import { Elements } from "@stripe/react-stripe-js";
import ShippingForm from "./ShippingForm";
import PaymentForm from "./PaymentForm";
import ReviewForm from "./ReviewForm";
import { ShippingInfo } from "@/interfaces";

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  // Update this to accept ShippingInfo or null
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);

  const [paymentInfo, setPaymentInfo] = useState(null);

  const { items } = useCart();

  // create order once the user provides shipping info, payment info and reviews the order
  //const [createOrder, {}];

  console.log("Current Step:", step);

  const handleNextStep = async () => {
    if (step === 1) {
      try {
        // store the customer name, shipping address and delivery option to be used in the review form
      } catch (error) {
        console.error("Error creating checkout session:", error);
      }
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => setStep(step - 1);

  // Show order summary on the side using Side Cart state
  const orderSummary = {
    subtotal: items.reduce(
      (acc, item) => acc + item.product.price * item.count,
      0,
    ),
    shipping: shippingInfo?.deliveryMethod === "Express" ? 25 : 0,
    tax: (
      items.reduce((acc, item) => acc + item.product.price * item.count, 0) *
      0.1
    ).toFixed(2),
    total:
      items.reduce((acc, item) => +item.product.price * item.count, 0) +
      (shippingInfo?.deliveryMethod === "Express" ? 25 : 0) +
      items.reduce((acc, item) => acc + item.product.price * item.count, 0) *
        0.1,
  };

  console.log("Client Secret at Step 2: ", clientSecret);

  return (
    <div className="flex min-h-screen items-start justify-center space-x-10 p-5">
      <div className="flex w-2/3 flex-col">
        {step === 1 && (
          <ShippingForm
            shippingInfo={shippingInfo}
            setShippingInfo={setShippingInfo} // Ensure the type matches here
            nextStep={handleNextStep}
          />
        )}
        {step === 2 && clientSecret && (
          <Elements>
            <PaymentForm
            // setPaymentInfo={setPaymentInfo}
            // nextStep={handleNextStep}
            // previousStep={handlePreviousStep}
            // stripePromise={stripePromise}
            // cartAmount={0} // Can pass the cart total if needed
            />
          </Elements>
        )}
        {step === 3 && (
          <ReviewForm
            shippingInfo={shippingInfo}
            paymentInfo={paymentInfo}
            orderSummary={orderSummary}
            previousStep={handlePreviousStep}
          />
        )}
      </div>

      <div className="w-72 bg-white p-10 shadow-md">
        <h2 className="text-xl font-semibold">Order Summary</h2>
      </div>
    </div>
  );
};

export default CheckoutPage;
