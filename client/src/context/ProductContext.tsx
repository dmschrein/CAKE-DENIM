// client/src/contect/ProductContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ProductContextType = {
  productName: string;
  setProductName: (name: string) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [productName, setProductName] = useState("");

  return (
    <ProductContext.Provider value={{ productName, setProductName }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
