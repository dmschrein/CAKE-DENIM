"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import {
  ChangeEventHandler,
  DOMAttributes,
  FC,
  InputHTMLAttributes,
  useState,
  ReactNode,
} from "react";
import { useCart } from "@/providers/CartProvider"; // custom hook to access cart data
import { useGetUserByEmailQuery } from "@/state/api"; // custom hook for fetching user data by email
import Link from "next/link";
import SigninFormCommon from "@/components/forms/SigninFormCommon";
import CreateAccountForm from "@/components/forms/CreateAccountForm";
import GuestSigninForm from "@/components/forms/GuestSigninForm";

// Props interface for AuthFormContainer component
interface AuthFormContainerProps {
  children: ReactNode;
  title: string;
  onSubmit?: DOMAttributes<HTMLFormElement>["onSubmit"];
}

// Component to create a form container with a title and submit handling
const AuthFormContainer: FC<AuthFormContainerProps> = ({
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
        className="w-full rounded border border-gray-600 bg-none p-2"
        placeholder={placeholder}
        value={value}
        name={name}
        {...rest} // spread the remaining input attributes here
      />
    </div>
  );
};

// Main SigIn component to handle user sign-in and display cart details
const SignIn = () => {
  const { items } = useCart(); // Retrieve cart items using custom hook
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  // useState for mananging user input in sign-in form
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  // Custom hook to fetch user data by email when email changes
  const {
    data: user,
    error,
    isLoading,
  } = useGetUserByEmailQuery(userInfo.email, { skip: !userInfo.email });

  // Handle input change and update userInfo state
  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  // Handle form submission for signing in the user
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return; // Prevent submission if loading

    if (error) {
      console.error("Error fetching user data: ", error);
      alert("An error occurred while fetching user data. Please try again.");
      return;
    }
    if (!user) {
      alert("User not found. Please check your email or sign up.");
      return;
    }
    await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      callbackUrl: "/checkout", // redirect after sign-in
    });
  };
  const handleCreateAccount = () => {
    console.log("Create Account button clicked");
    setShowSigninModal(false);
    setShowCreateAccountModal(true);
  };

  return (
    <div className="flex min-h-screen items-start justify-center space-x-10 p-5">
      {/* Login options */}
      <div className="flex flex-col space-x-10 md:flex-row">
        {/* Guest Checkout */}
        <GuestSigninForm />
        {/* <AuthFormContainer title="Continue as guest">
          <AuthInput
            name="guestEmail"
            type="email"
            label="Email"
            placeholder="youremail@example.com"
            onChange={handleChange}
          />
          <div>
            <input type="checkbox" id="newsletter" className="mr-2" />
            <label htmlFor="newsletter" className="text-sm text-blue-950">
              Get in on top-secret CAKE DENIM news and other cool stuff.
            </label>
          </div>
          <button
            type="button"
            className="w-full rounded bg-black p-2 text-white"
          >
            Continue as guest
          </button>
        </AuthFormContainer> */}

        {/* Sign In Checkout */}
        <SigninFormCommon
          formTitle="Sign in for a faster checkout"
          callBackUrl="/checkout"
        />
        {/* <AuthFormContainer
          title="Sign in for faster checkout"
          onSubmit={handleSignIn}
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
            placeholder=""
            value={userInfo.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full rounded bg-black p-2 text-white"
          >
            {isLoading ? "Loading..." : "Sign in"}
          </button>
          <div className="mt-8 flex justify-between">
            <Link href="#" className="text-blue-950 underline">
              Forgot password?
            </Link>

            <button
              onClick={handleCreateAccount}
              className="text-blue-950 underline"
            >
              Create an account
            </button>
          </div>

          {error && <p>Error fetching user data.</p>}
        </AuthFormContainer> */}
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
              <p>{item.product.category}</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <CreateAccountForm
            handleClose={() => setShowCreateAccountModal(false)} // close the create modal account
          />
        </div>
      )}
    </div>
  );
};

export default SignIn;
