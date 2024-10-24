"use client";

import ShippingForm from "@/components/forms/ShippingForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShippingInfo } from "@/interfaces";

export default function CheckoutShippingPage() {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const router = useRouter();

  const handleNextStep = () => {
    sessionStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    router.push("/checkout/payment"); // Navigate to payment page
  };

  return (
    <div>
      <ShippingForm
        shippingInfo={shippingInfo}
        setShippingInfo={setShippingInfo}
        nextStep={handleNextStep}
      />
    </div>
  );
}
