import nextAuth, { NextAuthConfig } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { createUser } from "@/lib/utils";
import { NewUser } from "@/interfaces";

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
        // Check if th user exists
        const newUser: NewUser = {
          email,
          password,
          firstName,
          lastName,
        };

        // Use createUser function from lib/utils.ts
        try {
          const user = await createUser(newUser);
          // If the user is successfully created, return the user object for the session
          if (user) {
            return user;
          }
        } catch (error) {
          console.error("Error creating user: ", error);
        }
        return null;
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
