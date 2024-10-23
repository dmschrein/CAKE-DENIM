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
  deliveryMethod: string;
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
  tax: string;
  total: number;
}

export interface Order {
  orderId: number;
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
  totalAmount: number;
  deliveryType?: DeliveryType;
  paymentId?: string;
  status: string;
  orderItems: NewOrderItem[];
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
