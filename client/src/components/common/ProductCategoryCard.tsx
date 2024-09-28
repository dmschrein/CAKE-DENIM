import React from "react";
import Image from "next/image";

const ProductCategoryCard = ({
  product,
}: {
  product: { image: string; category: string };
}) => {
  return (
    <div className="h-full w-full items-center">
      <Image
        src={product.image}
        alt={product.category}
        width={480}
        height={750}
      />
      <h3 className="text-xl font-semibold mt-4">{product.category}</h3>
    </div>
  );
};

export default ProductCategoryCard;
