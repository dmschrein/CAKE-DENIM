"use client";
import { signIn } from "next-auth/react";
import {
  ChangeEventHandler,
  DOMAttributes,
  FC,
  InputHTMLAttributes,
  ReactNode,
  useState,
} from "react";

interface AuthFormContainerProps {
  children: ReactNode;
  title: string;
  linkOne: { label?: string; href: string; title: string };
  linkTwo: { label?: string; href: string; title: string };
  onSubmit?: DOMAttributes<HTMLFormElement>["onSubmit"];
}

const AuthFormContainer: FC<AuthFormContainerProps> = ({
  linkOne,
  linkTwo,
  children,
  title,
  onSubmit,
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="w-96 space-y-6 bg-white p-10 shadow-md"
      >
        <h1 className="text-3xl text-gray-800">{title}</h1>
        {children}

        <div className="mt-10 space-y-2 text-sm text-gray-800">
          <div>
            {linkOne.label ? (
              <span className="mr-1">{linkOne.label}</span>
            ) : null}
            <a
              className="uppercase text-blue-500 underline"
              href={linkOne.href}
            >
              {linkOne.title}
            </a>
          </div>

          <div>
            {linkTwo.label ? (
              <span className="mr-1">{linkTwo.label}</span>
            ) : null}
            <a
              className="uppercase text-blue-500 underline"
              href={linkTwo.href}
            >
              {linkTwo.title}
            </a>
          </div>
        </div>
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

interface SubmitBtnProps {
  value?: string;
}

const SubmitBtn: FC<SubmitBtnProps> = ({ value }) => {
  return (
    <div>
      <input
        type="submit"
        value={value}
        className="w-full cursor-pointer rounded bg-blue-600 bg-none p-2 text-white outline-none transition-all hover:shadow-md"
      />
    </div>
  );
};

const SignIn = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value } = target;

    setUserInfo({ ...userInfo, [name]: value });
  };

  return (
    <AuthFormContainer
      onSubmit={async (e) => {
        e.preventDefault();
        await signIn("credentials", { ...userInfo, callbackUrl: "/checkout" });
      }}
      linkOne={{ href: "#", label: "Have trouble", title: "Forget Password" }}
      linkTwo={{ href: "#", label: "Need an Account", title: "Sign Up" }}
      title="Login"
    >
      <AuthInput
        name="email"
        type="text"
        label="Email"
        placeholder="john@email.com"
        onChange={handleChange}
      />
      <AuthInput
        name="password"
        type="password"
        label="Password"
        placeholder="********"
        onChange={handleChange}
      />
      <SubmitBtn value="Login" />
    </AuthFormContainer>
  );
};

export default SignIn;
