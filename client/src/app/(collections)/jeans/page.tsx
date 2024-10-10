// client/src/app/(collections)/jeans/page.tsx

import CollectionPage from "@/components/common/CollectionPage";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  category: string;
}

const JeansCollection = () => {
  const [jeans, setJeans] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    const fetchJeans = async () => {
      try {
        const response = await fetch("/api/products?category=Jeans");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setJeans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJeans();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <CollectionPage collectionName="Jeans" products={jeans} />;
};

export default JeansCollection;
