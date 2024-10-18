// client/src/components/common/CollectionPage.tsx

import CollectionCard from "@/components/common/CollectionCard";
import React from "react";
//import CategoryCard from "./CategoryFilterCard";

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
  products: Product[]; // TODO: update to use interfaces.ts
}

const CollectionPage: React.FC<CollectionPageProps> = ({
  collectionName,
  products,
}) => {
  return (
    <div>
      <main className="container mx-auto py-10">
        {/* Header */}
        <div className="mb-15 text-center">
          <h1 className="mb-15 text-center text-3xl font-bold">
            {collectionName}
          </h1>
        </div>
        {/* Collection Section
         * TODO: Include when we have more categories and add subcategories
         */}
        {/* <div className="flex justify-center">
          <div className="mt-20 px-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8">
            {products.map((product) => (
              <div key={product.productId} className="mx-auto">
                <CategoryCard
                  key={product.productId}
                  product={{
                    title: product.name,
                    price: `$${product.price.toFixed(2)}`, // Ensure price is a string with formatting
                    image: product.imageURL, // TODO: Update images for correct subcategory
                    category: product.category || "Uncategorized",
                  }}
                />
              </div>
            ))}
          </div>
        </div> */}
        <div className="mt-20 grid grid-cols-1 items-center justify-center gap-8 px-10 md:grid-cols-2">
          {products.map((product) => (
            <CollectionCard
              key={product.productId}
              product={{
                productId: product.productId,
                title: product.name,
                price: `$${product.price.toFixed(2)}`, // Convert price to a string with two decimal places
                image: product.imageURL, //TODO: update image path later
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CollectionPage;
