// client/src/app/products/[productId]/page.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation"; // Use useParams instead of useRouter
import {
  useGetProductByIdQuery,
  useGetVariantsByProductIdQuery,
} from "@/state/api";
import { Product } from "@/interfaces";
// import { useAppDispatch } from "@/app/redux";
// import addToCart from "@/state";
// import AddToCartButton from "@/components/common/AddToCartButton";

const ProductsPage = () => {
  const { productId } = useParams(); // Retrieve productId directly
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  console.log("Product Detail Page Product ID: ", productId);

  // Fetch product by productId
  const {
    data: product,
    error: productError,
    isLoading: productLoading,
  } = useGetProductByIdQuery(productId as string);

  // Fetch variants using the product variants
  const {
    data: variants,
    error: variantsError,
    isLoading: variantsLoading,
  } = useGetVariantsByProductIdQuery(productId as string);

  if (productLoading || variantsLoading) return <div>Loading...</div>;
  // Display error messages if fetching product or variants fails
  if (productError) return <div>Error loading product</div>;
  if (variantsError) return <div>Error loading product variants</div>;

  if (!product) {
    return <div>Product not found</div>;
  }

  if (variantsError) return <div>Error loading variants</div>;

  if (!variants) {
    return <div>Product variants not found</div>;
  }

  console.log("Product Variants: ", variants);

  const uniqueColors = Array.from(new Set(variants.map((v) => v.color)));
  const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)));

  // Filter the correct variant based on selected size and color
  const selectedVariant = variants.find(
    (variant) =>
      variant.size === selectedSize && variant.color === selectedColor,
  );

  // const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select both color and size.");
      return;
    }

    // Dispatch action to add the selected variant to the cart
    // dispatch(
    //   addToCart({
    //     productId: product.productId,
    //     variantId: selectedVariant.variantId,
    //     name: product.name,
    //     price: selectedVariant.price,
    //     imageURL: product.imageURL,
    //     quantity: 1,
    //   })
    // );
    console.log("Added to cart:", selectedVariant);
  };

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
          {[...Array(4)].map((_, i) => (
            <Image
              src={product.imageURL || "/assets/cakebabe.png"}
              alt="Thumbnail"
              width={100}
              height={150}
            />
          ))}
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

        {/* Color Selection */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Color</h3>
          <div className="mt-2 flex space-x-2">
            {uniqueColors.map((color, index) => (
              <button
                key={index}
                className={`h-8 w-8 rounded-full border ${
                  selectedColor === color
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Size</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueSizes.map((size, index) => (
              <Button
                key={index}
                variant="link"
                size="sm"
                type="button"
                className={`rounded p-2 ${
                  selectedSize === size ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        {/* Add to Bag Button */}
        <div className="mt-6 flex flex-row space-x-2">
          <Button
            onClick={handleAddToCart}
            variant="default"
            size="lg"
            className="bg-black py-3 text-white"
          >
            Add to Cart
          </Button>
          {/* Save Button */}
          <Button
            variant="outline"
            size="lg"
            type="button"
            className="bg-gray-200 py-3 text-black"
          >
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
