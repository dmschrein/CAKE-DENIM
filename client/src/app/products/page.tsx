"use client";

import CollectionPage from "@/components/common/CollectionPage";
import { useGetProductsQuery } from "@/state/api";
import { useSearchParams } from "next/navigation";
import React from "react";

const ProductsPage = () => {
  // Get the category from the url
  const searchParams = useSearchParams(); // returns a URLSearchParams
  const category = searchParams.get("category") || "All"; // category is now a string
  // Fetch the products using the category from the url
  const {
    data: { products = [], subcategories = [] } = {},
    error,
    isLoading,
  } = useGetProductsQuery({ category });

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
    categories: product.Categories?.map((cat) => cat.categoryId) || [],
    subcategories: product.SubCategories?.map((sub) => sub.subCategoryId) || [],
  }));

  return (
    <div>
      <h3>Product Page: {category}</h3>
      <CollectionPage
        collectionName={category}
        products={formattedProducts}
        subcategories={subcategories}
      />
    </div>
  );
};

export default ProductsPage;
