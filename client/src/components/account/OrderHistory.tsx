import { Order } from "shared/src/interfaces";
import React from "react";
import Image from "next/image";

type Props = {
  orders: Order[];
  isLoading: boolean;
  isError: boolean;
};
//TODO: Update to include order details that will show all products and complete order details
const OrderHistory: React.FC<Props> = ({ orders, isLoading, isError }) => {
  if (isLoading)
    return <div className="text-center">Loading your orders...</div>;
  if (isError || !orders.length)
    return <div className="text-center">No orders found.</div>;
  //console.log("ORDERS DATA:", orders);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Order History
        </h2>
        <ul className="flex flex-col items-center space-y-6">
          {orders.map((order) => {
            //console.log("ORDER:", order.orderId);
            //const OrderItems = order.orderItems; // Get the first item
            //console.log("Order Items:", OrderItems);
            const firstOrderItem = order.orderItems?.[0]; // Get product data
            //console.log("First Order Item:", order.orderItems);
            const product = firstOrderItem.product;
            //console.log("Product: ", product);
            const imageUrl =
              product?.imageURL ??
              (Array.isArray(product?.imageURL2) ? product.imageURL2[0] : null);
            console.log("Image URL: ", imageUrl);
            return (
              <li
                key={order.orderId}
                className="w-full max-w-2xl rounded-md border bg-white p-6 shadow-md"
              >
                {product ? (
                  <div className="mb-4 flex flex-col items-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={240}
                        height={360}
                        className="h-60 w-60 object-cover"
                        unoptimized // Allow external images without Next.js optimization
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center bg-gray-200">
                        No Image
                      </div>
                    )}
                    {/* <p>
                      <strong>Product:</strong> {product.name}
                    </p> */}
                  </div>
                ) : (
                  <p>⚠️ No product found for this order.</p>
                )}
                <p>
                  <strong>Order ID:</strong> {order.orderId}
                </p>
                <p>
                  <strong>Order Date:</strong> {order.createdAt}
                </p>
                <p>
                  <strong>Total:</strong> {order.totalAmount}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OrderHistory;
