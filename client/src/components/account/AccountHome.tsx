import React from "react";
import { User } from "shared/src/interfaces";

type Props = {
  userDetails: User | null;
};

const AccountHome: React.FC<Props> = ({ userDetails }) => {
  if (!userDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading account details...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-white p-6">
      <div className="w-full max-w-md rounded-lg p-6">
        <h2 className="mb-4 text-2xl font-bold">
          Welcome, {userDetails.firstName}!
        </h2>

        <div className="mb-4 text-gray-700">
          <p>
            <strong>Email:</strong>
            {userDetails.email}
          </p>
          <p>
            <strong>Member Since:</strong>{" "}
            {new Date(userDetails.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* <div className="mt-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <ul className="list-disc pl-5 text-blue-600">
          <li>
            <a href="/account/order-history">View Order History</a>
          </li>
          <li>
            <a href="/account/profile">Edit Profile</a>
          </li>
          <li>
            <a href="/account/saved-payments">Manage Payments</a>
          </li>
        </ul>
      </div> */}
      </div>
    </div>
  );
};

export default AccountHome;
