"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/providers/CartProvider";
import Image from "next/image";
import { ShippingInfo } from "@/interfaces";

interface OrderSummaryProps {
  shippingInfo: ShippingInfo | null;
}
{
  /* Order summary integration */
}
const OrderSummary: React.FC<OrderSummaryProps> = ({ shippingInfo }) => {
  console.log("Order Summary component is rendered");
  const { items } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [isProcessing, setIsProcessing] = useState(false);

  console.log("Order Summary Items: ", items);

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

  const calculateShippingCost = (deliveryMethod: string | undefined) => {
    switch (deliveryMethod) {
      case "GROUND":
        return 10;
      case "EXPRESS":
        return 25;
      case "NEXT_DAY":
        return 40;
      default:
        return 0;
    }
  };

  const calculateOrderTotal = (
    shipping: number,
    subtotal: number,
    tax: number,
  ) => {
    return shipping + subtotal + tax;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShippingCost(shippingInfo?.deliveryMethod);
  const orderTotal = calculateOrderTotal(shipping, subtotal, tax);

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
                src="https://s3-cakedenim.s3.us-west-1.amazonaws.com/ochoa.png"
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
          {/* Inline Style for Summary Section */}
          <div className="mt-6 space-y-2 border-t px-1 pt-4">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Tax:</p>
              <p>${tax.toFixed(2)}</p>
            </div>

            <div className="flex justify-between">
              <p>Shipping:</p>
              <p>{shippingInfo ? `$${shipping.toFixed(2)}` : "FREE"}</p>
            </div>
            <div className="mt-2 flex justify-between border-t pt-4 text-lg font-bold">
              <p className="text-lg font-bold">Order Total:</p>
              <p className="text-lg font-bold">${orderTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default OrderSummary;
