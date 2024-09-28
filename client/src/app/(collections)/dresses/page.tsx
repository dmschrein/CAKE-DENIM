import CollectionPage from "@/components/common/CollectionPage";
import React from "react";

const DressesCollection = () => {
  const dresses = [
    {
      id: 1,
      title: "Sustainable Floral Dress",
      price: "$89.99",
      image: "/assets/3.png",
      category: "Occasion",
    },
    {
      id: 2,
      title: "Short Dress",
      price: "$99.99",
      image: "/assets/3.png",
      category: "Under $200",
    },
    {
      id: 3,
      title: "Long Elegant Dress",
      price: "$120.00",
      image: "/assets/4.png",
      category: "Bestselling",
    },
    {
      id: 4,
      title: "Party Dress",
      price: "$150.00",
      image: "/assets/5.png",
      category: "Workwear",
    },
    {
      id: 5,
      title: "Long Elegant Dress",
      price: "$120.00",
      image: "/assets/4.png",
      category: "Denim Dresses",
    },
    {
      id: 6,
      title: "Party Dress",
      price: "$150.00",
      image: "/assets/5.png",
      category: "Fall Dresses",
    },
  ];

  return <CollectionPage collectionName="Dresses" products={dresses} />;
};

export default DressesCollection;
