"use server";

import { z } from "zod";
import { signIn, signOut } from "next-auth/react"; // Import NextAuth functions
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

// Login function using NextAuth.js
export async function login(formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  const response = await signIn("credentials", {
    email,
    password,
    redirect: false, // Prevent automatic redirect
  });

  if (response?.error) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  redirect("/account"); // Redirect to account page on success

  // Ensure a return value even after a redirect
  return { errors: {} };
}

// Logout function using NextAuth.js
export async function logout() {
  await signOut({ redirect: false });
  redirect("/home");
}
