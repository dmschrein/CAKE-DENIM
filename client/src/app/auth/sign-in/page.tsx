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
import { useCart } from "@/providers/CartProvider";
import { CartItem } from "../../../../interfaces";

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
      <h1 className="text-3xl text-gray-800">{title}</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </div>
  );
};

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
        className="w-full rounded border border-gray-600 bg-none p-2"
        placeholder={placeholder}
        value={value}
        name={name}
        {...rest}
      />
    </div>
  );
};

const SignIn = () => {
  const { items } = useCart();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  return (
    <div className="flex min-h-screen items-start justify-center space-x-10 p-5">
      {/* Login options */}
      <div className="flex flex-col space-x-10 md:flex-row">
        {/* Guest Checkout */}
        <AuthFormContainer title="Continue as guest">
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
        </AuthFormContainer>

        {/* Sign In Checkout */}
        <AuthFormContainer
          title="Sign in for faster checkout"
          onSubmit={async (e) => {
            e.preventDefault();
            await signIn("credentials", {
              ...userInfo,
              callbackUrl: "/checkout",
            });
          }}
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
            Sign in
          </button>
          <div className="mt-4">
            <a href="#" className="text-sm text-blue-950 underline">
              Forgot password?
            </a>
          </div>
        </AuthFormContainer>
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
    </div>
  );
};

export default SignIn;
