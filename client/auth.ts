import nextAuth, { NextAuthConfig } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const authConfig: NextAuthConfig = {
  providers: [
    CredentialProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          // Fetch user data from your backend API
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?email=${encodeURIComponent(email)}`,
          );

          if (!response.ok) {
            console.error("User not found or server error");
            return null;
          }

          const user = await response.json();

          // Verify the password
          const isValidPassword = await bcrypt.compare(
            password,
            user.passwordHash,
          );
          if (!isValidPassword) throw new Error("Invalid password");

          return {
            id: user.userId,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          };
        } catch (error) {
          console.error("Error authorizing user:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export default nextAuth(authConfig);

export const {
  auth,
  handlers: { GET, POST },
} = nextAuth(authConfig);
