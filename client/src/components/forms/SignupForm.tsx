// client/src/components/forms/SignupForm.tsx -
"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useCreateUserMutation } from "@/state/api";
import CustomImage from "../common/CustomImage";

interface SignUpFormProps {
  handleClose: () => void;
}

const SignupForm: React.FC<SignUpFormProps> = ({ handleClose }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false); // Track form submission
  const [error, setError] = useState(false); // Track if there's an error

  const [createUser, { isLoading, isError }] = useCreateUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with email: ", email);

    if (!email) {
      setError(true);
      console.log("Error: No email provided");
      return;
    }
    setError(false);
    try {
      console.log("Attempting to create user...");
      const result = await createUser({
        email,
        userType: "EMAIL_ONLY",
      }).unwrap();
      console.log("User created successfully: ", result);
      setSubmitted(true);
      console.log("handleClose: ", handleClose);
      if (typeof handleClose === "function") {
        handleClose();
      } else {
        console.error("handleClose is not a function or missing");
      }
    } catch (error) {
      console.error("Oops! Sign up failed!", error);
      setError(true);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
      {/* If the form has been submitted, show confirmation */}
      {submitted ? (
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">
            Thank you for signing up!
          </h2>
          <p className="text-gray-500">
            A confirmation email has been sent to {email}.
          </p>
        </div>
      ) : (
        <>
          {/* Image section */}
          <div className="mb-4 flex justify-center">
            <CustomImage
              src={
                "https://s3-cakedenim.s3.us-west-1.amazonaws.com/cakebabe.png"
              }
              fallbackSrc="/assets/cakebabe.png"
              width={748}
              height={850}
              alt="Signup"
            />
          </div>

          {/* Heading */}
          <h2 className="mb-2 text-center text-xl font-semibold">
            10% off your first order when you join our VIP club
          </h2>

          {/* Subtitle */}
          <p className="mb-6 text-center text-gray-500">
            Sign up to get weekly updates on sales, new drops, and look ideas.
          </p>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border p-3 ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
              required
            />
            {error && (
              <p className="text-sm text-red-500">Please enter a valid email</p>
            )}

            <Button
              variant="default"
              size="lg"
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "I’m in!"}
            </Button>
          </form>

          {/* Social icons */}
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-black hover:text-gray-600">
              <i className="fab fa-facebook">Facebook</i>
            </a>
            <a href="#" className="text-black hover:text-gray-600">
              <i className="fab fa-twitter">Twitter</i>
            </a>
            <a href="#" className="text-black hover:text-gray-600">
              <i className="fab fa-pinterest">Pinterest</i>
            </a>
          </div>
          {isError && (
            <p className="text-red-500">Error Signing up. Please try again.</p>
          )}
        </>
      )}
    </div>
  );
};

export default SignupForm;
