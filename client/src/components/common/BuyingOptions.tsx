"use client";

import { FC } from "react";
import { useCart } from "@/providers/CartProvider";
import { Product, Variant } from "../../interfaces";

interface Props {
  product: Product;
  variantId: Variant["variantId"] | null | undefined;
  color: Variant["color"] | null;
  size: Variant["size"] | null;
}
{
  /* 6. Rendered with product, variantId, color, size */
}
const BuyingOptions: FC<Props> = ({ product, variantId, color, size }) => {
  const { updateCart } = useCart();

  {
    /* 6. Called when the Add to Car button is clicked */
  }
  const onAddToCartClick = () => {
    if (!variantId || !color || !size) {
      alert("Please select a color and a size.");
      return;
    }
    console.log("Variant Info: ", color, size);
    // updateCart from the useCart hook to add the item to the cart with the
    // specified details (product, variantId, color, size, and quantity of 1
    updateCart(product, variantId, color, size, 1);
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
