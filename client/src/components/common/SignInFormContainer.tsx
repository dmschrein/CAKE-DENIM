"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SigninFormCommon from "../forms/SigninFormCommon";
import Modal from "./Modal";
import CreateAccountForm from "../forms/CreateAccountForm";

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

  const handleCreateAccountClick = () => {
    setShowCreateAccountModal(true);
  };

  return (
    <div>
      {showSignInModal && (
        <SigninFormCommon
          formTitle="Sign in for a faster checkout"
          handleSignIn={handleSignIn}
          handleCreateAccountClick={handleCreateAccountClick}
        />
      )}
      {/* Modal for Create Account */}
      {showCreateAccountModal && (
        <Modal
          isOpen={showCreateAccountModal}
          handleClose={() => setShowCreateAccountModal(false)}
        >
          <CreateAccountForm
            formTitle="Create An Account"
            handleClose={() => setShowCreateAccountModal(false)}
            callBackUrl={callbackUrl}
          />
        </Modal>
      )}
    </div>
  );
};

export default SignInFormContainer;
