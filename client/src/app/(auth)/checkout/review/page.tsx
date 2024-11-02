"use client";

import { useRouter } from "next/navigation";
import ReviewForm from "@/components/forms/ReviewForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentInfo, ShippingInfo, BillingInfo } from "@/interfaces";
import { useState } from "react";

// Load Stripe using the publisable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function ReviewPage() {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "Credit",
    cardLast4Digits: "4242",
  });
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
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");

  const handleNext = () => {
    router.push("/checkout/success");
  };

  const handleBack = () => {
    router.push("/checkout/payment");
  };
  return (
    <Elements stripe={stripePromise}>
      <div>
        <ReviewForm
          shippingInfo={shippingInfo}
          setShippingInfo={setShippingInfo}
          billingInfo={billingInfo}
          onNext={handleNext}
          onBack={handleBack}
          setBillingInfo={function (info: BillingInfo): void {
            throw new Error("Function not implemented.");
          }}
          paymentMethodId={""}
        />
      </div>
    </Elements>
  );
}
