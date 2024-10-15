import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

interface SigninFormProps {
  handleClose: () => void;
  onSignupClick: () => void;
}

export function SigninForm({ handleClose, onSignupClick }: SigninFormProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session) {
      setMessage("You have successfully signed in!");
      setTimeout(() => {
        setMessage("");
        handleClose();
      }, 2000);
    }
  }, [session, handleClose]);

  // Update sign in to use next auth
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      [e.target.email]: e.target.value,
      password: e.target.password.value,
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
      <div className="space-y-6">
        <h2 className="text-center text-lg font-semibold">
          Check your order status, create a return, start an exchange, or update
          your account.
        </h2>
        <form>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium">
                Email*
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium">
                Password*
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-black p-3 text-white hover:bg-gray-800"
          >
            Sign in
          </button>
          <div className="mt-4 text-center">
            <Link href="#" className="text-sm text-gray-500 underline">
              Forgot password?
            </Link>
            <br />
            <button
              onClick={onSignupClick}
              className="text-sm text-gray-500 underline"
            >
              Create an account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
