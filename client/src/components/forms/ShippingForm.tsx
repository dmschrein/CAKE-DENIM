// "use client";

// import { useState, FormEvent } from "react";
// import { ShippingInfo } from "@/interfaces";

// interface ShippingFormProps {
//   shippingInfo: ShippingInfo | null;
//   setShippingInfo: (info: ShippingInfo) => void;
//   nextStep: () => void;
// }

// export default function ShippingForm({
//   shippingInfo,
//   setShippingInfo,
//   nextStep,
// }: ShippingFormProps) {
//   const [name, setName] = useState(shippingInfo?.name || "");
//   const [address, setAddress] = useState(shippingInfo?.address || "");
//   const [deliveryMethod, setDeliveryMethod] = useState(
//     shippingInfo?.deliveryMethod,
//   );

//   const handleShippingSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (name && address && deliveryMethod) {
//       setShippingInfo({
//         name,
//         address,
//         deliveryMethod,
//       });
//       nextStep();
//     } else {
//       console.error("Please fill in all the fields.");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleShippingSubmit}
//       className="mx-auto max-w-lg space-y-6 p-6"
//     >
//       <h2 className="mb-4 text-2xl font-bold">Shipping</h2>
//       <div className="space-y-4">
//         <label className="block text-sm font-bold">Full Name</label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Full Name"
//           required
//           className="w-full border p-2"
//         />
//       </div>
//       <div className="space-y-4">
//         <label className="block text-sm font-bold">Shipping Address</label>
//         <input
//           type="text"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           placeholder="Shipping Address"
//           required
//           className="w-full border p-2"
//         />
//       </div>
//       <div className="mb-4 flex flex-col">
//         <h3 className="text-lg font-semibold">Delivery Methods</h3>
//         <div className="flex items-center space-y-3">
//           <ul>
//             <label>
//               <input
//                 type="radio"
//                 value="Free standard"
//                 checked={deliveryMethod === "FREE_STANDARD"}
//                 onChange={() => setDeliveryMethod("FREE_STANDARD")}
//               />
//               Free standard (3-6 business days)
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="delivery"
//                 value="Express"
//                 checked={deliveryMethod === "EXPRESS"}
//                 onChange={() => setDeliveryMethod("EXPRESS")}
//               />
//               Express (2 business days) - $25
//             </label>
//           </ul>
//         </div>
//       </div>

//       <button type="submit" className="w-full bg-black p-2 text-white">
//         Next
//       </button>
//     </form>
//   );
// }
