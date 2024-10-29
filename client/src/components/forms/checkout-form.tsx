import { useState } from "react";
import { useRouter } from "next/navigation";
import { useElements, CardElement, useStripe } from "@stripe/react-stripe-js";
import { useCreatePaymentMutation, useCreateOrderMutation } from "@/state/api";
import { useCart } from "@/providers/CartProvider";
import { NewOrder, ShippingInfo } from "@/interfaces";
import { useSession } from "next-auth/react";

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const { data: session } = useSession();
  console.log("Session data: ", session);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPaymentProcessing, setPaymentProcessing] = useState(false);

  const [createPayment] = useCreatePaymentMutation(); // Hook to call API for payment
  const [createOrder] = useCreateOrderMutation();

  const { items } = useCart();

  // Initialize shippingInfo state with initial values
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: "",
    address: "",
    deliveryMethod: "FREE_STANDARD", // Default delivery method
  });

  const calculateTotalPrice = () => {
    if (!items || items.length === 0) {
      return 0; // if no items, return 0
    }
    return items.reduce(
      (acc, item) => acc + item.product.price * item.count,
      0,
    );
  };

  // Handle changes in the shipping form
  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value, // Dynamically set the value based on the field's name attribute
    }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not been properly initialized.");
      return;
    }

    setError(null); // Reset errors
    setPaymentProcessing(true); // Indicate that payment is processing

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details not entered correctly.");
      setPaymentProcessing(false);
      return;
    }

    try {
      // Step 1: Create an order with the new shipping info
      const paymentAmount = calculateTotalPrice() * 100;
      const newOrder: NewOrder = {
        userId: "userIdFromSession", // Replace with the actual user ID from the session
        email,
        totalAmount: paymentAmount,
        deliveryType: shippingInfo.deliveryMethod,
        shippingInfo, // Use the updated shippingInfo state
        billingInfo: {
          address: shippingInfo.address,
          city: "DefaultCity", // Set default or required fields if they are missing from ShippingInfo
          state: "DefaultState",
          zipCode: "DefaultZip",
          phone: "1234567890", // You can customize this based on your billing form
        },
        orderItems: items.map((item) => ({
          itemId: item.product.productId,
          quantity: item.count,
        })),
        status: "Pending",
      };

      const orderResponse = await createOrder(newOrder);
      const { orderId } = orderResponse.data as { orderId: string };

      // Handle the rest of the payment logic
    } catch (error) {
      setError("An error occurred during payment processing.");
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="flex h-screen w-full justify-center bg-gray-100">
      <form
        id="payment-form"
        onSubmit={handlePaymentSubmit}
        className="w-full max-w-lg space-y-6 rounded-lg bg-white p-8 shadow-md"
      >
        {/* Signed in email at the top */}
        {session?.user?.email && (
          <div className="text-black-600 text-md mb-6">
            Signed in as {session?.user?.email}
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Email input */}
        {/* <div className="mb-4 flex flex-col">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-gray-300 p-3"
            required
            disabled={!!session?.user?.email}
          />
        </div> */}

        {/* Shipping Information */}
        <div className="mb-4 flex flex-col">
          <h3 className="mb-2 text-lg font-semibold">Shipping Information</h3>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={shippingInfo.name}
            onChange={handleShippingChange}
            className="mb-3 rounded-md border border-gray-300 p-3"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={shippingInfo.address}
            onChange={handleShippingChange}
            className="mb-3 rounded-md border border-gray-300 p-3"
            required
          />
        </div>

        {/* Delivery Method */}
        <div className="mb-4 flex flex-col">
          <label className="mb-2 text-sm font-medium">Delivery Type:</label>
          <div className="flex items-center space-x-4">
            <ul>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="FREE_STANDARD"
                  checked={shippingInfo.deliveryMethod === "FREE_STANDARD"}
                  onChange={handleShippingChange}
                  className="mr-2"
                />
                Free Standard (3-6 Business Days) $0
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="GROUND"
                  checked={shippingInfo.deliveryMethod === "GROUND"}
                  onChange={handleShippingChange}
                  className="mr-2"
                />
                Ground (2-5 Business Days) $10
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="EXPRESS"
                  checked={shippingInfo.deliveryMethod === "EXPRESS"}
                  onChange={handleShippingChange}
                  className="mr-2"
                />
                Express (order by 1pm PT to receive in 2 business days) $25
              </label>
            </ul>
          </div>
        </div>

        {/* Stripe Card Element */}
        <div className="mb-4 flex flex-col">
          <label className="mb-2 text-sm font-medium">Card Details:</label>
          <CardElement className="rounded-md border border-gray-300 p-3" />
        </div>

        {/* Display total price */}
        <p className="text-lg font-semibold">
          Total Price: ${(calculateTotalPrice() / 100).toFixed(2)}
        </p>

        <button
          className="w-full rounded-md bg-indigo-600 p-3 text-white"
          type="submit"
          disabled={isPaymentProcessing}
        >
          {isPaymentProcessing ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
