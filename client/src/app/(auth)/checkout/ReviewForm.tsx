import { ShippingInfo } from "@/interfaces";
import { PaymentInfo } from "@/interfaces";
import { OrderSummary } from "@/interfaces";

interface ReviewFormProps {
  shippingInfo: ShippingInfo | null;
  paymentInfo: PaymentInfo | null;
  orderSummary: OrderSummary;
  previousStep: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  shippingInfo,
  paymentInfo,
  orderSummary,
  previousStep,
}) => {
  return (
    <div>
      <h2>Review Your Order</h2>
      <div>
        <h3>Shipping Information</h3>
        {shippingInfo ? (
          <>
            <p>Name: {shippingInfo.name}</p>
            <p>Address: {shippingInfo.address}</p>
            <p>Delivery Method: {shippingInfo.deliveryMethod}</p>
          </>
        ) : (
          <p>No shipping information available</p>
        )}
      </div>

      <div>
        <h3>Payment Information</h3>
        {paymentInfo ? (
          <>
            <p>Payment Method: {paymentInfo.method}</p>
            <p>Card ending in: {paymentInfo.cardLast4Digits}</p>
          </>
        ) : (
          <p>No payment information available</p>
        )}
      </div>

      <div>
        <h3>Order Summary</h3>
        <p>Subtotal: ${orderSummary.subtotal.toFixed(2)}</p>
        <p>Shipping: ${orderSummary.shipping.toFixed(2)}</p>
        <p>Tax: ${orderSummary.tax}</p>
        <p>Total: ${orderSummary.total.toFixed(2)}</p>
      </div>

      <button onClick={previousStep}>Back</button>
    </div>
  );
};

export default ReviewForm;
