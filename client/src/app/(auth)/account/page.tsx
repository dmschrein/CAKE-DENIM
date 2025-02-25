"use client";

import { signOut, useSession } from "next-auth/react";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AccountContent from "./AccountContent";
import { User } from "shared/src/interfaces";

{
  /* TODO:
   * Add side bar that has account details (home), (order history), saved(favorites)
   * addresses, password
   */
}

type Section =
  | "home"
  | "order-history"
  | "profile"
  | "password"
  | "address-book"
  | "favorites"
  | "payment"
  | "cake-scale";

const AccountPage: React.FC = () => {
  // store the session data for the user
  const { data: session } = useSession();
  console.log("Session data: ", session);
  const userEmail = session?.user?.email;
  console.log("User email: ", userEmail);

  const user: User | null = session?.user
    ? {
        userId: session.user.id, // Rename 'id' -> 'userId'
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        password: "", // Placeholder since NextAuth does not provide passwords
        userType: "REGISTERED", // Default role
        phone: "", // Default empty string
        gender: "unknown", // Default
        createdAt: new Date().toISOString(), // Default timestamp
        orders: [], // Empty array by default
      }
    : null;

  const [selectedSection, setSelectedSection] = useState<Section>("home");

  const handleSignOutClicked = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        handleSignOut={handleSignOutClicked}
        userDetails={user}
      />
      <AccountContent selectedSection={selectedSection} userEmail={userEmail} />
    </div>
  );
};

export default AccountPage;
