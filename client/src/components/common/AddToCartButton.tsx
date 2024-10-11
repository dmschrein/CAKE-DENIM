import React from "react";
import { Product } from "../../../interfaces";
import { productQtyInCartSelector } from "@/state/features/cartSlice";
import { useAppSelector } from "@/app/redux";
import { Button } from "../layout/Button";

interface Props {
  product: Product;
}

const AddToCartButton = (props: Props) => {
  // select the product quantity of product
  const qty = useAppSelector((state) =>
    productQtyInCartSelector(state, props.product.productId)
  );
  if (!qty) {
    <div>
      <Button>Add To Bag</Button>
    </div>;
  }

  return <div>AddToCartButton</div>;
};

export default AddToCartButton;
