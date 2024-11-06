"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/providers/CartProvider";
import Image from "next/image";
import { ShippingInfo } from "@/interfaces";

interface OrderSummaryProps {
  shippingInfo: ShippingInfo | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ shippingInfo }) => {
  console.log("Order Summary component is rendered");
  const { items } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNextClick = async () => {
    if (pathname === "/checkout/review") {
      setIsProcessing(true);
      try {
        // TODO: Add order processing logic here
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

  const calculateSubtotal = () => {
    return items.reduce(
      (acc, item) => acc + item.product.price * item.count,
      0,
    );
  };

  const calculateTax = (subtotal: number) => {
    return +(subtotal * 0.1).toFixed(2); // Assuming a 10% tax rate
  };

  const calculateOrderTotal = (subtotal: number, tax: number) => {
    return subtotal + tax;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const orderTotal = calculateOrderTotal(subtotal, tax);

  return (
    <div className="flex w-full max-w-2xl flex-col p-8">
      <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

      {items && items.length > 0 ? (
        <div>
          {/* <div className="border-r-2 border-black px-5"> */}
          {items.map((item) => (
            <div
              key={item.product.productId}
              className="mb-4 flex items-center"
            >
              <Image
                src="/assets/ochoa.png"
                alt={item.product.name}
                width={180}
                height={240}
                className="mr-4"
              />

              <div>
                <p className="font-bold">{item.product.name}</p>
                <p className="text-gray-600">Quantity: {item.count}</p>
                <p className="text-gray-600">Price: ${item.product.price}</p>
                <p className="font-bold">
                  Total: ${(item.product.price * item.count).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          <div className="mt-6 border-t px-1 pt-4">
            <p className="font-bold">Subtotal: ${subtotal.toFixed(2)}</p>
            <p className="font-bold">Tax: ${tax.toFixed(2)}</p>
            <p className="font-bold">
              Shipping:{" "}
              {shippingInfo
                ? shippingInfo.deliveryMethod
                : "Calculated at next step"}
            </p>
            <p className="text-lg font-bold">
              Order Total: ${orderTotal.toFixed(2)}
            </p>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default OrderSummary;
