// payment.tsx
"use client";

import PaymentForm from "@/components/forms/PaymentForm";
import { useState } from "react";
import { PaymentInfo } from "@/interfaces";
import { useRouter } from "next/navigation";

export default function CheckoutPaymentPage() {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const router = useRouter();

  const handleNextStep = () => {
    sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
    router.push("/checkout/reviewOrder");
  };

  return (
    <PaymentForm
      paymentInfo={paymentInfo} // Pass paymentInfo here
      setPaymentInfo={setPaymentInfo}
      nextStep={handleNextStep}
      previousStep={() => router.push("/checkout")}
    />
  );
}
