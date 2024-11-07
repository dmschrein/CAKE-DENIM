import { ShippingInfo, BillingInfo } from "@/interfaces";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { useState } from "react";
import OrderSummary from "../layout/OrderSummary";

interface PaymentFormProps {
  shippingInfo: ShippingInfo | null;
  billingInfo: BillingInfo | null;
  setBillingInfo: (info: BillingInfo) => void;
  setPaymentMethodId: (id: string) => void;
  nextStep: () => void;
  previousStep: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  shippingInfo,
  billingInfo,
  setBillingInfo,
  setPaymentMethodId,
  nextStep,
  previousStep,
}) => {
  const { data: session } = useSession();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);

  const handleBillingInfoChange = () => {
    setUseShippingAsBilling(!useShippingAsBilling);

    if (!useShippingAsBilling && shippingInfo) {
      setBillingInfo({
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        address1: shippingInfo.address1,
        address2: shippingInfo.address2 || "",
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country,
        mobilePhone: shippingInfo.mobilePhone || "",
      });
    } else {
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

    setPaymentMethodId(paymentMethod?.id || "");
    setIsProcessing(false);
    nextStep();
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full max-w-6xl space-x-8 p-10"
      >
        {/* Left Section: Payment Info */}
        <div className="flex w-2/3 flex-col space-y-6">
          {/* Payment Information */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Shipping & Billing Information
            </h3>
            <div className="text-sm text-gray-700">
              <p>
                {shippingInfo?.firstName} {shippingInfo?.lastName}
              </p>
              <p>{shippingInfo?.address1}</p>
              {shippingInfo?.address2 && <p>{shippingInfo.address2}</p>}
              <p>
                {shippingInfo?.city}, {shippingInfo?.state}{" "}
                {shippingInfo?.zipCode}
              </p>
              <p>{shippingInfo?.country}</p>
              <p>
                <strong>Phone:</strong> {shippingInfo?.mobilePhone}
              </p>
            </div>
          </div>

          {/* Billing Info Toggle */}
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
          </div>

          {!useShippingAsBilling && (
            <div className="space-y-2">
              <div className="flex flex-row space-x-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={billingInfo?.firstName || ""}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo!,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full rounded border p-2"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={billingInfo?.lastName || ""}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo!,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full rounded border p-2"
                />
              </div>
              <input
                type="text"
                placeholder="Address 1"
                value={billingInfo?.address1 || ""}
                onChange={(e) =>
                  setBillingInfo({
                    ...billingInfo!,
                    address1: e.target.value,
                  })
                }
                className="w-full rounded border p-2"
              />
              <input
                type="text"
                placeholder="Address 2"
                value={billingInfo?.address2 || ""}
                onChange={(e) =>
                  setBillingInfo({
                    ...billingInfo!,
                    address2: e.target.value,
                  })
                }
                className="w-full rounded border p-2"
              />
              <div className="flex flex-row space-x-2">
                <input
                  type="text"
                  placeholder="City"
                  value={billingInfo?.city || ""}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo!,
                      city: e.target.value,
                    })
                  }
                  className="w-full rounded border p-2"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={billingInfo?.state || ""}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo!,
                      state: e.target.value,
                    })
                  }
                  className="w-full rounded border p-2"
                />
              </div>
              <input
                type="text"
                placeholder="ZIP Code"
                value={billingInfo?.zipCode || ""}
                onChange={(e) =>
                  setBillingInfo({
                    ...billingInfo!,
                    zipCode: e.target.value,
                  })
                }
                className="w-full rounded border p-2"
              />
              <input
                type="text"
                placeholder="Country"
                value={billingInfo?.country || ""}
                onChange={(e) =>
                  setBillingInfo({
                    ...billingInfo!,
                    country: e.target.value,
                  })
                }
                className="w-full rounded border p-2"
              />
              <input
                type="text"
                placeholder="Mobile Phone"
                value={billingInfo?.mobilePhone || ""}
                onChange={(e) =>
                  setBillingInfo({
                    ...billingInfo!,
                    mobilePhone: e.target.value,
                  })
                }
                className="w-full rounded border p-2"
              />
            </div>
          )}

          {/* Payment Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Payment</h3>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium">Card Details</label>
              <CardElement className="rounded-md border border-gray-300 p-3" />
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* Vertical Divider */}
        <div className="mx-5 border-l-2 border-black"></div>

        {/* Right Section: Order Summary */}
        <div className="sticky top-10 w-1/3">
          <OrderSummary shippingInfo={shippingInfo} />
          <button
            type="submit"
            className="mt-6 w-full bg-black p-2 text-white"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
