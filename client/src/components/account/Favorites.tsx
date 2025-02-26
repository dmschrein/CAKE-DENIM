"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useGetFavoritesQuery } from "@/state/api";

const Favorites: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    data: favorites,
    isLoading,
    isError,
  } = useGetFavoritesQuery(userId ?? "", {
    skip: !userId, // Skip query if no user is logged in
  });

  if (isLoading)
    return <div className="text-center">Loading your favorite products...</div>;

  if (isError || !favorites || favorites.length === 0)
    return <div className="text-center">No favorites found.</div>;

  return (
    <div className="justify-top flex min-h-screen flex-col items-center bg-white p-6">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Your Favorites
        </h2>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((product) => {
            const imageUrl =
              product?.imageURL ??
              (Array.isArray(product?.imageURL2) ? product.imageURL2[0] : null);

            return (
              <li
                key={product.productId}
                className="w-full max-w-sm rounded-md border bg-white p-4 shadow-md transition hover:shadow-lg"
              >
                <Link href={`/products/${product.productId}`} className="block">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={240}
                      height={360}
                      className="mx-auto h-60 w-60 rounded-md object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="mx-auto flex h-60 w-60 items-center justify-center rounded-md bg-gray-200">
                      No Image
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <p className="text-lg font-semibold text-gray-900 hover:text-blue-700">
                      {product.name}
                    </p>
                    <p className="text-gray-500">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Favorites;
