// "use client";

// import React, { createContext, useContext, useState, ReactNode } from "react";
// import { ShippingInfo, BillingInfo, PaymentInfo } from "@/interfaces";

// interface CheckoutContextType {
//   shippingInfo: ShippingInfo;
//   setShippingInfo: (info: ShippingInfo) => void;
//   billingInfo: BillingInfo;
//   setBillingInfo: (info: BillingInfo) => void;
//   paymentInfo: PaymentInfo;
//   setPaymentInfo: (infod: PaymentInfo) => void;
// }

// const CheckoutContext = createContext<CheckoutContextType | undefined>(
//   undefined,
// );

// export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
//     firstName: "",
//     lastName: "",
//     address1: "",
//     address2: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     country: "",
//     mobilePhone: "",
//     deliveryMethod: "FREE_STANDARD",
//   });

//   const [billingInfo, setBillingInfo] = useState<BillingInfo>({
//     firstName: "",
//     lastName: "",
//     address1: "",
//     address2: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     country: "",
//     mobilePhone: "",
//   });

//   const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
//     method: "",
//     cardLast4Digits: "",
//   });

//   return (
//     <CheckoutContext.Provider
//       value={{
//         shippingInfo,
//         setShippingInfo,
//         billingInfo,
//         setBillingInfo,
//         paymentInfo,
//         setPaymentInfo,
//       }}
//     >
//       {children}
//     </CheckoutContext.Provider>
//   );
// };

// // Custom hook to use the CheckoutContext
// export const useCheckout = () => {
//   const context = useContext(CheckoutContext);
//   if (!context) {
//     throw new Error("useCheckout must be used within a CheckoutProvider");
//   }
//   return context;
// };
