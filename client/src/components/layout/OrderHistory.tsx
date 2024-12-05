import React from "react";
import { Order } from "@/interfaces";

type OrderHistoryProps = {
  userOrders: Order[] | null;
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ userOrders }) => {
  if (!userOrders || userOrders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="order-history">
      <h2>Your Order History</h2>
      <ul className="order-list">
        {userOrders.map((order) => (
          <li key={order.orderId} className="order-item">
            <p>
              <strong>Order ID:</strong> {order.orderId}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
            </p>
            <ul className="order-items">
              <strong>Items:</strong>
              {order.orderItems.map((item) => (
                <li key={item.variantId}>
                  {item.color} - Quantity: {item.quantity} - Price: $
                  {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
