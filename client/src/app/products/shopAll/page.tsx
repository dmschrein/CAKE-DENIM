"use client";

import CollectionPage from "@/components/common/CollectionPage";
import { useGetProductsQuery, useSearchProductsQuery } from "@/state/api";
import React, { useEffect, useState } from "react";

const ShopAll = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const {
    data: allProducts,
    error: allProductsError,
    isLoading: isLoadingAll,
  } = useGetProductsQuery({});

  const {
    data: filteredProducts,
    error: searchError,
    isLoading: isLoadingSearch,
  } = useSearchProductsQuery({ search }, { skip: search === "" });

  useEffect(() => {
    console.log("Initial load: All products fetched:", allProducts);
  }, [allProducts]);

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
  const productsToDisplay = search ? filteredProducts : allProducts;

  const formattedProducts =
    productsToDisplay?.map((product) => ({
      productId: product.productId,
      name: product.name,
      description: product.description || "No description available",
      price: product.price,
      stockQuantity: product.stockQuantity || 0,
      imageURL: "/assets/kennedy2-71.jpg",
      category: product.category || "Uncategorized",
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
    })) || [];

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

export default ShopAll;
