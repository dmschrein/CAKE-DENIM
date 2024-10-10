// client/src/app/(collections)/jeans/page.tsx
"use client";

import CollectionPage from "@/components/common/CollectionPage";
import { useGetProductsQuery } from "@/state/api";
import React from "react";

const JeansCollection = () => {
  const {
    data: jeans,
    error,
    isLoading,
  } = useGetProductsQuery({ category: "Jeans" });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  // Map the API product structure to match the expected type by CollectionPage
  const formattedJeans =
    jeans?.map((product) => ({
      productId: product.productId,
      name: product.name,
      description: product.description || "No description available", // Default if description is missing
      price: product.price,
      stockQuantity: product.stockQuantity || 0, // Default if stockQuantity is missing
      imageURL: product.imageURL,
      category: product.category || "Uncategorized",
      createdAt: product.createdAt || new Date().toISOString(), // Default for createdAt
      updatedAt: product.updatedAt || new Date().toISOString(), // Default for updatedAt
    })) || [];

  return <CollectionPage collectionName="Jeans" products={formattedJeans} />;
};

export default JeansCollection;
