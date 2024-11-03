import { useState, FormEvent } from "react";
import { ShippingInfo } from "@/interfaces";
import { useSession } from "next-auth/react";
import OrderSummary from "../layout/OrderSummary";

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
  const [firstName, setFirstName] = useState(shippingInfo?.firstName || "");
  const [lastName, setLastName] = useState(shippingInfo?.lastName || "");
  const [address1, setAddress1] = useState(shippingInfo?.address1 || "");
  const [address2, setAddress2] = useState(shippingInfo?.address2 || "");
  const [city, setCity] = useState(shippingInfo?.city || "");
  const [state, setState] = useState(shippingInfo?.state || "");
  const [zipCode, setZipCode] = useState(shippingInfo?.zipCode || "");
  const [country, setCountry] = useState(shippingInfo?.country || "");
  const [mobilePhone, setMobilePhone] = useState(
    shippingInfo?.mobilePhone || "",
  );
  const [deliveryMethod, setDeliveryMethod] = useState(
    shippingInfo?.deliveryMethod || "FREE_STANDARD",
  );
  const [error, setError] = useState<string | null>(null);

  const handleShippingSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      firstName &&
      lastName &&
      address1 &&
      address2 &&
      city &&
      state &&
      zipCode &&
      country &&
      mobilePhone &&
      deliveryMethod
    ) {
      // Set shipping info in parent state and move to next step
      setShippingInfo({
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
      });
      nextStep(); // Move to payment step
    } else {
      setError("Please fill in all the fields.");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <form
        id="shipping-form"
        onSubmit={handleShippingSubmit}
        className="flex h-full w-full max-w-6xl p-10"
      >
        {/* Left Section: Main Form Content */}
        <div className="flex w-2/3 flex-col space-y-6">
          {/* Signed in email */}
          {session?.user?.email && (
            <div className="text-md text-gray-600">
              Signed in as {session?.user?.email}
            </div>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Shipping Information */}
          <div>
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
              className="mb-2 w-full border p-2"
            />
            <div className="mb-2 flex flex-row space-x-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City*"
                required
                className="mb-2 w-full border p-2"
              />
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State*"
                required
                className="mb-2 w-full border p-2"
              />
            </div>
            <div className="mb-2 flex flex-row space-x-2">
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="ZIP Code*"
                required
                className="mb-2 w-full border p-2"
              />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country*"
                required
                className="mb-2 w-full border p-2"
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

          {/* Delivery Method */}
          <div>
            <label className="mb-4 text-lg font-medium">Delivery Methods</label>
            <div className="flex flex-col space-y-3">
              <label
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${
                  deliveryMethod === "FREE_STANDARD"
                    ? "border-black"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="FREE_STANDARD"
                    checked={deliveryMethod === "FREE_STANDARD"}
                    onChange={(e) => setDeliveryMethod("FREE_STANDARD")}
                    className="mr-2"
                  />
                  <div>
                    <p className="font-semibold">Free standard</p>
                    <p className="text-sm text-gray-500">3-6 business days</p>
                  </div>
                </div>
                <p className="font-semibold">$0</p>
              </label>
              <label
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${
                  deliveryMethod === "GROUND"
                    ? "border-black"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="GROUND"
                    checked={deliveryMethod === "GROUND"}
                    onChange={(e) => setDeliveryMethod("GROUND")}
                    className="mr-2"
                  />
                  <div>
                    <p className="font-semibold">Ground</p>
                    <p className="text-sm text-gray-500">2-5 business days</p>
                  </div>
                </div>
                <p className="font-semibold">$10</p>
              </label>
              <label
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${
                  deliveryMethod === "EXPRESS"
                    ? "border-black"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="EXPRESS"
                    checked={deliveryMethod === "EXPRESS"}
                    onChange={(e) => setDeliveryMethod("EXPRESS")}
                    className="mr-2"
                  />
                  <div>
                    <p className="font-semibold">Express</p>
                    <p className="text-sm text-gray-500">
                      Order by 1pm PT to receive in 2 business days
                    </p>
                  </div>
                </div>
                <p className="font-semibold">$25</p>
              </label>
              <label
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${
                  deliveryMethod === "NEXT_DAY"
                    ? "border-black"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="NEXT_DAY"
                    checked={deliveryMethod === "NEXT_DAY"}
                    onChange={(e) => setDeliveryMethod("NEXT_DAY")}
                    className="mr-2"
                  />
                  <div>
                    <p className="font-semibold">Next day</p>
                    <p className="text-sm text-gray-500">
                      Order by 1pm PT to receive in 1 business day
                    </p>
                  </div>
                </div>
                <p className="font-semibold">$40</p>
              </label>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="mx-5 border-l-2 border-black"></div>
        {/* Right Section: Order Summary */}
        <div className="w-2/5">
          <OrderSummary />
          {/* Submit Button */}
          <button type="submit" className="mt-6 w-full bg-black p-2 text-white">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
