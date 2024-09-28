import CollectionCard from "@/components/common/CollectionCard";
import React from "react";
import CategoryCard from "./CategoryFilterCard";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  category: string;
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

        {/* Category filter for collection */}

        {/* Collection Section */}
        <div className="mt-20 px-10 grid grid-cols-1 md:grid-cols-6 gap-8 justify-center items-center">
          {products.map((product) => (
            <CategoryCard key={product.id} product={product} />
          ))}
        </div>
        <div className="px-10 grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
          {products.map((product) => (
            <CollectionCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CollectionPage;
