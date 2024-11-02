import { ShippingInfo, BillingInfo, PaymentInfo } from "@/interfaces";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Dispatch, SetStateAction, useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

interface PaymentFormProps {
  shippingInfo: ShippingInfo;
  billingInfo: BillingInfo;
  setBillingInfo: Dispatch<SetStateAction<BillingInfo>>; // Add this prop
  setPaymentMethodId: Dispatch<SetStateAction<string>>;
  paymentInfo: PaymentInfo;
  setPaymentInfo: Dispatch<SetStateAction<PaymentInfo>>;
  onNext: () => void;
  onBack: () => void;
}
const PaymentForm: React.FC<PaymentFormProps> = ({
  shippingInfo,
  billingInfo,
  setBillingInfo,
  setPaymentMethodId,
  paymentInfo,
  setPaymentInfo,
  onNext,
  onBack,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);

  // Toggle using shipping info as billing info
  const handleBillingInfoChange = () => {
    setUseShippingAsBilling(!useShippingAsBilling);

    if (!useShippingAsBilling) {
      console.log("Shipping info: ", shippingInfo);
      // Custom validation logic for required fields
      // Check that all required fields are filled in
      const isValid =
        shippingInfo.firstName &&
        shippingInfo.lastName &&
        shippingInfo.address1 &&
        shippingInfo.city &&
        shippingInfo.state &&
        shippingInfo.zipCode &&
        shippingInfo.country;

      if (isValid) {
        // Ensure optional fields are strings and create sanitizedBillingInfo
        const sanitizedBillingInfo = {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          address1: shippingInfo.address1,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          address2: shippingInfo.address2 || "",
          mobilePhone: shippingInfo.mobilePhone || "",
        };
        setBillingInfo(sanitizedBillingInfo);
      } else {
        console.error("Validation failed: Please fill in all required fields.");
        // Optionally, you can set an error message in the state to display to the user
        setError("Please fill in all required fields.");
      }
    } else {
      // Reset billing info when not using shipping as billing
      setBillingInfo({
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        mobilePhone: "",
      });
    }
  };

  // // Handle setting individual billing fields if different from shipping
  // const handleBillingFieldChange = (
  //   field: keyof BillingInfo,
  //   value: string,
  // ) => {
  //   setBillingInfo((prevBillingInfo) => {
  //     const updatedBillingInfo = { ...prevBillingInfo, [field]: value };
  //     const parsed = BillingInfoSchema.safeParse(updatedBillingInfo);

  //     if (parsed.success) {
  //       return parsed.data;
  //     } else {
  //       console.error("Validation failed for billing info:", parsed.error);
  //       return prevBillingInfo; // Revert to the previous state if validation fails
  //     }
  //   });
  // };

  // Handle submission to stripe
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    if (!stripe || !elements) {
      setError("Card details not entered.");
      setIsProcessing(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details not entered.");
      setIsProcessing(false);
      return;
    }
    // Create the payment method using Stripe
    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
    if (stripeError) {
      setError(stripeError.message || "Failed to process payment.");
      setIsProcessing(false);
      return;
    }
    setPaymentMethodId(paymentMethod?.id);
    setIsProcessing(false);
    onNext();
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-2xl flex-col space-y-6 p-6">
        {error && <p style={{ color: "red" }}>{error}</p>}
        {/* Shipping and Delivery info */}
        <div className="p-4">
          <h2>Shipping & delivery</h2>
          {shippingInfo ? (
            <div className="text-sm text-gray-700">
              <p>
                {shippingInfo.firstName} {shippingInfo.lastName}
              </p>
              <p>
                {shippingInfo.address1} <br />
                {shippingInfo.address2 && `${shippingInfo.address2}`} <br />
                {shippingInfo.city},{shippingInfo.state}
                {""}
                {shippingInfo.zipCode}
                <br />
                {shippingInfo.country}
              </p>

              <p>
                <strong>Phone:</strong> {shippingInfo.mobilePhone}
              </p>
              <p>
                <strong>Delivery Method:</strong> {shippingInfo.deliveryMethod}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No shipping information available.
            </p>
          )}
        </div>

        {/* Billing Info Toggle*/}
        <div className="my-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useShippingAsBilling}
              onChange={handleBillingInfoChange}
              className="mr-2"
            />
            Use shipping address as billing address
          </label>
          {!useShippingAsBilling && (
            <div className="mt-4 space-y-2">
              <div className="flex flex-row space-x-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={billingInfo.firstName}
                  onChange={(e) =>
                    setBillingInfo((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className="w-full rounded border p-2"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={billingInfo.lastName}
                  onChange={(e) =>
                    setBillingInfo((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className="w-full rounded border p-2"
                />
              </div>
              <input
                type="text"
                placeholder="Address 1"
                value={billingInfo.address1}
                onChange={(e) =>
                  setBillingInfo((prev) => ({
                    ...prev,
                    address1: e.target.value,
                  }))
                }
                className="w-full rounded border p-2"
              />
              <input
                type="text"
                placeholder="Address 2"
                value={billingInfo.address2 || ""}
                onChange={(e) =>
                  setBillingInfo((prev) => ({
                    ...prev,
                    address2: e.target.value,
                  }))
                }
                className="w-full rounded border p-2"
              />

              <input
                type="text"
                placeholder="City"
                value={billingInfo.city}
                onChange={(e) =>
                  setBillingInfo((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                className="w-full rounded border p-2"
              />
              <div className="mb-2 flex flex-row space-x-2">
                <input
                  type="text"
                  placeholder="State"
                  value={billingInfo.state}
                  onChange={(e) =>
                    setBillingInfo((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  className="w-full rounded border p-2"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={billingInfo.zipCode}
                  onChange={(e) =>
                    setBillingInfo((prev) => ({
                      ...prev,
                      zipCode: e.target.value,
                    }))
                  }
                  className="w-full rounded border p-2"
                />
              </div>
              <input
                type="text"
                placeholder="Country"
                value={billingInfo.country}
                onChange={(e) =>
                  setBillingInfo((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                className="w-full rounded border p-2"
              />
              <input
                type="text"
                placeholder="Mobile Phone"
                value={billingInfo.mobilePhone || ""}
                onChange={(e) =>
                  setBillingInfo((prev) => ({
                    ...prev,
                    mobilePhone: e.target.value,
                  }))
                }
                className="w-full rounded border p-2"
              />
            </div>
          )}
        </div>

        {/* Payment Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-lg bg-white p-6 shadow-md"
        >
          <h2 className="mb-4 text-lg font-semibold">Payment</h2>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Card Details:
            </label>
            <CardElement className="rounded-md border border-gray-300 p-3" />
          </div>

          {error && <p className="text-red-600">{error}</p>}
        </form>
        <button
          type="submit"
          className="w-full max-w-2xl bg-black p-2 text-white"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
