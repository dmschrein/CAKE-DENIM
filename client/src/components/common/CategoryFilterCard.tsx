import React from "react";
import Image from "next/image";

const CategoryFilterCard = ({
  product,
}: {
  product: { title: string; price: string; image: string; category: string };
}) => {
  return (
    <div className="h-full w-full items-center mb-20">
      <Image src={product.image} alt={product.title} width={680} height={750} />
      <h3 className="text-md text-center font-semibold mt-4">
        {product.category}
      </h3>
    </div>
  );
};

export default CategoryFilterCard;
