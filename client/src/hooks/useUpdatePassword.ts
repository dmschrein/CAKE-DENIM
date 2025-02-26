import { useState } from "react";
import { useUpdatePasswordMutation } from "@/state/api";

export const useUpdatePassword = () => {
  const [updatePasswordMutation] = useUpdatePasswordMutation();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updatePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const result = await updatePasswordMutation({
        userId,
        currentPassword,
        newPassword,
      }).unwrap();
      setSuccessMessage(result.message);
    } catch (error: any) {
      setError(error.data?.message || "Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePassword, error, successMessage, isLoading };
};
