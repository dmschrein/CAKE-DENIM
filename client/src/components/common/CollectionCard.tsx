import React from "react";
import Image from "next/image";
import Link from "next/link";

const CollectionCard = ({
  product,
}: {
  product: { productId: string; title: string; price: string; image: string };
}) => {
  console.log("CollectionCard Product ID: ", product.productId);
  return (
    <Link href={`/products/${product.productId}`} passHref>
      <div className="h-full w-full items-center cursor-pointer">
        <Image
          src={product.image}
          alt={product.title}
          width={680}
          height={750}
          className="object-cover"
        />
        <h3 className="text-xl font-semibold mt-4">{product.title}</h3>
        <p className="text-lg text-gray-700">{product.price}</p>
      </div>
    </Link>
  );
};

export default CollectionCard;
