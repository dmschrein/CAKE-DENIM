// client/src/app/products/[productsId]/layout.tsx

import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const ProductLayout = ({ children }: LayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb navigation */}
      <nav className="mb-4">
        <a href="/">Home</a> / <a href="/shop">SHOP</a> / ABRIL GOWN
      </nav>
      {children}
    </div>
  );
};

export default ProductLayout;
