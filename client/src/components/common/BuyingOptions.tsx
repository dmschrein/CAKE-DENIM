"use client";

import { FC } from "react";
import { useCart } from "@/providers/CartProvider";
import { Product } from "../../../interfaces";

interface Props {
  product: Product;
}

const BuyingOptions: FC<Props> = ({ product }) => {
  const { updateCart } = useCart();
  const onAddToCartClick = () => {
    updateCart({ ...product, price: product.price || 0 }, 1);
  };

  return (
    <div className="flex space-x-2 p-2">
      <button
        onClick={onAddToCartClick}
        className="flex-1 rounded-md border-2 border-blue-950 p-2 text-blue-950"
      >
        Add to Cart
      </button>
      <button className="flex-1 rounded-md bg-blue-950 p-2 text-white">
        Buy Now
      </button>
    </div>
  );
};

export default BuyingOptions;
