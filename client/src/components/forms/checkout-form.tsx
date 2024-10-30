import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useElements, CardElement, useStripe } from "@stripe/react-stripe-js";
import { useCreatePaymentMutation, useCreateOrderMutation } from "@/state/api";
import { useCart } from "@/providers/CartProvider";
import { NewOrder, ShippingInfo } from "@/interfaces";
import { useSession } from "next-auth/react";

interface ShippingFormProps {
  shippingInfo: ShippingInfo | null;
  setShippingInfo: (info: ShippingInfo) => void;
  nextStep: () => void;
}

export function CheckoutForm({
  shippingInfo,
  setShippingInfo,
  nextStep,
}: ShippingFormProps) {
  const { data: session } = useSession();
  const [name, setName] = useState(shippingInfo?.name || "");
  const [address, setAddress] = useState(shippingInfo?.address || "");
  const [deliveryMethod, setDeliveryMethod] = useState(
    shippingInfo?.deliveryMethod || "FREE_STANDARD",
  );
  const [error, setError] = useState<string | null>(null);

  const handleShippingSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name && address && deliveryMethod) {
      // Set shipping info in parent state and move to next step
      setShippingInfo({
        name,
        address,
        deliveryMethod,
      });
      nextStep(); // Move to payment step
    } else {
      setError("Please fill in all the fields.");
    }
  };

  return (
    <div className="flex h-screen w-full justify-center">
      <form
        id="shipping-form"
        onSubmit={handleShippingSubmit}
        className="w-full max-w-lg space-y-6 rounded-lg p-8"
      >
        {/* Signed in email at the top */}
        {session?.user?.email && (
          <div className="text-black-600 text-md mb-6">
            Signed in as {session?.user?.email}
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Shipping Information */}
        <div className="mb-4 flex flex-col">
          <h3 className="mb-2 text-lg font-semibold">Shipping Information</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="w-full border p-2"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Shipping Address"
            required
            className="w-full border p-2"
          />
        </div>

        {/* Delivery Method */}
        <div className="mb-4 flex flex-col">
          <label className="mb-2 text-sm font-medium">Delivery Methods</label>
          <div className="flex flex-col space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="deliveryMethod"
                value="FREE_STANDARD"
                checked={deliveryMethod === "FREE_STANDARD"}
                onChange={(e) => setDeliveryMethod("FREE_STANDARD")}
                className="mr-2"
              />
              Free Standard (3-6 Business Days) $0
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="deliveryMethod"
                value="GROUND"
                checked={deliveryMethod === "GROUND"}
                onChange={(e) => setDeliveryMethod("GROUND")}
                className="mr-2"
              />
              Ground (2-5 Business Days) $10
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="deliveryMethod"
                value="EXPRESS"
                checked={deliveryMethod === "EXPRESS"}
                onChange={(e) => setDeliveryMethod("EXPRESS")}
                className="mr-2"
              />
              Express (order by 1pm PT to receive in 2 business days) $25
            </label>
          </div>
        </div>

        {/* Submit to move to next step */}
        <button type="submit" className="w-full bg-black p-2 text-white">
          Next
        </button>
      </form>
    </div>
  );
}
