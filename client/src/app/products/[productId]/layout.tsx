// client/src/app/products/[productsId]/layout.tsx

import Link from "next/link";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const ProductLayout = ({ children }: LayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb navigation */}
      <nav className="mb-4">
        <Link href="/">Home</Link> / <Link href="/products/shopAll">SHOP</Link>{" "}
        / ABRIL GOWN
      </nav>
      {children}
    </div>
  );
};

export default ProductLayout;
