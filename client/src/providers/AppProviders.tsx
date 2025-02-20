// src/providers/AppProviders.tsx

"use client";

import React, { ReactNode } from "react";
import CartProvider from "@/providers/CartProvider";
// import { ThemeProvider } from "./ThemeProvider"; remove this since we only need light mode
import StoreProvider from "@/app/redux";
import { SessionProvider } from "next-auth/react";
// import { AuthProvider } from "../context/AuthProvider";

interface Props {
  children: ReactNode;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <StoreProvider>
      <SessionProvider>
        <CartProvider>{children}</CartProvider>
      </SessionProvider>
    </StoreProvider>
  );
};

export default Providers;
