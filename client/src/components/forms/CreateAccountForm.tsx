import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Button } from "../ui/button";
import { NewUser } from "@/interfaces";

type TouchedFields = {
  [K in keyof NewUser]: boolean;
};

interface CreateAccountFormProps {
  formTitle: string;
  handleClose: () => void;
  handleCreateAccount: (formData: NewUser) => void;
  callBackUrl?: string;
  createAccountError?: string; // ✅ Accept error
  onInputChange?: () => void; // ✅ Callback for clearing error
}

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  handleClose,
  handleCreateAccount,
  createAccountError,
  onInputChange, // ✅ Use this to clear errors
}) => {
  const [formData, setFormData] = useState<NewUser>({
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    userType: "REGISTERED",
  });

  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    email: false,
    confirmEmail: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
    userType: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [passwordEye, setPasswordEye] = useState(false);
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formValid, setFormValid] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    onInputChange?.(); // ✅ Clear error when user types
  };

  // Validate passwords match on input
  useEffect(() => {
    setPasswordsMatch(formData.password === formData.confirmPassword);
    const isValid =
      formData.email &&
      formData.confirmEmail &&
      formData.password &&
      formData.confirmPassword &&
      formData.firstName &&
      formData.lastName &&
      passwordsMatch;
    setFormValid(!!isValid);
  }, [formData, passwordsMatch]);

  // Handle field blur to track touched fields
  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  // Toggle password visibility
  const handlePasswordEye = () => setPasswordEye(!passwordEye);
  const handleConfirmPasswordEye = () =>
    setConfirmPasswordEye(!confirmPasswordEye);

  const handleCreateAccountClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      handleCreateAccount(formData);
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <button
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
          onClick={handleClose}
        >
          <AiOutlineClose size={24} />
        </button>

        <h2 className="text-center text-2xl font-semibold">
          Create An Account
        </h2>

        <form onSubmit={handleCreateAccountClick} className="mt-4 space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name*
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={() => handleBlur("firstName")}
              className={`w-full rounded-md border p-3 ${
                touchedFields["firstName"] && !formData.firstName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name*
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={() => handleBlur("lastName")}
              className={`w-full rounded-md border p-3 ${
                touchedFields["lastName"] && !formData.lastName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email*
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              className={`w-full rounded-md border p-3 ${
                touchedFields["email"] &&
                formData.email !== formData.confirmEmail
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Confirm Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Email*
            </label>
            <input
              type="email"
              name="confirmEmail"
              placeholder="Confirm Email"
              value={formData.confirmEmail}
              onChange={handleChange}
              onBlur={() => handleBlur("confirmEmail")}
              className={`w-full rounded-md border p-3 ${
                touchedFields["confirmEmail"] &&
                formData.email !== formData.confirmEmail
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password*
            </label>
            <input
              type={passwordEye ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              className="w-full rounded-md border border-gray-300 p-3"
              required
            />
            <div
              className="absolute right-3 top-10 cursor-pointer"
              onClick={handlePasswordEye}
            >
              {passwordEye ? <AiFillEye /> : <AiFillEyeInvisible />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password*
            </label>
            <input
              type={confirmPasswordEye ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur("confirmPassword")}
              className="w-full rounded-md border border-gray-300 p-3"
              required
            />
            <div
              className="absolute right-3 top-10 cursor-pointer"
              onClick={handleConfirmPasswordEye}
            >
              {confirmPasswordEye ? <AiFillEye /> : <AiFillEyeInvisible />}
            </div>
            {!passwordsMatch && (
              <p className="mt-1 text-sm text-red-500">
                Passwords do not match.
              </p>
            )}
          </div>

          {createAccountError && (
            <p className="mt-2 text-sm text-red-500">{createAccountError}</p> // ✅ Show error message
          )}

          <Button
            type="submit"
            className="w-full bg-black p-3 text-white"
            disabled={!formValid || isLoading}
          >
            {isLoading ? "Creating Account..." : "Create an Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountForm;
