import { User } from "shared/src/interfaces";
import React from "react";

type Section =
  | "home"
  | "order-history"
  | "profile"
  | "password"
  | "address-book"
  | "favorites"
  | "payment"
  | "cake-scale";

const sections: { id: Section; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "order-history", label: "Order History" },
  { id: "profile", label: "Profile" },
  { id: "password", label: "Password" },
  { id: "favorites", label: "Favorites" },
];

type Props = {
  selectedSection: Section;
  setSelectedSection: (section: Section) => void;
  handleSignOut: () => void;
  userDetails: User | null;
};

const AccountSidebar: React.FC<Props> = ({
  selectedSection,
  setSelectedSection,
  handleSignOut,
  userDetails,
}) => {
  console.log("User Details: ", userDetails);
  return (
    <div className="w-1/3 border-r bg-white p-8">
      <p className="text-sm font-semibold">Oh hey,</p>
      <h1 className="mb-8 text-4xl font-semibold">{userDetails?.firstName}</h1>
      <nav className="flex flex-col space-y-4">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            className={`text-left text-gray-700 hover:text-black ${
              selectedSection === id ? "font-bold" : ""
            }`}
            onClick={() => setSelectedSection(id as Section)}
          >
            {label}
          </button>
        ))}
        <button
          className="text-left text-gray-700 hover:text-black"
          onClick={handleSignOut}
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AccountSidebar;
