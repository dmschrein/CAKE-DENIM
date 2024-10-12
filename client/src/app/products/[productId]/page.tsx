// client/src/app/products/[productsId]/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation"; // Use useParams instead of useRouter
import { useGetProductByIdQuery } from "@/state/api";
// import { useAppDispatch } from "@/app/redux";
// import addToCart from "@/state";
//import AddToCartButton from "@/components/common/AddToCartButton";

const ProductsPage = () => {
  const { productId } = useParams(); // Retrieve productId directly

  console.log("Product Detail Page Product ID: ", productId);
  // Fetch product by productId
  const {
    data: product,
    error,
    isLoading,
  } = useGetProductByIdQuery(productId as string);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;

  if (!product) {
    return <div>Product not found</div>;
  }

  // const dispatch = useAppDispatch();

  // const handleAddToCart = () => {
  //   dispatch(
  //     addToCart({
  //       productId: product.productId,
  //       name: product.name,
  //       price: product.price,
  //       imageURL: product.imageURL,
  //       quantity: 1,
  //     })
  //   );
  // };

  return (
    <div className="flex flex-col space-x-8 md:flex-row">
      {/* Product Image Gallery */}
      <div className="flex flex-row space-x-2">
        {/* Product Main Image */}
        <Image
          src={product.imageURL || "/assets/cakebabe.png"}
          alt={product.name}
          width={600}
          height={800}
        />
        {/* Thumbnails */}
        <div className="flex flex-col space-y-2">
          <Image
            src={product.imageURL || "/assets/cakebabe.png"}
            alt="Thumbnail"
            width={100}
            height={150}
          />
          <Image
            src={product.imageURL || "/assets/cakebabe.png"}
            alt="Thumbnail"
            width={100}
            height={150}
          />
          <Image
            src={product.imageURL || "/assets/cakebabe.png"}
            alt="Thumbnail"
            width={100}
            height={150}
          />
          <Image
            src={product.imageURL || "/assets/cakebabe.png"}
            alt="Thumbnail"
            width={100}
            height={150}
          />
        </div>
      </div>
      {/* Product Text Description */}
      <div className="flex-1">
        <h1>{product.name}</h1>
        <p className="mt-4 text-2xl text-gray-700">${product.price}</p>

        {/* Afterpay */}
        <p className="mt-2 text-sm text-gray-500">
          Pay as low as <strong>$70/mo</strong> with Klarna, or{" "}
          <strong>$103.65/mo</strong> with Afterpay.
        </p>
        {/* Product Description */}
        <p className="mt-6">{product.description}</p>
        {/* <ul className="list-disc list-inside mt-4">
          {product.features?.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul> */}

        {/* Color Selection */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Color</h3>
          <div className="mt-2 flex space-x-2">
            <button className="h-8 w-8 rounded-full border border-gray-300 bg-black"></button>
          </div>
        </div>
        {/* Size Selection */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Size</h3>
          <div>
            {["00", "0", "2", "4", "6", "8", "10", "12"].map((size, index) => (
              <Button
                key={index}
                variant="link"
                size="sm"
                type="submit"
                className="rounded p-2 text-center"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
        {/* Add to Bag Button */}
        <div className="flex flex-row space-x-2">
          {/* <AddToCartButton product={product} /> */}
          {/* Save Button */}
          <Button
            // onClick={handleAddToCart}
            variant="outline"
            size="lg"
            type="button"
            className="mt-6 bg-gray-200 py-3 text-black"
          >
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
