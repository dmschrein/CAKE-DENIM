import { useGetUserByEmailQuery } from "@/state/api";
import { skipToken } from "@reduxjs/toolkit/query";

export const useUserDetails = (email?: string) => {
  const { data, isLoading, isError } = useGetUserByEmailQuery(
    email ? email : skipToken,
  );
  return { userDetails: data ?? null, isLoading, isError };
};
