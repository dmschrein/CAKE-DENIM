"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const SuccessfulCheckout = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Retrieve the orderId from the query parameters
    const orderIdParam = searchParams.get("orderId");
    setOrderId(orderIdParam);
  }, [searchParams]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl rounded-md bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">
          Thank you for your purchase!
        </h1>
        <p className="mb-4 text-center text-lg text-gray-600">
          Your order number is:{" "}
          <span className="font-semibold text-blue-800">
            {orderId ? orderId : "Loading..."}
          </span>
          .
        </p>
        <p className="text-md mb-8 text-center text-gray-500">
          We&#39;ll email you an order confirmation with details and tracking
          info.
        </p>
        <div className="flex justify-center">
          <Link href="/">
            <button className="rounded bg-blue-800 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessfulCheckout;
