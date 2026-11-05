"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomNav from "@/components/common/MobileBottomNav";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchModal from "@/components/common/SearchModal";
import QuickViewModal from "@/components/product/QuickViewModal";
import FloatingCartButton from "@/components/common/FloatingCartButton";
import FloatingContactWidgets from "@/components/common/FloatingContactWidgets";

export default function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <FloatingCartButton />
      <FloatingContactWidgets />
    </>
  );
}
