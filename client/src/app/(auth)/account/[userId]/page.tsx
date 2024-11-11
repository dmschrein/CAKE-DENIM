import { OrderSummary, User } from "@/interfaces";
import { useSession } from "next-auth/react";
import React, { FC } from "react";

// TODO:
// Add side bar that has account details (home), (order history), saved(favorites)
// addresses, password

interface AccountProps {
  userDetails: User | null; // TODO: get list of orders, favorite products, addresses
}

const Account: FC<AccountProps> = ({ userDetails }) => {
  const { data: session } = useSession();

  return <div className="spay-y-6 flex w-2/3 flex-col">Account</div>;
};

export default Account;
