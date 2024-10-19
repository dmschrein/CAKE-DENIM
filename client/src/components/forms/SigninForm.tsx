// src/components/forms/SigninForm.tsx

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
  handleClose: () => void;
  onCreateAccountClick: () => void;
}

// Container component for the form with styling
interface AuthFormContainerProps {
  children: ReactNode;
  title: string;
  onSubmit?: DOMAttributes<HTMLFormElement>["onSubmit"];
}

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
  label?: string;
  value?: string;
  placeholder?: string;
  name: string;
}

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
export function SigninForm({ handleClose, onCreateAccountClick }: SigninFormProps) {
  const { data: session } = useSession(); // Retrieve session data to check if user is logged in
  const [message, setMessage] = useState(""); // Store message for user feedback
  const [userInfo, setUserInfo] = useState({ email: "", password: "" }); // Store user input for email and password

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

  return (
    <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
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
          <AuthInput
            name="email"
            type="email"
            label="Email"
            placeholder="youremail@example.com"
            value={userInfo.email}
            onChange={handleChange}
          />
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
          <div className="mt-4 text-center">
            <Link href="#" className="text-sm text-blue-950 underline">
              Forgot password?
            </Link>
            <br />
            <button
              onClick={onCreateAccountClick}
              className="text-sm text-gray-500 underline"
            >
              Create an account
            </button>
          </div>
          {error && <p>Error fetching user data.</p>}{" "}
          {/* Display error if data fetching fails */}
        </AuthFormContainer>
        {/* Display message if provided */}
        {message && <p className="text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
}
