// client/src/components/forms/SigninFormCommon.tsx
"use client";

import Link from "next/link";
import React, { useState } from "react";
import AuthFormContainer from "../common/AuthFormContainer";
import AuthInput from "../common/AuthInput";

type SigninFormProps = {
  formTitle: string;
  handleSignIn: (userInfo: { email: string; password: string }) => void;
  handleClose?: () => void;
  showCloseButton?: boolean;
  handleCreateAccountClick: () => void;
  signInError?: string;
  onInputChange?: () => void;
};

// Props interface for AuthInput component

const SigninFormCommon: React.FC<SigninFormProps> = ({
  formTitle,
  handleSignIn,
  handleCreateAccountClick,
  signInError,
  onInputChange,
}) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // handle input change and update userInfo state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
    onInputChange?.();
  };

  const handleSignInClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleSignIn(userInfo);
    } catch (error: any) {
      setErrorMessage(errorMessage || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message when creating an account
    console.log("handleCreateAccountClick:", handleCreateAccountClick);
    handleCreateAccountClick();
  };

  return (
    <>
      <AuthFormContainer title={formTitle} onSubmit={handleSignInClick}>
        <AuthInput
          name="email"
          type="email"
          label="Email"
          placeholder="youremail@example.com"
          value={userInfo.email}
          onChange={handleChange}
        />
        <AuthInput
          name="password"
          type="password"
          label="Password"
          placeholder="Your password"
          value={userInfo.password}
          onChange={handleChange}
        />
        {signInError && (
          <p className="mt-2 text-sm text-red-500">{signInError}</p>
        )}{" "}
        {/* ✅ Show error */}
        <button
          type="submit"
          className="w-full rounded bg-black p-2 text-white"
        >
          {isLoading ? "Loading..." : "Sign in"}
        </button>
        {/* Links */}
        <div className="mt-8 flex justify-between">
          <Link href="#" className="text-blue-950 underline">
            Forgot password?
          </Link>
          <button
            onClick={handleCreateAccount}
            className="text-blue-950 underline"
          >
            Create an account
          </button>
        </div>
      </AuthFormContainer>
    </>
  );
};

export default SigninFormCommon;
