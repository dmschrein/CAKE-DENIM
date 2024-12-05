import React from "react";

import CustomImage from "./CustomImage";

const ProductCategoryCard = ({
  product,
}: {
  product: { image: string; category: string };
}) => {
  return (
    <div className="h-full w-full items-center">
      <CustomImage
        src={product.image}
        fallbackSrc={"/assets/hersel1-63.jpg"}
        alt={product.category}
        width={480}
        height={750}
      />
      <h3 className="mt-4 text-xl font-semibold">{product.category}</h3>
    </div>
  );
};

export default ProductCategoryCard;
