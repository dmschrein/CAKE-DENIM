// client/src/components/common/AuthFormContainer.tsx

"use client";

import { login } from "@/app/(auth)/sign-in/actions";
import { ReactNode, DOMAttributes, useActionState } from "react";

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
  const [state, loginAction] = useActionState(login, undefined);
  return (
    <div className="space-y-6 bg-white p-10 shadow-md">
      <h1 className="text-3xl text-gray-800">{title}</h1>
      <form action={loginAction} onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
      {state?.errors?.password && (
        <p className="text-red-500">{state.errors.password}</p>
      )}
    </div>
  );
};

export default AuthFormContainer;
