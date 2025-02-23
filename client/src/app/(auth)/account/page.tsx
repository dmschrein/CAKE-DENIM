"use client";

import { signOut, useSession } from "next-auth/react";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AccountContent from "./AccountContent";
import { User } from "@/interfaces";

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

const AccountPage = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  console.log("User email: ", userEmail);

  // // Fetch user's details using the email if available
  // const {
  //   data: userDetails,
  //   isLoading: userLoading,
  //   isError: userError,
  // } = useGetUserByEmailQuery(userEmail as string);

  // const userId = userDetails?.userId;
  // const {
  //   isLoading: orderLoading,
  //   isError: orderError,
  // } = useGetOrdersByUserIdQuery(userId as string);

  const [selectedSection, setSelectedSection] = useState<Section>("home");

  // const handleSignOutClicked = async () => {
  //   await signOut({ callbackUrl: "/" });
  // };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        handleSignOut={signOut}
      />
      <AccountContent selectedSection={selectedSection} userEmail={userEmail} />
    </div>
  );
};

export default AccountPage;
