"use client";

import React from "react";
import Navbar from "@/components/home/navigation";
import Header from "@/components/home/header";

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <main>
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const HomePageWrapper = ({ children }: { children: React.ReactNode }) => {
  return <HomePageLayout>{children}</HomePageLayout>;
  //<StoreProvider></StoreProvider>;
};

export default HomePageWrapper;
