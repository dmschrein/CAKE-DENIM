// src/interfaces

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
