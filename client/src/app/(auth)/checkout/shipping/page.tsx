// // src/app/(auth)/checkout/shipping/page.tsx
// "use client";

// import { useRouter } from "next/navigation";
// import { ShippingInfo } from "@/interfaces";
// import ShippingForm from "@/components/forms/ShippingForm";

// interface ShippingPageProps {
//   shippingInfo: ShippingInfo;
//   setShippingInfo: (info: ShippingInfo) => void;
// }

// export default function ShippingPage({
//   shippingInfo,
//   setShippingInfo,
// }: ShippingPageProps) {
//   const router = useRouter();

//   const handleNext = () => {
//     console.log("Shipping Info before navigating to payment: ", shippingInfo);
//     router.push("/checkout/payment"); // Navigate to the next page
//   };

//   return (
//     <div>
//       <ShippingForm
//         shippingInfo={shippingInfo}
//         setShippingInfo={setShippingInfo}
//         onNext={handleNext} // Pass `onNext` as a callback to move to the next page
//       />
//     </div>
//   );
// }
