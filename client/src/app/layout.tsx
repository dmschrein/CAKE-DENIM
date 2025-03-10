// src/app/layout.tsx
import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
//import ModalProvider from "@/providers/modal-provider";
import HomePageWrapper from "./homepageWrapper";
import { Analytics } from "@vercel/analytics/react";
import { ProductProvider } from "@/context/ProductContext";
import { Toaster } from "@/components/ui/toaster";

const lora = Lora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "% | CAKE DENIM", absolute: "CAKE DENIM" },
  description: "Luxury Travel Essentials", // Adventure Awaits
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* children comes from  */}

      <body className={lora.className}>
        <HomePageWrapper>
          <ProductProvider>
            {children}
            <Toaster />
            <Analytics />
          </ProductProvider>
        </HomePageWrapper>
      </body>
    </html>
  );
}
