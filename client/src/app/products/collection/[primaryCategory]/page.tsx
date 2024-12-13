"use client";

import CollectionPage from "@/components/common/CollectionPage";
import { Product } from "@/interfaces";
import { useGetProductsByPrimaryCategoryQuery } from "@/state/api";
import { useParams } from "next/navigation";
import React from "react";

const ProductsCollectionPage = () => {
  // Extract categoryName from useParams and ensure it is a string
  const { primaryCategory } = useParams();
  console.log("categoryName:", primaryCategory);

  // Fetch the products for the given category name
  const {
    data: { products = [] } = {},
    error,
    isLoading,
  } = useGetProductsByPrimaryCategoryQuery(primaryCategory as string);

  console.log("Category Name:", primaryCategory);
  console.log("Products returned:", products);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  if (!products || products.length === 0) {
    return <div>No products found for category: {primaryCategory}</div>;
  }

  // Format the category products
  const formattedProducts = products.map((product: Product) => ({
    productId: product.productId,
    name: product.name,
    description: product.description || "No description available",
    price: product.price,
    stockQuantity: product.stockQuantity || 0,
    imageURL: product.imageURL,
    primaryCategory: product.primaryCategory,
    categories:
      product.Categories?.map(
        (cat) => cat?.category?.categoryId || "Uncategorized",
      ) || [],
    subcategories:
      product.SubCategories?.map(
        (sub) => sub?.subcategory?.subcategoryId || "Uncategorized",
      ) || [],
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
    ProductVariants: product.ProductVariants || [],
  }));

  console.log("Formatted Products:", formattedProducts);

  return (
    <div>
      <CollectionPage
        collectionName={primaryCategory as string}
        products={formattedProducts}
      />
    </div>
  );
};

export default ProductsCollectionPage;
