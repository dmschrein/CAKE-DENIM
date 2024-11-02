"use client";

import PaymentForm from "@/components/forms/PaymentForm";
import { BillingInfo, PaymentInfo, ShippingInfo } from "@/interfaces";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

interface PaymentPageProps {
  shippingInfo: ShippingInfo;
  setShippingInfo: (info: ShippingInfo) => void;
  billingInfo: BillingInfo;
  setBillingInfo: (info: BillingInfo) => void;
}
// Load Stripe using the publisable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function PaymentPage() {
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
    router.push("/checkout/review");
  };

  const handleBack = () => {
    router.push("/checkout");
  };

  return (
    <Elements stripe={stripePromise}>
      <div>
        <PaymentForm
          shippingInfo={shippingInfo}
          billingInfo={billingInfo}
          setBillingInfo={setBillingInfo}
          setPaymentMethodId={setPaymentMethodId}
          paymentInfo={paymentInfo}
          setPaymentInfo={setPaymentInfo}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    </Elements>
  );
}
