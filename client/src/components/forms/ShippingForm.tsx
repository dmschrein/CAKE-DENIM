import { useState, FormEvent } from "react";
import { ShippingInfo } from "@/interfaces";

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

    nextStep();
  };

  return (
    <form
      onSubmit={handleShippingSubmit}
      className="mx-auto max-w-lg space-y-6 p-6 shadow-lg"
    >
      <h2 className="mb-4 text-2xl font-bold">Shipping</h2>
      <div className="space-y-4">
        <label className="block text-sm font-bold">Shipping to</label>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          defaultValue={shippingInfo?.name || ""}
        />
        <input
          type="text"
          name="address"
          placeholder="Shipping Address"
          required
          defaultValue={shippingInfo?.address || ""}
        />
      </div>

      <h3 className="text-lg font-semibold">Delivery</h3>
      <div className="space-y-3">
        <label>
          <input
            type="radio"
            name="delivery"
            value="Free standard"
            checked={deliveryMethod === "Free standard"}
            onChange={() => setDeliveryMethod("Free standard")}
          />
          Free standard (3-6 business days)
        </label>
        <label>
          <input
            type="radio"
            name="delivery"
            value="Express"
            checked={deliveryMethod === "Express"}
            onChange={() => setDeliveryMethod("Express")}
          />
          Express (2 business days) - $25
        </label>
      </div>

      <button type="submit">Next</button>
    </form>
  );
}
