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
          console.log("🟢 Starting user authorization process...");

          // Fetch user data from your backend API
          console.log(`🟡 Fetching user with email: ${email}`);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?email=${encodeURIComponent(email)}`,
          );

          console.log("🟡 API response status:", response.status);

          if (response.status === 404) {
            // If the user is not found, we create a new guest user
            console.log("🟡 User not found, creating a new GUEST user...");

            const createResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email,
                  userType: "GUEST", // Create as guest user
                }),
              },
            );

            if (!createResponse.ok) {
              console.error("🔴 Error creating guest user");
              return null;
            }

            const newUser = await createResponse.json();
            console.log("🟢 New guest user created:", newUser);

            return {
              id: newUser.userId,
              email: newUser.email,
            };
          }

          if (!response.ok) {
            console.error(
              `🔴 User not found or server error: ${response.status}`,
            );
            return null;
          }

          const user = await response.json();
          console.log("🟢 User data retrieved:", user);

          // Handle guest users or EMAIL_ONLY users without passwords
          if (user.userType === "GUEST" || user.userType === "EMAIL_ONLY") {
            console.log(
              "🟢 Guest or EMAIL_ONLY user detected, bypassing password check",
            );
            return {
              id: user.userId,
              email: user.email,
            };
          }

          // Verify the password
          if (!password || !user.passwordHash) {
            console.error("🔴 Password or hash missing for non-guest user");
            throw new Error("Password or hash missing");
          }

          // Compare the password with the hash
          console.log("🟡 Verifying password...");
          const isValidPassword = await bcrypt.compare(
            password,
            user.passwordHash,
          );

          if (!isValidPassword) {
            console.error("🔴 Invalid password provided");
            throw new Error("Invalid password");
          }

          console.log(
            "🟢 Password verification successful. Returning user data.",
          );
          return {
            id: user.userId,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          };
        } catch (error) {
          console.error("🔴 Error authorizing user:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

export default nextAuth(authConfig);

export const {
  auth,
  handlers: { GET, POST },
} = nextAuth(authConfig);
