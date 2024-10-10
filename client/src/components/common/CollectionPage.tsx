// client/src/components/common/CollectionPage.tsx

import CollectionCard from "@/components/common/CollectionCard";
import React from "react";
import CategoryCard from "./CategoryFilterCard";

interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageURL: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface CollectionPageProps {
  collectionName: string;
  products: Product[];
}

const CollectionPage: React.FC<CollectionPageProps> = ({
  collectionName,
  products,
}) => {
  return (
    <div>
      <main className="container mx-auto py-10">
        {/* Header */}
        <div className="text-center mb-15">
          <h1 className="text-3xl font-bold mb-15 text-center">
            {collectionName}
          </h1>
        </div>
        {/* Collection Section */}
        // TODO: Include when we have more categories and add subcategories
        {/* <div className="flex justify-center">
          <div className="mt-20 px-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8">
            {products.map((product) => (
              <div key={product.productId} className="mx-auto">
                <CategoryCard
                  key={product.productId}
                  product={{
                    title: product.name,
                    price: `$${product.price.toFixed(2)}`, // Ensure price is a string with formatting
                    image: "/assets/nightingale.png", // TODO: Update images for correct subcategory
                    category: product.category || "Uncategorized",
                  }}
                />
              </div>
            ))}
          </div>
        </div> */}
        <div className="px-10 mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
          {products.map((product) => (
            <CollectionCard
              key={product.productId}
              product={{
                id: Number(product.productId), // Convert productId to a number for CollectionCard
                title: product.name,
                price: `$${product.price.toFixed(2)}`, // Convert price to a string with two decimal places
                image: "/assets/nightingale.png", //TODO: update image path later
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CollectionPage;
