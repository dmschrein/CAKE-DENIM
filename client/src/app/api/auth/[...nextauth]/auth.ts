import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
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
          const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users?email=${encodeURIComponent(email)}`;
          console.log(`🟡 Fetching user from: ${apiUrl}`);

          const response = await fetch(apiUrl);

          if (!response.ok) {
            console.error(`🔴 Fetch failed with status ${response.status}`);
            throw new Error("User not found or server error");
          }

          const user = await response.json();
          console.log("🟢 User data retrieved:", user);

          // Verify password
          if (!password || !user.passwordHash) {
            console.error("🔴 Password or hash missing for non-guest user");
            throw new Error("Password or hash missing");
          }

          const isValidPassword = bcrypt.compareSync(
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
            firstName: user.firstName || "Guest",
            lastName: user.lastName || "",
          };
        } catch (error) {
          console.error("🔴 Error authorizing user:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      console.log("🟢 Session callback triggered. Token:", token);
      if (token) {
        session.user = {
          id: token.sub as string,
          email: token.email as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
        };
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      console.log("🟡 JWT callback triggered. User:", user);
      if (user) {
        token.sub = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
