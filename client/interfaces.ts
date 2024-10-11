export interface Product {
  productId: string;
  name: string;
  price: number;
  imageURL: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
