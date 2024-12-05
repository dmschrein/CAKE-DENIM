import React from "react";
import { User } from "@/interfaces";

type Props = {
  userDetails: User | null;
};

const AccountHome: React.FC<Props> = ({ userDetails }) => {
  return (
    <div>
      <h2>Account Home</h2>
      <div>Order History</div>
      <div>{userDetails?.email}</div>
    </div>
  );
};

export default AccountHome;
