"use client";

import { FC } from "react";
import { useCart } from "@/providers/CartProvider";
import { Product, Variant } from "../../interfaces";

interface Props {
  product: Product;
  color: Variant["color"] | null;
  size: Variant["size"] | null;
}

const BuyingOptions: FC<Props> = ({ product, color, size }) => {
  const { updateCart } = useCart();

  const onAddToCartClick = () => {
    if (!color || !size) {
      alert("Please select a color and a size.");
      return;
    }
    console.log("Variant Info: ", color, size);
    // Update cart with the specific variant
    updateCart(product, color, size, 1);
  };

  return (
    <div className="flex space-x-2 p-2">
      <button
        onClick={onAddToCartClick}
        className="flex-1 border-2 border-blue-950 p-2 text-blue-950"
      >
        Add to Cart
      </button>
      <button className="flex-1 bg-blue-950 p-2 text-white">Save</button>
    </div>
  );
};

export default BuyingOptions;
