import React from "react";

const sections = [
  { id: "home", label: "Home" },
  { id: "order-history", label: "Order History" },
  { id: "profile", label: "Profile" },
  { id: "password", label: "Password" },
  { id: "address-book", label: "Address Book" },
  { id: "favorites", label: "Favorites" },
  { id: "payment", label: "Payment" },
  { id: "cake-scale", label: "CAKE Scale" },
];

const AccountSidebar = ({
  selectedSection,
  setSelectedSection,
  handleSignOut,
}: any) => {
  return (
    <div className="w-1/3 border-r bg-white p-8">
      <h1 className="mb-8 text-lg font-semibold">Oh hey,</h1>
      <nav className="flex flex-col space-y-4">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            className={`text-left text-gray-700 hover:text-black ${
              selectedSection === id ? "font-bold" : ""
            }`}
            onClick={() => setSelectedSection(id)}
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
