import React, {
  useState,
  FC,
  ReactNode,
  DOMAttributes,
  InputHTMLAttributes,
} from "react";
import {
  useGetUserByEmailQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/state/api";
import { signIn } from "next-auth/react";

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
  console.log("⭐️ Guest SignIn Form Starts");
  const [formData, setFormData] = useState({
    email: "",
    newsletterOptIn: false,
  });
  const [_submitted, setSubmitted] = useState(false);
  const [_error, setError] = useState(false);

  // Fetch user by email if it exists
  const {
    data: user,
    error: userError,
    isLoading,
    isFetching,
  } = useGetUserByEmailQuery(formData.email, {
    skip: !formData.email,
  });

  // Mutation hooks for creating and updating users
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [updateUserMutation] = useUpdateUserMutation();

  // Handle input change and update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle checkbox change for newsletterOptIn
  const handleCheckboxChange = () => {
    console.log("⭐️ Handling checkbox change");

    setFormData({
      ...formData,
      newsletterOptIn: !formData.newsletterOptIn, // toggle the value
    });
  };

  // Handle guest login or account creation
  const handleSubmit = async (e: React.FormEvent) => {
    console.log();
    e.preventDefault();
    const { email, newsletterOptIn } = formData;

    console.log("⭐️ Guest form submitted with email: ", email);

    // validate email input
    if (!email) {
      setError(true);
      console.log("⭐️Error: No email provided");
      return;
    }
    setError(false);

    try {
      if (isLoading || isFetching) {
        console.log("⭐️User data is still loading...");
        return;
      }
      if (userError) {
        console.error("⭐️Error fetching user data: ", userError);
        return;
      }
      let userType: "EMAIL_ONLY" | "GUEST";

      // Set the userType based on newsletterOptIn checkbox
      if (newsletterOptIn) {
        userType = "EMAIL_ONLY";
      } else {
        userType = "GUEST";
      }

      // if the user exists, sign them in
      console.log("⭐️ Guest userType: ", userType);
      if (user) {
        console.log("⭐️ Guest user found, signing in...");

        // Update user if they opt-in for the newsletter
        if (user.userType === "GUEST" && newsletterOptIn) {
          console.log("⭐️ Updating user to EMAIL_ONLY...");
          await updateUserMutation({
            userId: user.userId,
            userType: "EMAIL_ONLY",
          }).unwrap();
          console.log("⭐️ User updated to EMAIL_ONLY");
        }

        // Sign in the user
        await signIn("credentials", {
          email,
          callbackUrl: "/checkout",
        });
      } else {
        // If no user is found, create a new guest or email-only user
        console.log("⭐️ Creating guest or email-only user...");
        const result = await createUser({
          email,
          confirmEmail: email,
          password,
          confirmPassword,
          userType,
        }).unwrap();
        console.log("⭐️ Guest user created successfully: ", result);
        setSubmitted(true);

        // Immediately sign the user in and redirect them to /checkout
        await signIn("credentials", {
          email,
          callbackUrl: "/checkout",
        });
      }
    } catch (error) {
      console.error("⭐️🛑 Guest user sign up failed!", error);
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
          onChange={handleCheckboxChange} // Handle checkbox toggle
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
