import { ReactNode, DOMAttributes } from "react";

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

export default AuthFormContainer;
