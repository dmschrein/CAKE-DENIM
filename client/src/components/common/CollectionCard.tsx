import React from "react";
import Image from "next/image";
import Link from "next/link";

const CollectionCard = ({
  product,
}: {
  product: {
    // product comes from COllectionPage.tsx
    productId: string;
    title: string;
    price: string;
    image: string;
    imageURL2: string[];
    category: string;
  };
}) => {
  console.log("CollectionCard Product ID: ", product.productId);

  return (
    <Link href={`/products/${product.productId}`} passHref>
      <div className="h-full w-full cursor-pointer items-center">
        <Image
          src={product.image}
          alt={product.title}
          width={600}
          height={800}
          className="object-cover"
        />
        <h3 className="mt-4 text-xl font-semibold">{product.title}</h3>
        <p className="text-lg text-gray-700">{product.price}</p>
      </div>
    </Link>
  );
};

export default CollectionCard;
