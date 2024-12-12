// client/src/components/common/CollectionPage.tsx

import CollectionCard from "@/components/common/CollectionCard";
import React from "react";
//import CategoryCard from "./CategoryFilterCard";
import { Product, SubCategory } from "@/interfaces";
import CategoryFilterCard from "./CategoryFilterCard";

interface CollectionPageProps {
  collectionName: string;
  products: Product[]; // TODO: update to use interfaces.ts
}

const CollectionPage: React.FC<CollectionPageProps> = ({
  collectionName,
  products,
}) => {
  console.log("collectionName: ", collectionName);
  console.log("products: ", products);

  return (
    <div>
      <main className="container mx-auto py-10">
        {/* Header */}
        <div className="mb-15 text-center">
          <h1 className="mb-15 text-center text-3xl font-bold">
            Collection Name:
            {collectionName}
          </h1>
        </div>
        {/* Collection Section
         * TODO: Include when we have more categories and add subcategories
         */}
        <div className="flex justify-center">
          <div className="mt-20 grid grid-cols-1 gap-8 px-20 sm:grid-cols-2 md:grid-cols-6">
            {/* <h3>Category Filter Cards</h3>
            {subcategories.map((sub) => (
              <CategoryFilterCard
                key={sub.id}
                product={{
                  title: sub.name,
                  price: "",
                  image: "/placeholder.jpg", // Replace with appropriate image
                  category: sub.id,
                }}
              />
            ))} */}
          </div>
        </div>
        <div className="mt-20 grid grid-cols-1 items-center justify-center gap-8 px-10 md:grid-cols-2">
          {products.map((product) => (
            <CollectionCard
              key={product.productId}
              product={{
                productId: product.productId,
                title: product.name,
                price: `$${product.price.toFixed(2)}`, // Convert price to a string with two decimal places
                image: product.imageURL, //TODO: update image path later
                category: product.Categories,
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CollectionPage;
