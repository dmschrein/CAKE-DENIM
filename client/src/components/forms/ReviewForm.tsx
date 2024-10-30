import { useState } from "react";
import { useRouter } from "next/navigation";
import { useElements, CardElement, useStripe } from "@stripe/react-stripe-js";
import { useCreatePaymentMutation, useCreateOrderMutation } from "@/state/api";
import { useCart } from "@/providers/CartProvider";
import { NewOrder, ShippingInfo } from "@/interfaces";
import { useSession } from "next-auth/react";

interface ReviewFormProps {
  shippingInfo: ShippingInfo;
  paymentMethodId: string; //Receive the paymentMethodId from the PaymentForm
  previousStep: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  shippingInfo,
  paymentMethodId,
  previousStep,
}) => {
  const stripe = useStripe();
  const router = useRouter();
  const { data: session } = useSession();

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setProcessing] = useState(false);

  const [createPayment] = useCreatePaymentMutation();
  const [createOrder] = useCreateOrderMutation();

  const { items } = useCart();

  const calculateTotalPrice = () => {
    if (!items || items.length === 0) {
      return 0;
    }
    return items.reduce(
      (acc, item) => acc + item.product.price * item.count,
      0,
    );
  };

  const handleConfirmOrder = async () => {
    setError(null);
    setProcessing(true);

    if (!stripe) {
      setError("Stripe has not been initialized. Please try again.");
      setProcessing(false);
      return;
    }

    try {
      // Step 1: Create an order with the shipping info
      const paymentAmount = calculateTotalPrice() * 100;
      const newOrder: NewOrder = {
        userId: session?.user?.id || "guestUserId",
        email: session?.user?.email || "guest@example.com",
        totalAmount: paymentAmount,
        deliveryType: shippingInfo.deliveryMethod,
        shippingInfo,
        billingInfo: {
          address1: "BillingAddress",
          city: "DefaultCity",
          state: "DefaultState",
          zipCode: "DefaultZip",
          mobilePhone: "12345567890",
        },
        orderItems: items.map((item) => ({
          itemId: item.product.productId,
          quantity: item.count,
        })),
        status: "Pending",
      };

      const orderResponse = await createOrder(newOrder);
      const { orderId } = orderResponse.data as { orderId: string };

      if (!orderId) {
        setError("Failed to create order.");
        setProcessing(false);
        return;
      }

      // Step 2: Create Payment Intent and get the client secret using the payment method ID from PaymentForm
      const { data: paymentResponse } = await createPayment({
        email: session?.user?.email || "guest@example.com",
        paymentMethodId,
        amount: paymentAmount,
        currency: "usd",
        orderId: orderId,
      });

      const clientSecret = paymentResponse?.client_secret;

      if (!clientSecret) {
        setError("Failed to retrieve payment intent from the server.");
        setProcessing(false);
        return;
      }

      // Step 4: Confirm the Payment Intent with Stripe
      const { error: confirmationError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret);

      if (confirmationError) {
        setError(confirmationError.message || "Failed to confirm payment.");
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Payment succeeded, redirect to success page
        router.push("/checkout/success");
      } else {
        setError("Payment processing failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred during payment processing.");
      console.error(error);
    }

    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 p-6">
      <h2 className="mb-4 text-2xl font-bold">Review Your Order</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Shipping Information</h3>
        <p>
          <strong>Name:</strong> {shippingInfo.firstName}{" "}
          {shippingInfo.lastName}
        </p>
        <p>
          <strong>Address:</strong> {shippingInfo.address1} <br />
          {shippingInfo.address2} <br />
          {shippingInfo.city}
          {shippingInfo.state},{shippingInfo.zipCode}
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        <p>
          <strong>Total Price:</strong> $
          {(calculateTotalPrice() / 100).toFixed(2)}
        </p>
      </div>

      <button
        onClick={handleConfirmOrder}
        className="w-full bg-green-600 p-2 text-white"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Confirm Order"}
      </button>
      <button
        onClick={previousStep}
        className="mt-2 w-full bg-gray-400 p-2 text-white"
      >
        Back
      </button>
    </div>
  );
};

export default ReviewForm;
