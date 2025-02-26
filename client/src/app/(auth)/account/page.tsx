"use client";

import { signOut, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import Sidebar from "./Sidebar";
import AccountContent from "./AccountContent";
import { Gender, User } from "shared/src/interfaces";

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
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the active tab from the URL, default to "home"
  const tab = (searchParams.get("tab") as Section) || "home";

  // User object derived from NextAuth session
  const user: User | null = session?.user
    ? {
        userId: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        password: "",
        userType: "REGISTERED",
        phone: "",
        gender: Gender.PreferNotToSay,
        createdAt: new Date().toISOString(),
        orders: [],
      }
    : null;

  // Function to update the active tab in the URL
  const handleTabChange = (newTab: Section) => {
    router.push(`/account?tab=${newTab}`);
  };

  const handleSignOutClicked = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        selectedSection={tab}
        setSelectedSection={handleTabChange} // Updates the URL instead of local state
        handleSignOut={handleSignOutClicked}
        userDetails={user}
      />
      {/* Main Account Content */}
      <AccountContent selectedSection={tab} userEmail={userEmail} />
    </div>
  );
};

export default AccountPage;
