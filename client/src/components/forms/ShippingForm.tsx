import { useState, FormEvent, Dispatch, SetStateAction } from "react";

import EmbeddedCheckoutButton from "../layout/EmbeddedCheckoutButton";
import { usePathname, useRouter } from "next/navigation";
import { ShippingInfo } from "@/interfaces";

interface ShippingFormProps {
  shippingInfo?: ShippingInfo;
  setShippingInfo: Dispatch<SetStateAction<ShippingInfo>>;
  onNext: () => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  shippingInfo = {
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    mobilePhone: "",
    deliveryMethod: "FREE_STANDARD",
  },
  setShippingInfo,
  onNext,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState(shippingInfo.firstName);
  const [lastName, setLastName] = useState(shippingInfo.lastName);
  const [address1, setAddress1] = useState(shippingInfo.address1);
  const [address2, setAddress2] = useState(shippingInfo.address2);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [zipCode, setZipCode] = useState(shippingInfo.zipCode);
  const [country, setCountry] = useState(shippingInfo.country);
  const [mobilePhone, setMobilePhone] = useState(shippingInfo.mobilePhone);
  const [deliveryMethod, setDeliveryMethod] = useState(
    shippingInfo.deliveryMethod,
  );

  const handleShippingSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    if (
      firstName &&
      lastName &&
      address1 &&
      city &&
      state &&
      zipCode &&
      country &&
      mobilePhone &&
      deliveryMethod
    ) {
      const newShippingInfo = {
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zipCode,
        country,
        mobilePhone,
        deliveryMethod,
      };
      setShippingInfo(newShippingInfo);
      setIsProcessing(false);
      onNext();
    } else {
      setError("Please fill in all required fields.");
      setIsProcessing(false);
    }
  };

  // Trigger form submission programmatically
  // const handleNextClick = () => {
  //   const form = document.getElementById("shipping-form") as HTMLFormElement;
  //   if (form) form.requestSubmit(); // This will trigger handleShippingSubmit
  // };

  return (
    <div className="flex h-screen w-full justify-center">
      <form
        id="shipping-form"
        onSubmit={handleShippingSubmit}
        className="mx-auto w-full max-w-2xl space-y-6 rounded-lg p-8"
      >
        {error && <p className="text-red-600">{error}</p>}
        <div className="mb-4 flex flex-col">
          <h3 className="mb-2 text-lg font-semibold">Shipping Information</h3>
          <div className="mb-2 flex flex-row space-x-2">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
              className="w-full border p-2"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
              className="w-full border p-2"
            />
          </div>
          <input
            type="text"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            placeholder="Address 1*"
            required
            className="mb-2 w-full border p-2"
          />
          <input
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            placeholder="Address 2"
            className="mb-2 border p-2"
          />
          <div className="mb-2 flex flex-row space-x-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City*"
              required
              className="w-full border p-2"
            />
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State*"
              required
              className="w-full border p-2"
            />
          </div>
          <div className="mb-2 flex flex-row space-x-2">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="ZIP Code*"
              required
              className="w-full border p-2"
            />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country*"
              required
              className="w-full border p-2"
            />
          </div>
          <input
            type="text"
            value={mobilePhone}
            onChange={(e) => setMobilePhone(e.target.value)}
            placeholder="Mobile Phone*"
            required
            className="mb-2 w-full border p-2"
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label className="mb-2 text-sm font-medium">Delivery Methods</label>
          <div className="flex flex-col space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="deliveryMethod"
                value="FREE_STANDARD"
                checked={deliveryMethod === "FREE_STANDARD"}
                onChange={() => setDeliveryMethod("FREE_STANDARD")}
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
                onChange={() => setDeliveryMethod("GROUND")}
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
                onChange={() => setDeliveryMethod("EXPRESS")}
                className="mr-2"
              />
              Express (order by 1pm PT to receive in 2 business days) $25
            </label>
          </div>
        </div>
        {/* Inline Checkout Button */}
        <button
          type="submit"
          className="w-full max-w-2xl bg-black p-2 text-white"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Next"}
        </button>
      </form>
    </div>
  );
};

export default ShippingForm;
