// client/src/components/forms/SigninFormCommon.tsx

import { useGetUserByEmailQuery } from "@/state/api";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, {
  ChangeEventHandler,
  DOMAttributes,
  InputHTMLAttributes,
  ReactNode,
  useState,
} from "react";
import CreateAccountForm from "./CreateAccountForm";
import Modal from "../common/Modal";

type SigninFormProps = {
  formTitle: string;
  callBackUrl: string;
  handleClose?: () => void;
  showCloseButton?: boolean;
  onCreateAccountClick: () => void;
};

// Props interface for AuthFormContainer component
interface AuthFormContainerProps {
  children: ReactNode;
  title: string;
  onSubmit?: DOMAttributes<HTMLFormElement>["onSubmit"];
}

// Component to create a form container with a title and submit handling
const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  children,
  title,
  onSubmit,
}) => {
  return (
    <div className="space-y-6 bg-white p-10 shadow-md">
      <h1 className="text-3xl text-gray-800">{title}</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </div>
  );
};

// Props interface for AuthInput component
interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value?: string;
  placeholder?: string;
  name: string;
}

// Component to create labeled input fields for forms
const AuthInput: React.FC<AuthInputProps> = ({
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
        className="w-full rounded border border-gray-600 bg-none p-2"
        placeholder={placeholder}
        value={value}
        name={name}
        {...rest} // spread the remaining input attributes here
      />
    </div>
  );
};

const SigninFormCommon: React.FC<SigninFormProps> = ({
  formTitle,
  callBackUrl,
  handleClose,
  onCreateAccountClick,
}) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Custom hook to fetch user data by email when email changes
  const {
    data: user,
    error,
    isLoading,
  } = useGetUserByEmailQuery(userInfo.email, { skip: !userInfo.email });

  // function to handle user signing in
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    if (error || !user) {
      setErrorMessage("User not found. Please check your email or sign up.");
      return;
    }

    try {
      await signIn("credentials", {
        email: userInfo.email,
        password: userInfo.password,
        callbackUrl: callBackUrl, // take user to check out if
      });
    } catch (err) {
      setErrorMessage("Error signing in. Please try again.");
    }
  };

  // handle input change and update userInfo state
  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
    setErrorMessage("");
  };

  return (
    <>
      <AuthFormContainer title={formTitle} onSubmit={handleSignIn}>
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
          placeholder="Your password"
          value={userInfo.password}
          onChange={handleChange}
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button
          type="submit"
          className="w-full rounded bg-black p-2 text-white"
        >
          {isLoading ? "Loading..." : "Sign in"}
        </button>

        {/* Links */}
        <div className="mt-8 flex justify-between">
          <Link href="#" className="text-blue-950 underline">
            Forgot password?
          </Link>
          <button
            onClick={onCreateAccountClick}
            className="text-blue-950 underline"
          >
            Create an account
          </button>
        </div>
      </AuthFormContainer>
    </>
  );
};

export default SigninFormCommon;
