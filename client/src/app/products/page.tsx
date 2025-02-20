"use client";

import CollectionPage from "@/components/common/CollectionPage";
import { useGetProductsQuery, useSearchProductsQuery } from "@/state/api";
import React, { useEffect, useMemo, useState } from "react";

const Products = () => {
  const [search] = useState("");

  const {
    data: { products = [] } = {},
    error: allProductsError,
    isLoading: isLoadingAll,
  } = useGetProductsQuery({});

  const {
    data: filteredProducts,
    error: searchError,
    isLoading: isLoadingSearch,
  } = useSearchProductsQuery({ search }, { skip: search === "" });

  useEffect(() => {
    console.log("Initial load: All products fetched:", products);
  }, [products]);

  useEffect(() => {
    if (search) {
      console.log(`Searching for products with keyword: ${search}`);
      console.log("Filtered products fetched:", filteredProducts);
    }
  }, [search, filteredProducts]);

  const getErrorMessage = (error: any) => {
    if ("status" in error) {
      return `Error ${error.status}: ${JSON.stringify(error.data)}`;
    }
    if ("message" in error) {
      return error.message;
    }
    return "An unknown error occurred";
  };

  // Apply client-side filtering based on search input
  const productsToDisplay = search ? filteredProducts : products;

  // Memoize formattedProducts to avoid unnecessary recalculations
  const formattedProducts = useMemo(() => {
    return (
      productsToDisplay?.map((product) => {
        console.log(
          "Raw SubCategories for product:",
          product.name,
          product.SubCategories,
        );
        console.log("Raw Categories for product:", product.Categories);
        return {
          productId: product.productId,
          name: product.name,
          description: product.description || "No description available",
          price: product.price,
          stockQuantity: product.stockQuantity || 0,
          imageURL: product.imageURL || "/assets/hersel1-63.jpg",
          imageURL2: product.imageURL2,
          primaryCategory: product.primaryCategory,
          categories:
            product.Categories?.map(
              (cat) => cat?.category?.categoryName || "Uncategorized",
            ) || [],
          subcategories:
            product.SubCategories?.map(
              (sub) => sub?.subcategory?.subcategoryName || "Uncategorized",
            ) || [],
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString(),
        };
      }) || []
    );
  }, [productsToDisplay]);

  useEffect(() => {
    console.log("Products to display:", formattedProducts);
  }, [formattedProducts]);

  return (
    <div>
      {/* TODO: Search Input */}
      {/* <div>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div> */}

      {/* Display products */}
      {(isLoadingAll || isLoadingSearch) && <p>Loading products...</p>}
      {(allProductsError || searchError) && (
        <p>{getErrorMessage(allProductsError || searchError)}</p>
      )}
      {formattedProducts.length > 0 ? (
        <CollectionPage
          collectionName="Products"
          products={formattedProducts}
        />
      ) : (
        !isLoadingAll && !isLoadingSearch && <p>No products found.</p>
      )}
    </div>
  );
};

export default Products;
