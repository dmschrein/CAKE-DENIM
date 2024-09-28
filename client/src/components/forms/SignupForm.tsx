import React, { useState } from "react";
import { Button } from "../ui/button";

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
    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
      {/* If the form has been submitted, show confirmation */}
      {submitted ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Thank you for signing up!
          </h2>
          <p className="text-gray-500">
            A confirmation email has been sent to {email}.
          </p>
        </div>
      ) : (
        <>
          {/* Image section */}
          <div className="flex justify-center mb-4">
            <img
              src="/assets/cakebabe.png"
              alt="Signup"
              className="w-full rounded-t-lg object-cover"
            />
          </div>

          {/* Heading */}
          <h2 className="text-xl font-semibold text-center mb-2">
            10% off your first order when you join our VIP club
          </h2>

          {/* Subtitle */}
          <p className="text-gray-500 text-center mb-6">
            Sign up to get weekly updates on sales, new drops, and look ideas.
          </p>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
              required
            />
            {error && (
              <p className="text-red-500 text-sm">Please enter a valid email</p>
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
          <div className="flex justify-center space-x-4 mt-4">
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
