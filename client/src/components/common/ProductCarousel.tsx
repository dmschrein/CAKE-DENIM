import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CollectionCard from "./CollectionCard";
import ProductCategoryCard from "./ProductCategoryCard";

export function CarouselSize({
  categories,
}: {
  categories: { image: string; category: string }[];
}) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-screen-lg"
    >
      <CarouselContent>
        {categories.map((category, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-4">
              <ProductCategoryCard product={category} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
