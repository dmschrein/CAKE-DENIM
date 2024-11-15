import React from "react";
import { Order } from "@/interfaces";

type OrderHistoryProps = {
  userOrders: Order[] | null;
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ userOrders }) => {
  // make call to get user's order history using email
  return <div>OrderHistory</div>;
};

export default OrderHistory;
