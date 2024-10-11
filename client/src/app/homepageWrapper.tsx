"use client";

import React from "react";
import Navbar from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import SideCart from "@/components/layout/SideCart";
import StoreProvider from "./redux";

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  // const isSidebarCollapsed = useAppSelector(
  //   (state) => state.global.isSidebarCollapsed
  // );

  return (
    <div className="relative h-full w-full">
      {/* SideCart Component */}
      <SideCart />
      <main className="flex h-full w-full flex-col bg-gray-50 transition-all duration-300">
        {/* Navbar */}
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </main>
    </div>
  );
};

const HomePageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <HomePageLayout>{children}</HomePageLayout>
    </StoreProvider>
  );
};

export default HomePageWrapper;
