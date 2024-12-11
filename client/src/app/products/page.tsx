"use client";

import CollectionPage from "@/components/common/CollectionPage";
import { useGetProductsQuery } from "@/state/api";
import { useSearchParams } from "next/navigation";
import React from "react";

const ProductsPage = () => {
  // Get the category from the url
  const searchParams = useSearchParams(); // returns a URLSearchParams
  const categoryId = searchParams.get("categoryId") || "All"; // category is now a string
  // Fetch the products and subcategories using the categoryId from the url
  const {
    data: { products = [], subcategories = [] } = {},
    error,
    isLoading,
  } = useGetProductsQuery({ categoryId });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;

  if (!products) {
    return <div>Product not found</div>;
  }

  // format the category products
  const formattedProducts = products.map((product) => ({
    productId: product.productId,
    name: product.name,
    description: product.description || "No description available",
    price: product.price,
    stockQuantity: product.stockQuantity || 0,
    imageURL: product.imageURL,
    categories:
      product.Categories?.map(
        (cat) => cat?.category?.categoryId || "Uncategorized",
      ) || [],
    subcategories:
      product.SubCategories?.map(
        (sub) => sub?.subcategory?.subCategoryId || "Uncategorized",
      ) || [],
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
    ProductVariants: product.ProductVariants || [],
  }));

  return (
    <div>
      <h3>Product Page: {categoryId}</h3>
      <CollectionPage
        collectionName={categoryId}
        products={formattedProducts}
        subcategories={subcategories}
      />
    </div>
  );
};

export default ProductsPage;
