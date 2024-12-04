"use client";

import AccountHome from "@/components/layout/AccountHome";
import OrderHistory from "@/components/layout/OrderHistory";
import Profile from "@/components/layout/Profile";
import { useGetUserByEmailQuery, useGetOrdersByUserIdQuery } from "@/state/api";
import { signOut, useSession } from "next-auth/react";

import React, { FC, useState } from "react";

{
  /* TODO:
   * Add side bar that has account details (home), (order history), saved(favorites)
   * addresses, password
   */
}

const Account: FC = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  console.log("User email: ", userEmail);

  // Fetch user's details using the email if available
  const {
    data: userDetails,
    isLoading: userLoading,
    isError: userError,
  } = useGetUserByEmailQuery(userEmail as string);

  const userId = userDetails?.userId;
  const {
    isLoading: orderLoading,
    isError: orderError,
  } = useGetOrdersByUserIdQuery(userId as string);

  const [selectedSection, setSelectedSection] = useState("home");
  console.log("User details: ", userDetails);

  const handleSignOutClicked = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Function to render the selected section
  const renderContent = () => {
    if (userLoading) return <div>Loading user data...</div>;
    if (userError) return <div>Error loading user data.</div>;

    if (orderLoading) return <div>Loading order data...</div>;
    if (orderError) return <div>orderError</div>;

    switch (selectedSection) {
      case "home":
        return (
          <div>
            <h2>Welcome to your account, {userDetails?.firstName}!</h2>
            <AccountHome userDetails={userDetails || null} />
          </div>
        );
      case "order-history":
        return (
          <div>
            <h2>Order History</h2>
            <OrderHistory userOrders={userDetails?.orders || []} />
          </div>
        );
      case "profile":
        return (
          <div>
            <Profile userDetails={userDetails || null} />
          </div>
        );
      case "password":
        return (
          <div>
            <h2>Update password</h2>
            {/*TODO: password layout with update option*/}
          </div>
        );
      case "address-book":
        return (
          <div>
            <h2>Address book</h2>
            {/*TODO: password layout with update option*/}
          </div>
        );
      case "favorites":
        return (
          <div>
            <h2>Favorite Products</h2>;{" "}
            {/* TODO: redirect to layout component */}
            with user&apos;s favorite products
          </div>
        );
      case "payment":
        return (
          <div>
            <h2>Saved Payments</h2>
          </div>
        );
      case "cake-scale":
        return (
          <div>
            <h2>
              Based on your purchase history, here&apos;s your CAKE Scale impact
            </h2>
          </div>
        );
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-white p-8">
        <h1 className="mb-8 text-lg font-semibold">Oh hey,</h1>
        <h2 className="mb-8 text-2xl font-bold">{userDetails?.firstName}</h2>

        {/* Sidebar navigation */}
        <nav className="text-left-10 flex flex-col space-y-4">
          <button
            className="text-left text-gray-700 hover:text-black"
            onClick={() => setSelectedSection("home")}
          >
            Home
          </button>
          <button
            className="text-left text-gray-700 hover:text-black"
            onClick={() => setSelectedSection("order-history")}
          >
            Order History
          </button>
          <button
            className="text-left text-gray-700 hover:text-black"
            onClick={() => setSelectedSection("profile")}
          >
            Profile
          </button>
          <button
            className="text-left text-gray-700 hover:text-black"
            onClick={() => setSelectedSection("password")}
          >
            Password
          </button>
          <button
            className="text-left text-gray-700 hover:text-black"
            onClick={() => setSelectedSection("address")}
          >
            Address book
          </button>
          <button
            className="text-left text-gray-700 hover:text-black"
            onClick={() => setSelectedSection("favorites")}
          >
            Favorites
          </button>
          <button
            className="text-left text-gray-700 hover:text-black"
            onClick={() => setSelectedSection("payment")}
          >
            Payment
          </button>
          <button
            className="text-left text-gray-700 hover:text-black"
            onClick={() => setSelectedSection("cake-scale")}
          >
            CAKE Scale
          </button>
          <button
            className="text-left text-gray-700 hover:text-black"
            onClick={handleSignOutClicked}
          >
            Logout
          </button>
        </nav>
      </div>
      {/* Content area */}
      <div>
        <h1>{selectedSection.replace("-", " ")}</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default Account;
