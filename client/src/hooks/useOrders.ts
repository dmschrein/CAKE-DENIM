import { useGetOrdersByUserIdQuery } from "@/state/api";
import { skipToken } from "@reduxjs/toolkit/query";

export const useOrders = (userId?: string) => {
  // Instead of conditionally calling the hook, always call it and use `skipToken` when userId is missing
  const { data, isLoading, isError } = useGetOrdersByUserIdQuery(
    userId ? userId : skipToken,
  );

  return { orderDetails: data || [], isLoading, isError };
};
