"use client";

import React, { useEffect } from "react";
import { useCart } from "@/providers/CartProvider";

type Props = {};

const SuccessfulCheckout = (props: Props) => {
  // const { clearCart } = useCart();

  // useEffect(() => {
  //   clearCart();
  // }, [clearCart]);

  return (
    <div>
      {" "}
      <h1>Thank you for your purchase!</h1>
      <p>Your order has been successfully processed.</p>
    </div>
  );
};

export default SuccessfulCheckout;
