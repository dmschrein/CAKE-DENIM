import CollectionPage from "@/components/common/CollectionPage";
import React from "react";

const JeansCollection = () => {
  const jeans = [
    {
      id: 1,
      title: "Sustainable Skinny Jeans",
      price: "$89.99",
      image: "/assets/7.png",
      category: "High Rise",
    },
    {
      id: 2,
      title: "High-Rise Relaxed Jeans",
      price: "$99.99",
      image: "/assets/morrison.png",
      category: "Mid Rise",
    },
    {
      id: 3,
      title: "Wide-Leg Jeans",
      price: "$110.00",
      image: "/assets/hershel.png",
      category: "Relaxed Fit",
    },
    {
      id: 4,
      title: "Straight-Leg Jeans",
      price: "$95.00",
      image: "/assets/wide-leg.png",
      category: "Wide Leg",
    },
    {
      id: 5,
      title: "Wide-Leg Jeans",
      price: "$110.00",
      image: "/assets/cakebabe.png",
      category: "Straight Leg",
    },
    {
      id: 6,
      title: "Straight-Leg Jeans",
      price: "$95.00",
      image: "/assets/7.png",
      category: "Stretch Denim",
    },
  ];

  return <CollectionPage collectionName="Jeans" products={jeans} />;
};

export default JeansCollection;
