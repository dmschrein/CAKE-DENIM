"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SigninFormCommon from "../forms/SigninFormCommon";
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
  const [signInError, setSignInError] = useState<string | undefined>(undefined); // ✅ Change null to undefined
  const [createAccountError, setCreateAccountError] = useState<
    string | undefined
  >(undefined); // ✅ Change null to undefined
  const [activeForm, setActiveForm] = useState<"signin" | "createAccount">(
    "signin",
  );
  const router = useRouter();

  const handleSignIn = async (userInfo: {
    email: string;
    password: string;
  }) => {
    try {
      setSignInError(undefined);

      const result = await signIn("credentials", {
        email: userInfo.email,
        password: userInfo.password,
        redirect: false, // Prevent automatic redirect
      });

      if (result?.error) {
        setSignInError("User not found. Please check your email or password.");
        return;
      }

      if (onSignInSuccess) {
        onSignInSuccess();
      }
      router.push(callbackUrl);
    } catch (error) {
      setSignInError("Somthing went wrong. Please try again.");
    }
  };

  const [createUser] = useCreateUserMutation();

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
      setCreateAccountError(undefined); // ✅ Clear error before attempting sign-up
      // Ensure emails match
      if (userInfo.email !== userInfo.confirmEmail) {
        setCreateAccountError("Emails do not match.");
      }

      // Ensure passwords match
      if (userInfo.password !== userInfo.confirmPassword) {
        setCreateAccountError("Passwords do not match.");
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

      console.log("🟢 User created successfully. Proceeding to sign in...");

      // Automatically sign in after account creation
      await handleSignIn({ email, password });
    } catch (error: any) {
      setCreateAccountError("Failed to create account. Please try again.");
    }
  };

  const handleSwitchToCreateAccount = () => {
    setActiveForm("createAccount");
  };

  const handleSwitchToSignIn = () => {
    setActiveForm("signin");
  };

  return (
    <div>
      {activeForm === "signin" ? (
        <SigninFormCommon
          formTitle="Sign in for a faster checkout"
          handleSignIn={handleSignIn}
          handleCreateAccountClick={handleSwitchToCreateAccount}
          signInError={signInError}
          onInputChange={() => setSignInError(undefined)}
        />
      ) : (
        <CreateAccountForm
          formTitle="Create An Account"
          handleCreateAccount={handleCreateAccount}
          handleClose={handleSwitchToSignIn}
          callBackUrl={callbackUrl}
          createAccountError={createAccountError} // ✅ Pass error state
          onInputChange={() => setCreateAccountError(undefined)} // ✅ Clear error when user types
        />
      )}
    </div>
  );
};

export default SignInFormContainer;
