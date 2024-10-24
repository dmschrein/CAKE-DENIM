// src/app/(auth)/checkout/reviewOrder.tsx
"use client";
import ReviewForm from "@/components/forms/ReviewForm";
import { useState, useEffect } from "react";
import { ShippingInfo, PaymentInfo, OrderSummary } from "@/interfaces";

export default function CheckoutReviewPage() {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const orderSummary: OrderSummary = {
    subtotal: 100, // Example
    shipping: 10,
    tax: 5,
    total: 115,
  };

  useEffect(() => {
    const storedShippingInfo = sessionStorage.getItem("shippingInfo");
    const storedPaymentInfo = sessionStorage.getItem("paymentInfo");
    if (storedShippingInfo) setShippingInfo(JSON.parse(storedShippingInfo));
    if (storedPaymentInfo) setPaymentInfo(JSON.parse(storedPaymentInfo));
  }, []);

  const handlePlaceOrder = () => {
    console.log("Order placed with:", { shippingInfo, paymentInfo });
    // Add logic to handle order placement
  };

  return (
    <ReviewForm
      shippingInfo={shippingInfo}
      paymentInfo={paymentInfo}
      orderSummary={orderSummary}
      previousStep={() => console.log("Go back")}
      onPlaceOrder={handlePlaceOrder} // Add this prop
    />
  );
}
