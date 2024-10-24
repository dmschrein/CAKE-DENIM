// PaymentForm.tsx

import { PaymentInfo } from "@/interfaces";
import { useState } from "react";

interface PaymentFormProps {
  paymentInfo: PaymentInfo | null;
  setPaymentInfo: (info: PaymentInfo) => void;
  nextStep: () => void;
  previousStep: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentInfo,
  setPaymentInfo,
  nextStep,
  previousStep,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentInfo?.method || "",
  );

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPaymentInfo({
      method: selectedPaymentMethod,
      cardLast4Digits: "1234", // Example, in a real app this comes from Stripe or the payment provider
    });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Payment</h3>
      <label>
        <input
          type="radio"
          value="Credit Card"
          checked={selectedPaymentMethod === "Credit Card"}
          onChange={handlePaymentChange}
        />
        Credit Card
      </label>
      <label>
        <input
          type="radio"
          value="PayPal"
          checked={selectedPaymentMethod === "PayPal"}
          onChange={handlePaymentChange}
        />
        PayPal
      </label>

      <button type="submit">Next</button>
      <button type="button" onClick={previousStep}>
        Back
      </button>
    </form>
  );
};

export default PaymentForm;
