"use client";

import { useUpdatePassword } from "@/hooks/useUpdatePassword";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

type Props = {};

export default function ForgotPassword({}: Props) {
  const { data: session } = useSession();
  // get email from the user
  const userId = session?.user.id;
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const { updatePassword, error, successMessage, isLoading } =
    useUpdatePassword();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("User not authenticated.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    await updatePassword(
      userId,
      formData.newPassword,
      formData.confirmPassword,
    );
    if (!error) {
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="justify-top mt-10 flex min-h-screen flex-col items-center p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-center text-red-500">{error}</p>}
          {successMessage && (
            <p className="text-center text-green-500">{successMessage}</p>
          )}
          <div>
            <label>New Password*</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label>Confirm New Password*</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border p-2"
            />
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="w-1/2 rounded-md border border-gray-400 py-2 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-4 w-1/2 rounded-md bg-black py-2 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
