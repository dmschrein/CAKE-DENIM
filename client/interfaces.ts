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
