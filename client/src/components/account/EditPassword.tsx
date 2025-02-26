import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useUpdatePassword } from "@/hooks/useUpdatePassword";

const EditPassword: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [formData, setFormData] = useState({
    currentPassword: "",
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
      formData.currentPassword,
      formData.newPassword,
    );

    if (!error) {
      setFormData({
        currentPassword: "",
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
            <label className="block text-sm font-medium">
              Current Password*
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New Password*</label>
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
            <label className="block text-sm font-medium">
              Confirm New Password*
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
};

export default EditPassword;
