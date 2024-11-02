// src/interfaces
import { z } from "zod";

// Define UserType Enum-like type
export type UserType = "EMAIL_ONLY" | "GUEST" | "REGISTERED";

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

<<<<<<< Updated upstream
=======
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

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  mobilePhone?: string;
  deliveryMethod: DeliveryType;
}
export interface BillingInfo {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  mobilePhone?: string;
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

>>>>>>> Stashed changes
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

export interface User {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
}

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
<<<<<<< Updated upstream
=======

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

// Zod schemas for validation

// export const BillingInfoSchema = z.object({
//   firstName: z.string(),
//   lastName: z.string(),
//   address1: z.string(),
//   address2: z.string().optional().nullable(), // Allow undefined or null
//   city: z.string(),
//   state: z.string(),
//   zipCode: z.string(),
//   country: z.string(),
//   mobilePhone: z.string().optional().nullable(), // Allow undefined or null
// });

// export const ShippingInfoSchema = BillingInfoSchema.extend({
//   deliveryMethod: z.enum(["FREE_STANDARD", "GROUND", "EXPRESS", "NEXT_DAY"]),
// });

// // Infer types from Zod schemas if needed
// export type BillingInfoType = z.infer<typeof BillingInfoSchema>;
// export type ShippingInfoType = z.infer<typeof ShippingInfoSchema>;
>>>>>>> Stashed changes
