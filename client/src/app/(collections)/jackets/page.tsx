// client/src/app/(collections)/jackets/page.tsx
"use client";

import CollectionPage from "@/components/common/CollectionPage";
import { useGetProductsQuery } from "@/state/api";
import React from "react";

const JacketsCollection = () => {
  const {
    data: jackets,
    error,
    isLoading,
  } = useGetProductsQuery({ category: "Jackets" });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  console.log("Jackets Collection Product Data: ", jackets);

  const formattedJackets =
    jackets?.map((product) => ({
      productId: product.productId,
      name: product.name,
      description: product.description || "No description available",
      price: product.price,
      stockQuantity: product.stockQuantity || 0,
      imageURL:
        "https://s3-cakedenim.s3.us-west-1.amazonaws.com/kennedy2-71.jpg",
      category: product.category || "Uncategorized",
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
    })) || [];
  return (
    <CollectionPage collectionName="Jackets" products={formattedJackets} />
  );
};

export default JacketsCollection;
