// app/collections/layout.tsx
import { CarouselSize } from "@/components/common/ProductCarousel";
import React from "react";

// Example category data, you can modify this as needed for your use case
const categories = [
  {
    image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/dress.png",
    fallbackSrc: "/assets/dress.png",
    category: "Wide Jeans",
  },
  {
    image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/dress.png",
    fallbackSrc: "/assets/dress.png",
    category: "Straight Jeans",
  },
  {
    image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/dress.png",
    fallbackSrc: "/assets/dress.png",
    category: "Short Dresses",
  },
  {
    image: "https://s3-cakedenim.s3.us-west-1.amazonaws.com/dress.png",
    fallbackSrc: "/assets/dress.png",
    category: "Long Dresses",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="items-center text-center">Collections Layout</h1>
      {children} {/* Render the child pages */}
      <div className="flex flex-col items-center">
        {/* Pass categories prop to CarouselSize */}
        <h1 className="mb-6 items-center text-center text-3xl font-bold">
          Similar Products
        </h1>
        <CarouselSize categories={categories} key="carousel" />
      </div>
    </div>
  );
}
