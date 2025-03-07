import { useState } from "react";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function forgotPassword(email: string) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email.");
      }

      setSuccess("A password reset email has been sent.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  return { forgotPassword, isLoading, error, success };
}

export default useForgotPassword;
