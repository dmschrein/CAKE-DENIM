import React, { useEffect, useState } from "react";
import { User } from "shared/src/interfaces";

interface ProfileProps {
  userDetails: User;
  isLoading: boolean;
  isError: boolean;
}

const Profile: React.FC<ProfileProps> = ({
  userDetails,
  isLoading,
  isError,
}) => {
  // 1. Define the State for User Data
  const [formData, setFormData] = useState({
    firstName: userDetails.firstName || "",
    lastName: userDetails.lastName || "",
    phone: userDetails.phone || "",
    gender: userDetails.gender || "",
    email: userDetails.email || "",
    preferredSize: userDetails.preferredSize || "",
    birthday: {
      month: userDetails.birthday?.month || "1",
      day: userDetails.birthday?.day || "1",
      year: userDetails.birthday?.year || "2000",
    },
  });

  // Update state when userDetails prop changes
  useEffect(() => {
    if (userDetails) {
      setFormData({
        firstName: userDetails.firstName || "",
        lastName: userDetails.lastName || "",
        phone: userDetails.phone || "",
        gender: userDetails.gender || "",
        email: userDetails.email || "",
        preferredSize: userDetails.preferredSize || "",
        birthday: {
          month: userDetails.birthday?.month || "1",
          day: userDetails.birthday?.day || "1",
          year: userDetails.birthday?.year || "2000",
        },
      });
    }
  }, [userDetails]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name in formData.birthday) {
      setFormData({
        ...formData,
        birthday: { ...formData.birthday, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSizeSelect = (size: string) => {
    setFormData({ ...formData, preferredSize: size });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      alert("Profile updated successfully!");
    } catch {
      alert("Error updating profile.");
    }
  };

  if (isLoading) return <div className="text-center">Loading profile...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Error loading profile data.
      </div>
    );

  return (
    <div className="justify-top flex min-h-screen flex-col items-center p-6">
      <div className="w-full max-w-xl rounded-lg bg-white p-6">
        <h2 className="mb-8 text-center text-2xl font-semibold">Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">First name*</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last name*</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border p-2"
              />
            </div>
          </div>

          {/* Phone & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Phone*</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Gender*</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border p-2"
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="NON_BINARY">Non-binary</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Email (disabled) */}
          <div>
            <label className="block text-sm font-medium">Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="mt-1 w-full rounded-md border bg-gray-100 p-2"
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium">Birthday</label>
            <div className="mt-2 grid grid-cols-3 gap-4">
              <select
                name="month"
                value={formData.birthday.month}
                onChange={handleChange}
                className="rounded-md border p-2"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                name="day"
                value={formData.birthday.day}
                onChange={handleChange}
                className="rounded-md border p-2"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                name="year"
                value={formData.birthday.year}
                onChange={handleChange}
                className="rounded-md border p-2"
              >
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Preferred Size */}
          <div>
            <label className="block text-sm font-medium">Preferred Size</label>
            <div className="flex items-center space-x-2 overflow-x-auto rounded-md border p-2">
              {["2", "4", "6", "8", "10", "12", "14", "16", "18"].map(
                (size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeSelect(size)}
                    className={`rounded-md border px-4 py-2 ${
                      formData.preferredSize === size
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {size}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Buttons */}
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
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
