import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
//import ModalProvider from "@/providers/modal-provider";
import HomePageWrapper from "./homepageWrapper";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CAKE DENIM",
  description: "All in one Brand Manager Solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* children comes from  */}

      <body className={font.className}>
        <HomePageWrapper>{children}</HomePageWrapper>
      </body>
    </html>
  );
}
