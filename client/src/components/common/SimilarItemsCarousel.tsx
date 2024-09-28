import React, { useEffect, useState } from "react";
import { CarouselSize } from "@/components/common/ProductCarousel";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  category: string;
}

const SimilarItemsCarousel = ({ category }: { category: string }) => {
  const [similarItems, setSimilarItems] = useState<Product[]>([]);

  useEffect(() => {
    // TODO: Fetch similar items based on category or other logic from an API
    const fetchSimilarItems = async () => {
      const response = await fetch(`/api/similar-items?category=${category}`);
      const data = await response.json();
      setSimilarItems(data);
    };
    fetchSimilarItems();
  }, [category]);

  if (!similarItems.length) return null; // No similar items, hide the carousel.

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Similar Items</h2>
      <CarouselSize categories={similarItems} />
    </div>
  );
};

export default SimilarItemsCarousel;
