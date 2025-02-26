import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStripe } from "@stripe/react-stripe-js";
import { useCreatePaymentMutation, useCreateOrderMutation } from "@/state/api";
import { useCart } from "@/providers/CartProvider";
import { BillingInfo, NewOrder, ShippingInfo } from "shared/src/interfaces";
import { useSession } from "next-auth/react";
import OrderSummary from "../layout/OrderSummary";

interface ReviewFormProps {
  shippingInfo: ShippingInfo;
  billingInfo: BillingInfo | null;
  paymentMethodId: string; // Receive the paymentMethodId from the PaymentForm
  previousStep: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  shippingInfo,
  billingInfo,
  paymentMethodId,
}) => {
  const stripe = useStripe();
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setProcessing] = useState(false);
  const [createPayment] = useCreatePaymentMutation();
  const [createOrder] = useCreateOrderMutation();
  const { items, clearCart } = useCart();

  console.log("Items in cart: ", items);
  {
    /* Functions to calculate the Total Order */
  }
  const calculateSubtotal = () => {
    return items.reduce(
      (acc, item) => acc + item.product.price * item.count,
      0,
    );
  };

  const calculateTax = (subtotal: number) => {
    return +(subtotal * 0.1).toFixed(2);
  };

  const calculateShippingCost = (deliveryMethod: string) => {
    switch (deliveryMethod) {
      case "GROUND":
        return 10;
      case "EXPRESS":
        return 25;
      case "NEXT_DAY":
        return 40;
      default:
        return 0;
    }
  };

  const calculateTotalPrice = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShippingCost(shippingInfo.deliveryMethod);
    return subtotal + tax + shipping;
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
      const paymentAmount = calculateTotalPrice() * 100;
      const newOrder: NewOrder = {
        userId: session?.user?.id || "guestUserId",
        email: session?.user?.email || "guest@example.com",
        totalAmount: paymentAmount,
        shippingInfo,
        billingInfo: billingInfo || shippingInfo, // check logic
        orderItems: items.map((item) => ({
          variantId: item.variant.variantId,
          size: item.variant.size,
          color: item.variant.color,
          price: item.product.price,
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

      const { data: paymentResponse } = await createPayment({
        email: session?.user?.email || "guest@example.com",
        paymentMethodId,
        amount: paymentAmount,
        currency: "usd",
        orderId,
      });

      const clientSecret = paymentResponse?.client_secret;
      if (!clientSecret) {
        setError("Failed to retrieve payment intent from the server.");
        setProcessing(false);
        return;
      }

      const { error: confirmationError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret);
      if (confirmationError) {
        setError(confirmationError.message || "Failed to confirm payment.");
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        clearCart();
        console.log("order Id", orderId);
        router.push(`/checkout/success?orderId=${orderId}`);
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
    <div className="flex h-screen w-screen justify-center p-10">
      <form className="flex w-full max-w-6xl space-x-8">
        {/* Left Section: Review Details */}
        <div className="flex w-2/3 flex-col space-y-6">
          <h2 className="text-2xl font-bold">Review Your Order</h2>

          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Information</h3>
            <p>
              <strong>Name:</strong> {shippingInfo.firstName}{" "}
              {shippingInfo.lastName}
            </p>
            <p>
              <strong>Address:</strong> {shippingInfo.address1} <br />
              {shippingInfo.address2 && `${shippingInfo.address2}`} <br />
              {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}{" "}
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

          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <p>
              <strong>Total Price:</strong> ${calculateTotalPrice().toFixed(2)}
            </p>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {/* Confirm and Back Buttons */}
          <div className="flex flex-col space-y-2"></div>
        </div>
        {/* Vertical Divider */}
        <div className="mx-5 border-l-2 border-black"></div>
        {/* Right Section: Order Summary */}
        <div className="flex w-1/3 flex-col justify-between">
          <div>
            <OrderSummary shippingInfo={shippingInfo} />
            <button
              onClick={handleConfirmOrder}
              className="w-full bg-black p-2 text-white"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
