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
      // hide the sign in modal and redirect to the account page
      setShowSignInModal(false);
      if (onSignInSuccess) {
        onSignInSuccess();
      }
      router.push(callbackUrl);
    } catch (error) {
      throw error; // Pass the error back to SigninFormCommon
    }
  };

  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();

  const [formValid, setFormValid] = useState(false);

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
      const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        confirmEmail,
      } = userInfo;
      await createUser({
        email,
        confirmEmail,
        password,
        confirmPassword,
        firstName,
        lastName,
        userType: "REGISTERED",
      }).unwrap();

      // Automatically sign in after account creation
      await handleSignIn({ email, password });

      // Close modals
      setShowCreateAccountModal(false);
    } catch (error: any) {
      console.error("Failed to create account:", error.message);
    }
  };

  const handleCloseAllModals = () => {
    setShowSignInModal(false);
    setShowCreateAccountModal(false);
  };

  const handleCreateAccountClick = () => {
    setShowCreateAccountModal(true);
  };

  return (
    <div>
      {showSignInModal && (
        <Modal isOpen={showSignInModal} handleClose={handleCloseAllModals}>
          <SigninFormCommon
            formTitle="Sign in for a faster checkout"
            handleSignIn={handleSignIn}
            handleCreateAccountClick={handleCreateAccountClick}
          />
        </Modal>
      )}
      {/* Modal for Create Account */}
      {showCreateAccountModal && (
        <Modal
          isOpen={showCreateAccountModal}
          handleClose={handleCloseAllModals}
        >
          <CreateAccountForm
            formTitle="Create An Account"
            handleCreateAccount={handleCreateAccount}
            handleClose={() => setShowCreateAccountModal(false)}
            callBackUrl={callbackUrl}
          />
        </Modal>
      )}
    </div>
  );
};

export default SignInFormContainer;
