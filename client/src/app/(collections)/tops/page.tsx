// client/src/app/(collections)/tops/page.tsx
"use client";

import CollectionPage from "@/components/common/CollectionPage";
import { useGetProductsQuery } from "@/state/api";
import React from "react";

const TopsCollection = () => {
  const {
    data: tops,
    error,
    isLoading,
  } = useGetProductsQuery({ category: "Tops" });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  console.log("Tops Collection Product Data: ", tops);
  // Map the API product structure to match the expected type by CollectionPage
  const formattedTops =
    tops?.map((product) => ({
      productId: product.productId,
      name: product.name,
      description: product.description || "No description available",
      price: product.price,
      stockQuantity: product.stockQuantity || 0,
      imageURL: "/assets/ochoa.png",
      category: product.category || "Uncategorized",
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
    })) || [];

  return <CollectionPage collectionName="Tops" products={formattedTops} />;
};
export default TopsCollection;
