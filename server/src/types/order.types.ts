import { DeliveryType } from "shared/src/interfaces";

// Define type for an order item
export interface OrderItemInput {
  variantId: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

// Define type for shipping and billing info
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  mobilePhone: string;
  deliveryMethod: DeliveryType;
}

export interface BillingInfo {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  mobilePhone?: string;
}

// Define the input type for creating an order
export interface CreateOrderInput {
  totalAmount: number;
  email: string;
  payment?: {
    paymentId?: string;
    method: string;
    cardLast4Digits: string;
  };
  status: string;
  shippingInfo: ShippingInfo;
  billingInfo: BillingInfo;
  orderItems: OrderItemInput[];
}
