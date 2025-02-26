"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/providers/CartProvider"; // custom hook to access cart data
import CreateAccountForm from "@/components/forms/CreateAccountForm";
import GuestSigninForm from "@/components/forms/GuestSigninForm";
import Modal from "@/components/common/Modal";
import SignInFormContainer from "@/components/common/SignInFormContainer";
import { NewUser } from "shared/src/interfaces";

// Component to create labeled input fields for forms

// Main SigIn component to handle user sign-in and display cart details
const SignIn = () => {
  const { items } = useCart(); // Retrieve cart items using custom hook
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);

  const callbackUrl = "/checkout"; // TODO: Update once sign-in page is used other places

  return (
    <div className="flex min-h-screen items-start justify-center space-x-10 p-5">
      {/* Login options */}
      <div className="flex flex-col space-x-10 md:flex-row">
        {/* Guest Checkout */}
        <GuestSigninForm />

        {/* Sign In Checkout */}
        <SignInFormContainer callbackUrl="/checkout" />
      </div>

      {/* Cart Details */}
      <div className="w-72 bg-white p-10 shadow-md">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.product.productId} className="mb-4">
              <Image
                src={item.product.imageURL}
                alt={item.product.name}
                width={80}
                height={80}
              />
              <p>{item.product.name}</p>
              <p>{item.product.description}</p>
              <p>{item.product.primaryCategory}</p>
              <p>Quantity: {item.count}</p>
              <p>Price: ${item.product.price}</p>
              <p>Total: ${item.product.price * item.count}</p>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      {/* Create Account Modal */}
      {showCreateAccountModal && (
        <Modal
          isOpen={showCreateAccountModal}
          handleClose={() => setShowCreateAccountModal(false)}
        >
          <CreateAccountForm
            formTitle="Create An Account"
            handleClose={() => setShowCreateAccountModal(false)} // close the create modal account
            callBackUrl={callbackUrl}
            handleCreateAccount={function (_formData: NewUser): void {
              throw new Error("Function not implemented.");
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default SignIn;
