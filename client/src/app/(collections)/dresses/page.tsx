// client/src/app/(collections)/dresses/page.tsx
"use client";

import CollectionPage from "@/components/common/CollectionPage";
import { useGetProductsQuery } from "@/state/api";
import React from "react";

const DressesCollection = () => {
  const {
    data: dresses,
    error,
    isLoading,
  } = useGetProductsQuery({ category: "Dresses" });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error handling products</div>;

  console.log("In /(collections)/dresses/page.tsx Dresses Data: ", dresses);

  // Map the API product structure to match the expected type by CollectionPage
  const formattedDresses =
    dresses?.map((product) => ({
      productId: product.productId,
      name: product.name,
      description: product.description || "No description available",
      price: product.price,
      stockQuantity: product.stockQuantity || 0,
      imageURL: product.imageURL || "/assets/dress.png",
      category: product.category || "Uncategorized",
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
    })) || [];

  console.log("Product Data: ", formattedDresses);
  return (
    <CollectionPage collectionName="Dresses" products={formattedDresses} />
  );
};

export default DressesCollection;
