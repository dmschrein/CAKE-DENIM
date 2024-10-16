"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import cakebabe from "@/assets/cakebabe.png";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false); // Track form submission
  const [error, setError] = useState(false); // Track if there's an error

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(true);
      return;
    }
    setError(false);

    // Simulate email submission request (replace with actual API call)
    setTimeout(() => {
      console.log("Email submitted:", email);
      setSubmitted(true); // Set to true to show confirmation message
    }, 1000);
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
            <Image
              src={cakebabe}
              width={748}
              height={850}
              alt="Signup"
              className="w-full rounded-t-lg object-cover"
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
              placeholder="Your email"
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
            >
              I’m in!
            </Button>
          </form>

          {/* Social icons */}
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-black hover:text-gray-600">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-black hover:text-gray-600">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-black hover:text-gray-600">
              <i className="fab fa-pinterest"></i>
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default SignupForm;
