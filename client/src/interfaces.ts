// src/interfaces

// Define UserType Enum-like type
export type UserType = "EMAIL_ONLY" | "GUEST" | "REGISTERED";

export type DeliveryType = "FREE_STANDARD" | "GROUND" | "EXPRESS" | "NEXT_DAY";

export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number; // Ensure this is always defined
  stockQuantity: number;
  imageURL: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingInfo {
  name: string;
  address: string;
  deliveryMethod: DeliveryType;
}

export interface PaymentInfo {
  // Define your payment info structure here (example)
  method: string;
  cardLast4Digits: string;
}

export interface OrderSummary {
  // TODO: check if needed
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Order {
  orderId: string;
  userId: string;
  totalAmount: number;
  deliveryType: DeliveryType;
  paymentId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface NewOrder {
  userId: string;
  email: string;
  totalAmount: number;
  deliveryType?: DeliveryType;
  shippingInfo: ShippingInfo;
  billingInfo: BillingInfo;
  paymentId?: string;
  status: string;
  orderItems: NewOrderItem[];
}

export interface BillingInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
}
export interface OrderItem {
  itemId: string;
  quantity: number;
  price: number;
}

export interface NewOrderItem {
  itemId: string;
  quantity: number;
}

export interface ReviewFormProps {
  shippingInfo: ShippingInfo | null;
  paymentInfo: PaymentInfo | null;
  orderSummary: OrderSummary;
  previousStep: () => void;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface HomePageMetrics {
  popularProducts: Product[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

// User for update mutation and get queries
export interface User {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
}

// NewUser for create mutation
export interface NewUser {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  userType: UserType;
}

export interface GuestUser {
  email: string;
  sessionToken?: string;
  userType: UserType;
}

// Define the interface for the data sent in the payment request
export interface PaymentData {
  email: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
  orderId: string;
}

// Define the interface for the response from the Stripe API
export interface PaymentResponse {
  client_secret: string;
  status: string;
}
