import React, { useState } from "react";
import { Button } from "../ui/button";
import { AiOutlineClose } from "react-icons/ai";
import { useCreateUserMutation } from "@/state/api";
import {signIn} from "next-auth/react";

interface CreateAccountFormProps {
  handleClose: () => void;
}

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  handleClose,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [submitted] = useState(false);
  const [error, setError] = useState(false);

  const [createUser, { isLoading, isError }] = useCreateUserMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      email,
      confirmEmail,
      password,
      confirmPassword,
      firstName,
      lastName,
    } = formData;

    // Validate inputs
    if (
      !email ||
      email !== confirmEmail ||
      password.length < 7 ||
      password !== confirmPassword ||
      !firstName ||
      !lastName
    ) {
      setError(true);
      return;
    }

    setError(false);
    try {
      const userType = "REGISTERED";
      await createUser({
        email,
        password,
        firstName,
        lastName,
        userType,
      }).unwrap();
      // Immediately sign the user in and redirect them to /account
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/account",
      });
      
      handleClose();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {submitted ? (
        <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <button
            className="absolute right-4 top-4 text-gray-600 hover:text-black"
            onClick={handleClose}
          >
            <AiOutlineClose size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Account Created!</h2>
            <p className="text-gray-500">
              A confirmation email has been sent to {formData.email}.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <button
            className="absolute right-4 top-4 text-gray-600 hover:text-black"
            onClick={handleClose}
          >
            <AiOutlineClose size={24} />
          </button>

          <h2 className="text-center text-2xl font-semibold">
            Create an account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name*"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name*"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3"
              required
            />
            <input
              type="email"
              name="confirmEmail"
              placeholder="Confirm Email*"
              value={formData.confirmEmail}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password*"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password*"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3"
              required
            />
            {error && (
              <p className="text-red-500">
                Please make sure all fields are correctly filled.
              </p>
            )}
            <Button type="submit" className="w-full bg-black p-3 text-white">
              {isLoading ? "Creating Account..." : "Create an account"}
            </Button>
          </form>
          {isError && (
            <p className="text-red-500">
              Error creating account. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateAccountForm;
