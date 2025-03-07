"use client";

import useForgotPassword from "@/hooks/useForgotPassword";
/*
 * Forgot password form
 * input field for user's email
 * submit button to trigger the password reset
 * feedback messages (success or error)
 * callback function (handleClose) to let users return to the sign-in form
 */

import React, { useState } from "react";

interface ForgotPasswordFormProps {
  handleClose: () => void; // Function to switch back to Sign In
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  handleClose,
}) => {
  const [email, setEmail] = useState("");
  const { forgotPassword, isLoading, error, success } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    await forgotPassword(email); // call the password reset function
  };

  return (
    <div className="rounded-md border bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold">Reset passord</h2>
      <p className="mb-4 text-sm text-gray-600">
        Enter your email, and we&&apos;ll send you a link to reset your
        password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          className="w-full rounded-md border p-2"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}

        <button
          onClick={handleClose}
          className="w-full rounded-md bg-black py-2 text-white hover:bg-gray-700"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <button
        onClick={handleClose}
        className="mt-3 text-sm text-black hover:underline"
      >
        Back to Sign In
      </button>
    </div>
  );
};

export default ForgotPasswordForm;
