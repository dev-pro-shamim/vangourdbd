import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { CMSProvider } from "@/context/CMSContext";
import StoreLayoutWrapper from "@/components/layout/StoreLayoutWrapper";
import { BRAND } from "@/config/brand";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} BD - The Premium Fashion & Lifestyle Brand`,
  description:
    "Explore the latest tactical streetwear, oversized tees, half shirts, bootcut denim, cargo pants, and winter wear by VANGUARD BD.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans antialiased text-[#252a34] bg-[#faf9f6] selection:bg-black selection:text-white">
        <CMSProvider>
          <AppProvider>
            <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
          </AppProvider>
        </CMSProvider>
      </body>
    </html>
  );
}
