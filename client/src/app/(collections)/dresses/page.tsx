import React from "react";
import Layout from "@/app/(collections)/layout";
import CollectionCard from "@/components/common/CollectionCard";

const DressesCollection = () => {
  // Categories for dresses carousel
  const dressCategories = [
    {
      image: "/assets/long-dress.jpg",
      category: "Long Dresses",
    },
    {
      image: "/assets/short-dress.jpg",
      category: "Short Dresses",
    },
  ];

  const dresses = [
    {
      id: 1,
      title: "Sustainable Floral Dress",
      price: "$89.99",
      image: "/assets/3.png",
    },
    {
      id: 2,
      title: "Short Dress",
      price: "$99.99",
      image: "/assets/3.png",
    },
    {
      id: 1,
      title: "Sustainable Floral Dress",
      price: "$89.99",
      image: "/assets/3.png",
    },
    {
      id: 2,
      title: "Short Dress",
      price: "$99.99",
      image: "/assets/3.png",
    },
    // More dresses...
  ];

  return (
    <div>
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Dresses Collection</h1>
        <div className="px-10 grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
          {/* Product cards section */}
          {dresses.map((dress) => (
            <CollectionCard key={dress.id} product={dress} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default DressesCollection;
