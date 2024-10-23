import { useState, FormEvent, ChangeEvent } from "react";
import { ShippingInfo } from "@/interfaces";

// Store User
interface ShippingFormProps {
  shippingInfo: ShippingInfo | null;
  setShippingInfo: (info: ShippingInfo) => void;
  nextStep: () => void;
}

export default function ShippingForm({
  shippingInfo,
  setShippingInfo,
  nextStep,
}: ShippingFormProps) {
  const [deliveryMethod, setDeliveryMethod] = useState("Free standard");

  const handleShippingSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      name: { value: string };
      address: { value: string };
    };

    // Collect the shipping details from the form
    setShippingInfo({
      name: target.name.value,
      address: target.address.value,
      deliveryMethod: deliveryMethod,
    });
    console.log("Shipping Info Set:", {
      name: target.name.value,
      address: target.address.value,
      deliveryMethod: deliveryMethod,
    });
    nextStep();
  };

  return (
    <form
      onSubmit={handleShippingSubmit}
      className="mx-auto max-w-lg space-y-6 rounded-lg border-gray-300 bg-white p-6 shadow-lg"
    >
      <h2 className="mb-4 text-2xl font-bold">Shipping</h2>
      <div className="space-y-4">
        <label className="block text-sm font-bold text-gray-700">
          Shipping to
        </label>
        <input type="text" name="name" placeholder="Full Name" required />
        <input
          type="text"
          name="address"
          placeholder="Shipping Address"
          required
        />
      </div>

      <h3 className="text-lg font-semibold">Delivery</h3>
      <div className="space-y-3">
        <label className="flex items-center text-lg">
          <input
            type="radio"
            name="delivery"
            value="Free standard"
            checked={deliveryMethod === "Free standard"}
            onChange={() => setDeliveryMethod("Free standard")}
            className="mr-3"
          />
          Free standard (3-6 business days)
        </label>
        <label className="flex items-center text-lg">
          <input
            type="radio"
            name="delivery"
            value="Express"
            onChange={() => setDeliveryMethod("Express")}
            className="mr-3"
          />
          Express (2 business days) - $25
        </label>
        <label className="flex items-center text-lg">
          <input
            type="radio"
            name="delivery"
            value="Next day"
            onChange={() => setDeliveryMethod("Next day")}
            className="mr-3"
          />
          Next day (1 business day) - $40
        </label>
      </div>

      <button type="submit">Next</button>
    </form>
  );
}
