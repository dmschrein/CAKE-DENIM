import React from "react";
import Image from "next/image";
import Link from "next/link";

const CategoryFilterCard = ({
  product,
}: {
  product: { title: string; price: string; image: string; category: string };
}) => {
  return (
    <Link href={`/products?categoryId=${product.category}`} passHref>
      <div className="mb-20 h-full w-full items-center">
        <h2>PRODUCT CATEGORY: {product.title}</h2>
        <Image
          src={product.image}
          alt={product.title}
          width={680}
          height={750}
        />
        <h3 className="text-md mt-4 text-center font-semibold">
          {product.title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryFilterCard;
