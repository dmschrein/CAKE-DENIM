import React from "react";
import CollectionCard from "@/components/common/CollectionCard";

const JeansCollection = () => {
  const jeans = [
    {
      id: 1,
      title: "Sustainable Skinny Jeans",
      price: "$89.99",
      image: "/assets/7.png",
    },
    {
      id: 2,
      title: "High-Rise Relaxed Jeans",
      price: "$99.99",
      image: "/assets/7.png",
    },
    // More jeans products
  ];

  return (
    <div>
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Jeans Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {jeans.map((jean) => (
            <CollectionCard key={jean.id} product={jean} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default JeansCollection;
