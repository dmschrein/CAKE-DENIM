// src/components/forms/SigninForm.tsx - Sign In modal

import {
  useState,
  useEffect,
  FC,
  ReactNode,
  DOMAttributes,
  InputHTMLAttributes,
  ChangeEventHandler,
} from "react";
import { AiOutlineClose } from "react-icons/ai";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useGetUserByEmailQuery } from "@/state/api";

// Define properties for SigninForm component
interface SigninFormProps {
  handleClose: () => void; // function to close the modal
  onCreateAccountClick: () => void; // function to handle account creation flow
}

// Props for the AuthFormContainer (reusable form wrapper component)
interface AuthFormContainerProps {
  children: ReactNode; // Content of the form (input fields, buttons, etc.)
  title: string; // title to display at the top of the form
  onSubmit?: DOMAttributes<HTMLFormElement>["onSubmit"]; // Submit handler for the form
}

// Reusable container for the form with styling
const AuthFormContainer: FC<AuthFormContainerProps> = ({
  children,
  title,
  onSubmit,
}) => {
  return (
    <div className="space-y-6 bg-white p-10 shadow-md">
      <h1 className="text-center text-xl text-gray-800">{title}</h1>
      <form onSubmit={onSubmit}>{children}</form>
    </div>
  );
};

// Define properties for the input fields in the form
interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Label for input field
  value?: string;// Value of the input
  placeholder?: string; // Placeholder text for the input
  name: string; // Name attribute for the input
}

// Reusable input field component with label and styling
const AuthInput: FC<AuthInputProps> = ({
  label,
  placeholder,
  value,
  name,
  ...rest
}) => {
  return (
    <div>
      <label className="text-sm text-gray-800" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        className="w-full rounded border border-gray-600 p-2"
        placeholder={placeholder}
        value={value}
        name={name}
        {...rest}
      />
    </div>
  );
};

// Main component for the sign-in form
export function SigninForm({ handleClose }: SigninFormProps) {
  const { data: session } = useSession(); // Retrieve session data to check if user is logged in
  const [message, setMessage] = useState(""); // feedback message for user
  const [userInfo, setUserInfo] = useState({ email: "", password: "" }); // State for user input for email and password
  const [_showCreateAccountModal, setShowCreateAccountModal] = useState(false); // Track visibility of account creation modal

  // Fetch user data based on email input
  const { error, isLoading } = useGetUserByEmailQuery(userInfo.email, {
    skip: !userInfo.email,
  });

  // Handle input change and update userInfo state
  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  // Show a success message and close the form when the user signs in
  useEffect(() => {
    if (session) {
      setMessage("You have successfully signed in!");
      setTimeout(() => {
        setMessage("");
        handleClose(); // Close the modal after 2 seconds
      }, 2000);
    }
  }, [session, handleClose]);

  // Handle the sign-in process using NextAuth
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions while loading

    await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      callbackUrl: "/account", // Redirect to the account page upon success
    });
  };

  // Open the account creation modal (currently not implemented)
  const handleCreateAccount = () => {
    console.log("Create Account button clicked");
    setShowCreateAccountModal(true);
  };

  return (
    <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
      {/* Close button for the modal */}
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 text-gray-600 hover:text-black"
      >
        <AiOutlineClose size={24} />
      </button>

      {/* Form Container */}
      <div className="space-y-6">
        <AuthFormContainer
          title="Check your order status, create a return, start an exchange, or update your account."
          onSubmit={handleSignIn} // Trigger handleSignIn on form submission
        >
          {/* Email input */}
          <AuthInput
            name="email"
            type="email"
            label="Email"
            placeholder="youremail@example.com"
            value={userInfo.email}
            onChange={handleChange}
          />
          {/* Password input */}
          <AuthInput
            name="password"
            type="password"
            label="Password"
            placeholder="Password"
            value={userInfo.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-black p-3 text-white hover:bg-gray-900"
          >
            {isLoading ? "Loading..." : "Sign in"}
          </button>
          {/* Links for forgot password and account creation */}
          <div className="mt-4 text-center">
            <Link href="#" className="text-sm text-blue-950 underline">
              Forgot password?
            </Link>
            <br />
            <button
              onClick={handleCreateAccount}
              className="text-sm text-gray-500 underline"
            >
              Create an account
            </button>
          </div>
          {error && <p>Error fetching user data.</p>}{" "}
          {/* Display error if data fetching fails */}
        </AuthFormContainer>
        {/* Success message */}
        {message && <p className="text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
}
