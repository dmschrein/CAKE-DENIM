// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }
}