import React from "react";
import Image from "next/image";

const CollectionCard = ({
  product,
}: {
  product: { title: string; price: string; image: string };
}) => {
  return (
    <div className="h-full w-full items-center">
      <Image src={product.image} alt={product.title} width={680} height={750} />
      <h3 className="text-xl font-semibold mt-4">{product.title}</h3>
      <p className="text-lg text-gray-700">{product.price}</p>
    </div>
  );
};

export default CollectionCard;
