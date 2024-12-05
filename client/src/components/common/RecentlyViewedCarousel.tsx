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

  const formattedRecentlyViewed = recentlyViewed.map((product) => ({
    image: product.image,
    fallbackSrc: "/assets/jeansback.png",
    category: product.category,
  }));

  return (
    <div className="mb-10">
      <h2 className="mb-4 text-2xl font-semibold">Recently Viewed Items</h2>
      <CarouselSize categories={formattedRecentlyViewed} />
    </div>
  );
};

export default RecentlyViewedCarousel;
