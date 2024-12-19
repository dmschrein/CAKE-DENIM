"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SigninFormCommon from "../forms/SigninFormCommon";
import Modal from "./Modal";
import CreateAccountForm from "../forms/CreateAccountForm";
import { useCreateUserMutation } from "@/state/api";

interface SignInFormContainerProps {
  callbackUrl?: string;
  onSignInSuccess?: () => void;
}

const SignInFormContainer: React.FC<SignInFormContainerProps> = ({
  callbackUrl = "/account",
  onSignInSuccess,
}) => {
  const [activeForm, setActiveForm] = useState<"signin" | "createAccount">(
    "signin",
  );
  const [showModal, setShowModal] = useState(true);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(true);
  const router = useRouter();

  const handleSignIn = async (userInfo: {
    email: string;
    password: string;
  }) => {
    try {
      const result = await signIn("credentials", {
        email: userInfo.email,
        password: userInfo.password,
        redirect: false, // Prevent automatic redirect
      });

      if (result?.error) {
        throw new Error("User not found. Please check your email or password.");
      }

      if (onSignInSuccess) {
        onSignInSuccess();
      }
      router.push(callbackUrl);
    } catch (error) {
      throw error; // Pass the error back to SigninFormCommon
    }
  };

  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();

  const handleCreateAccount = async (userInfo: {
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    userType: string;
  }) => {
    try {
      // Ensure emails match
      if (userInfo.email !== userInfo.confirmEmail) {
        throw new Error("Emails do not match.");
      }

      // Ensure passwords match
      if (userInfo.password !== userInfo.confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      // Create the user
      const { email, password, firstName, lastName } = userInfo;
      await createUser({
        email,
        confirmEmail: userInfo.confirmEmail,
        password,
        confirmPassword: userInfo.confirmPassword,
        firstName,
        lastName,
        userType: "REGISTERED",
      }).unwrap();

      // Automatically sign in after account creation
      await handleSignIn({ email, password });
    } catch (error: any) {
      console.error("Failed to create account:", error.message);
    }
  };

  const handleSwitchToCreateAccount = () => {
    setActiveForm("createAccount");
  };

  const handleSwitchToSignIn = () => {
    setActiveForm("signin");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {activeForm === "signin" ? (
        <SigninFormCommon
          formTitle="Sign in for a faster checkout"
          handleSignIn={handleSignIn}
          handleCreateAccountClick={handleSwitchToCreateAccount}
        />
      ) : (
        <CreateAccountForm
          formTitle="Create An Account"
          handleCreateAccount={handleCreateAccount}
          handleClose={handleSwitchToSignIn}
          callBackUrl={callbackUrl}
        />
      )}
    </div>
  );
};

export default SignInFormContainer;
