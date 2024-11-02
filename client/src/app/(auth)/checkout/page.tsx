<<<<<<< Updated upstream
import React from "react";

type Props = {};
=======
// src/app/checkout/page.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import PaymentForm from "@/components/forms/PaymentForm";
import ReviewForm from "@/components/forms/ReviewForm";
import ShippingForm from "@/components/forms/ShippingForm";
import { BillingInfo, PaymentInfo, ShippingInfo } from "@/interfaces";
>>>>>>> Stashed changes

const CheckoutPage = (props: Props) => {
  return <div>CheckoutPage</div>;
};

<<<<<<< Updated upstream
export default CheckoutPage;
=======
export default function CheckoutPage() {
  const router = useRouter();
  const pathname = usePathname();

  // State for each form's data
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    mobilePhone: "",
    deliveryMethod: "FREE_STANDARD",
  });

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    mobilePhone: "",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "Credit",
    cardLast4Digits: "4242",
  });

  const [paymentMethodId, setPaymentMethodId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // useEffect(() => {
  //   if (pathname === "/checkout") {
  //     router.replace("/checkout/shipping");
  //   }
  // }, [pathname, router]);

  // Navigation and form submission handlers
  const handleNextClick = async () => {
    if (pathname === "/checkout/review") {
      setIsProcessing(true);
      try {
        // Order processing logic here
        router.push("/checkout/success");
      } catch (error) {
        console.error("Order processing failed:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      if (pathname === "/checkout") {
        router.push("/checkout/payment");
      } else if (pathname === "/checkout/payment") {
        router.push("/checkout/review");
      }
    }
  };

  const renderForm = () => {
    switch (pathname) {
      case "/checkout":
        return (
          <ShippingForm
            shippingInfo={shippingInfo}
            setShippingInfo={setShippingInfo}
            onNext={() => router.push("/checkout/payment")}
          />
        );
      case "/checkout/payment":
        return (
          <PaymentForm
            billingInfo={billingInfo}
            setBillingInfo={setBillingInfo}
            shippingInfo={shippingInfo}
            paymentInfo={paymentInfo}
            setPaymentMethodId={setPaymentMethodId}
            setPaymentInfo={setPaymentInfo}
            onNext={() => router.push("/checkout/review")}
            onBack={() => router.push("/checkout")}
          />
        );
      case "/checkout/review":
        return (
          <ReviewForm
            shippingInfo={shippingInfo}
            billingInfo={billingInfo}
            paymentMethodId={paymentMethodId}
            onNext={() => router.push("/checkout/success")}
            onBack={() => router.push("/checkout/payment")}
          />
        );
      default:
        return <p>Invalid stage.</p>;
    }
  };

  return (
    <div className="flex w-full items-start justify-center space-x-20">
      <Elements stripe={stripePromise}>
        {/* Left side: Form Content */}
        <div className="w-2/3">
          <div className="flex flex-col space-y-6">{renderForm()}</div>
        </div>
      </Elements>
    </div>
  );
}
>>>>>>> Stashed changes
