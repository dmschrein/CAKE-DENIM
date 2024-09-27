import CollectionCard from "@/components/common/CollectionCard";
import React from "react";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
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
        {/* Collection Section */}
        <h1 className="text-3xl font-bold mb-6">{collectionName} Collection</h1>
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
