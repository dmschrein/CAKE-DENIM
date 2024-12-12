"use client";

import CollectionPage from "@/components/common/CollectionPage";
import { useGetProductsQuery } from "@/state/api";
import { useSearchParams } from "next/navigation";
import React from "react";

const ProductsPage = () => {
  // Get the category from the url
  const searchParams = useSearchParams(); // returns a URLSearchParams
  const categoryName = searchParams.get("categoryName") || "All"; // category is now a string
  // Fetch the products and subcategories using the categoryId from the url
  const {
    data: { products = [], categories, subcategories = [] } = {},
    error,
    isLoading,
  } = useGetProductsQuery({ categoryName });

  console.log("Products returned:", products);
  console.log("SubCategories returned:", subcategories);
  console.log("Categories returned:", categories);

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
        (sub) => sub?.subcategory?.subcategoryId || "Uncategorized",
      ) || [],
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
    ProductVariants: product.ProductVariants || [],
  }));

  console.log(formattedProducts);
  return (
    <div>
      <h3>Product Page: {}</h3>
      <CollectionPage
        collectionName={categoryName}
        products={formattedProducts}
        subcategories={subcategories}
      />
    </div>
  );
};

export default ProductsPage;
