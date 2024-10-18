import React, {
  ChangeEventHandler,
  FC,
  ReactNode,
  DOMAttributes,
  useState,
  InputHTMLAttributes,
} from "react";
import {
  useGetUserByEmailQuery,
  useCreateGuestUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/state/api";
import { signIn, useSession } from "next-auth/react";

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

const GuestSigninForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    newsletterOptIn: false,
  });
  const [submitted, setSubmitted] = useState(false);
  // const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [error, setError] = useState(false);

  // Fetch user by email if it exists
  const { data: user, refetch } = useGetUserByEmailQuery(formData.email, {
    skip: !formData.email,
  });

  // Mutation hook to create a new guest user
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();

  const [updateUserMutation] = useUpdateUserMutation();
  const { data: session } = useSession();

  // Handle input change and update the email state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle guest login or account creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, newsletterOptIn } = formData;

    console.log("Guest form submitted with email: ", email);

    // validate email input
    if (!email) {
      setError(true);
      console.log("Error: No email provided");
      return;
    }
    setError(false);

    try {
      await refetch(); // Refetch user info based on entered email
      // if the user opted in to newletter, create user with userType: OPT_IN
      let userType: "EMAIL_ONLY" | "GUEST";
      // if user opts in for the newsletter, set userType to EMAIL_ONLY
      if (newsletterOptIn) {
        userType = "EMAIL_ONLY";
      } else {
        userType = "GUEST";
      }
      // if the user exists, sign them in
      if (user) {
        console.log("Guest user found, signing in...");
        // TODO: add update user for cases where a user is a stored guest user and wants to opt int
        if (user.userType === "GUEST" && newsletterOptIn) {
          // update the user to "EMAIL_ONLY"
          console.log("Updating user to EMAIL_ONLY...");
          await updateUserMutation({
            userId: user.userId,
            userType: "EMAIL_ONLY",
          }).unwrap();
          console.log("User updated to EMAIL_ONLY");
        }
        // Sign in the user
        await signIn("credentials", {
          email,
          callbackUrl: "/checkout",
        });
      } else {
        // If no user is found, create a new guest or email only user
        console.log("Attempting to create guest or email-only user...");
        const result = await createUser({
          email,
          userType,
        }).unwrap();
        console.log("Guest user created successfully: ", result);
        setSubmitted(true);
        // Immediately sign the user in and redirect them to /checkout
        await signIn("credentials", {
          email,
          callbackUrl: "/checkout",
        });
      }
    } catch (error) {
      console.error("Guest user sign up failed!", error);
    }
  };

  return (
    <AuthFormContainer title="Continue as guest">
      <AuthInput
        name="email" // must match formData
        type="email"
        label="Email"
        placeholder="youremail@example.com"
        value={formData.email}
        onChange={handleChange}
      />
      <div>
        <input
          type="checkbox"
          id="newsletter"
          className="mr-2"
          checked={formData.newsletterOptIn}
          onChange={() =>
            setFormData({
              ...formData,
              newsletterOptIn: !formData.newsletterOptIn,
            })
          }
        />
        <label htmlFor="newsletter" className="text-sm text-blue-950">
          Get in on top-secret CAKE DENIM news and other cool stuff.
        </label>
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full rounded bg-black p-2 text-white"
        disabled={isCreatingUser}
      >
        {isCreatingUser ? "Creating Guest..." : "Continue as guest"}
      </button>
    </AuthFormContainer>
  );
};

export default GuestSigninForm;
