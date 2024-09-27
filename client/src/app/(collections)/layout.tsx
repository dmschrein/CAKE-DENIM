// app/collections/layout.tsx
import { CarouselSize } from "@/components/common/ProductCarousel";
import React from "react";

// Example category data, you can modify this as needed for your use case
const categories = [
  {
    image: "/assets/3.png",
    category: "Wide Jeans",
  },
  {
    image: "/assets/2.png",
    category: "Straight Jeans",
  },
  {
    image: "/assets/1.png",
    category: "Short Dresses",
  },
  {
    image: "/assets/2.png",
    category: "Long Dresses",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="items-center text-center">Collections Layout</h1>
      <div className="flex flex-col items-center">
        {/* Pass categories prop to CarouselSize */}
        <CarouselSize categories={categories} key="carousel" />
      </div>
      {children} {/* Render the child pages */}
    </div>
  );
}
