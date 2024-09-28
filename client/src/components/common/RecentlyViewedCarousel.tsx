import React, { useEffect, useState } from "react";
import { CarouselSize } from "@/components/common/ProductCarousel";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  category: string;
}

const RecentlyViewedCarousel = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch recently viewed products from localStorage or an API
    const storedItems = localStorage.getItem("recentlyViewed");
    if (storedItems) {
      setRecentlyViewed(JSON.parse(storedItems));
    }
  }, []);

  if (!recentlyViewed.length) return null; // No recently viewed items, hide the carousel.

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Recently Viewed Items</h2>
      <CarouselSize categories={recentlyViewed} />
    </div>
  );
};

export default RecentlyViewedCarousel;
