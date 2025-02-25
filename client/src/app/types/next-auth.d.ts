// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User; // Use the application-wide User type
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType?: string;
    phone?: string;
    gender?: string;
    createdAt?: string;
    orders?: Order[];
  }
}
