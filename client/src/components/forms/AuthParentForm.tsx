import React, { useState } from "react";
import CreateAccountForm from "./CreateAccountForm";
import Modal from "../common/Modal";
import SigninFormCommon from "./SigninFormCommon";
import SignupForm from "./SignupForm";

const AuthParentForm: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeForm, setActiveForm] = useState<React.FC<any> | null>(null);
  const [showSigninModal, setShowSigninModal] = useState(false);
  console.log("AuthParentForm is rendered!");
  //Open modal with specific form
  const openModal = (form: React.FC<any>) => {
    setActiveForm(() => form);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setActiveForm(null);
    setShowModal(false);
  };

  return (
    <div>
      {/* Buttons to trigger the modal
      <button
        onClick={() => openModal(SigninFormCommon)}
        className="mr-4 rounded bg-blue-500 p-2 text-white"
      >
        Sign In
      </button>
      <button
        onClick={() => openModal(CreateAccountForm)}
        className="mr-4 rounded bg-green-500 p-2 text-white"
      >
        Create Account
      </button>
      <button
        onClick={() => openModal(SignupForm)}
        className="mr-4 rounded bg-purple-500 p-2 text-white"
      >
        Sign Up
      </button> */}

      {/* Conditional rendering  */}
      {showModal && (
        <Modal open={showModal} onClose={closeModal}>
          <SigninForm
            handleClose={() => setShowSigninModal(false)}
            onCreateAccountClick={handleCreateAccount} // if user clicks "Create Account" go to CreateAccountForm
          />
        </Modal>
      )}
    </div>
  );
};

export default AuthParentForm;
