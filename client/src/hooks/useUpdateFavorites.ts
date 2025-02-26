import { useState } from "react";
import { useUpdateFavoritesMutation } from "@/state/api";

export const useUpdateFavorites = () => {
  const [updateFavoritesMutation] = useUpdateFavoritesMutation();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateFavorites = async (userId: string, productId: string) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const result = await updateFavoritesMutation({
        userId,
        productId,
      }).unwrap();
      setSuccessMessage(result.message);
    } catch (error: any) {
      setError(error.data?.message || "Failed to update favorites.");
    } finally {
      setIsLoading(false);
    }
  };

  return { updateFavorites, error, successMessage, isLoading };
};
