import { useCreateUserMutation } from "@/state/api";

//
export const useCreateUser = () => {
  const [createUserMutation, { isLoading, isError, error }] =
    useCreateUserMutation(); // react hook

  const createUser = async (userData: any) => {
    try {
      const response = await createUserMutation(userData).unwrap();
      return {
        success: true,
        message: "User created successfully,",
        data: response,
      };
    } catch (err: any) {
      console.error("Error creating user:", err);
      return {
        success: false,
        message: err?.data?.message || "Failed to create user",
      };
    }
  };
  return { createUser, isLoading, isError, error };
};
