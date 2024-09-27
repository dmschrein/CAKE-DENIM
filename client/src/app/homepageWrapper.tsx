"use client";

import React from "react";
import Navbar from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <main>
        <Navbar />
        {children}
        <Footer />
      </main>
    </div>
  );
};

const HomePageWrapper = ({ children }: { children: React.ReactNode }) => {
  return <HomePageLayout>{children}</HomePageLayout>;
  //<StoreProvider></StoreProvider>;
};

export default HomePageWrapper;
