// import OrderHistory from "./components/OrderHistory";
// import Profile from "./components/Profile";
// import EditPassword from "./components/EditPassword";
// import AddressBook from "./components/AddressBook";
// import Favorites from "./components/Favorites";
// import SavedPayments from "./components/SavedPayments";
// import CakeScale from "./components/CakeScale";
import AccountHome from "@/components/account/AccountHome";
import OrderHistory from "@/components/account/OrderHistory";
import { useOrders } from "@/hooks/useOrders";
import { useUserDetails } from "@/hooks/useUserDetails";

// Define a type for the possible sections
type Section =
  | "home"
  | "order-history"
  | "profile"
  | "password"
  | "address-book"
  | "favorites"
  | "payment"
  | "cake-scale";

// Define props for the AccountContent component
interface AccountContentProps {
  selectedSection: Section;
  userEmail: string | undefined;
}

const AccountContent: React.FC<AccountContentProps> = ({
  selectedSection,
  userEmail,
}) => {
  const { userDetails, isLoading, isError } = useUserDetails(userEmail);
  const userId = userDetails?.userId;
  // Fetch orders only if user navigates to order history
  const {
    orderDetails,
    isLoading: overLoading,
    isError: orderError,
  } = useOrders(userId); // hooks are always called in the same order
  if (isLoading)
    return <div className="text-gray-500">Fetching user data...</div>;
  if (isError || !userDetails) return <div>Loading account details...</div>;

  switch (selectedSection) {
    case "home":
      return <AccountHome userDetails={userDetails} />;
    case "order-history":
      return (
        <OrderHistory
          orders={orderDetails}
          isLoading={overLoading}
          isError={orderError}
        />
      );
    // case "profile":
    //   return <Profile userDetails={userDetails} />;
    // case "password":
    //   return <EditPassword />;
    // case "address-book":
    //   return <AddressBook />;
    // case "favorites":
    //   return <Favorites />;
    // case "payment":
    //   return <SavedPayments />;
    // case "cake-scale":
    //   return <CakeScale />;
    default:
      return <div>Section not found.</div>;
  }
};

export default AccountContent;
