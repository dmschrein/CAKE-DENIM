import { Order } from "@/interfaces";
import React from "react";

type Props = {
  orders: Order[];
  isLoading: boolean;
  isError: boolean;
};

const OrderHistory: React.FC<Props> = ({ orders, isLoading, isError }) => {
  if (isLoading) return <div>Loading your orders...</div>;
  if (isError || !orders.length) return <div>No orders found.</div>;

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Order History</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.orderId} className="rounded-md border p-4">
            <p>
              <strong>Order ID:</strong>
              {order.orderId}
            </p>
            <p>
              <strong>Order Date:</strong>
              {order.createdAt}
            </p>
            <p>
              <strong>Total:</strong>
              {order.totalAmount}
            </p>
            <p>
              <strong>Status:</strong>
              {order.status}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
