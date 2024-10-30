import { PaymentInfo } from "@/interfaces";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

interface PaymentFormProps {
  setPaymentMethodId: (id: string) => void; // Pass the payment method ID to the review form
  nextStep: () => void;
  previousStep: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  setPaymentMethodId,
  nextStep,
  previousStep,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    setPaymentMethodId(paymentMethod?.id || "");
    setIsProcessing(false);
    nextStep();
  };

  return (
    <div className="flex w-full items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-6 rounded-lg p-8"
      >
        <h2 className="mb-4 text-2xl font-bold">Payment</h2>

        <div className="mb-4 flex flex-col">
          <label className="mb-2 text-sm font-medium">Card Details:</label>
          <CardElement className="rounded-md border border-gray-300 p-3" />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          className="w-full bg-black p-2 text-white"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Next"}
        </button>
        <button
          type="button"
          onClick={previousStep}
          className="mt-2 w-full bg-gray-400 p-2 text-white"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
