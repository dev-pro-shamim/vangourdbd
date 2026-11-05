"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Home, LayoutGrid, ShoppingBag, Search, User } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, setIsSearchOpen, setMobileMenuOpen } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1c232d] text-white shadow-2xl rounded-t-2xl">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2 relative">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            pathname === "/" ? "text-white font-bold" : "text-neutral-400 hover:text-white"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-wider uppercase font-bold">HOME</span>
        </Link>

        {/* Menu */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-neutral-400 hover:text-white cursor-pointer"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-wider uppercase font-bold">MENU</span>
        </button>

        {/* Center Floating Cart Button */}
        <div className="flex-1 flex flex-col items-center justify-center -translate-y-4">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-13 h-13 rounded-full bg-black text-white shadow-2xl flex items-center justify-center relative hover:scale-105 active:scale-95 transition-transform border-[3px] border-[#1c232d] cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-[#d4145a] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#1c232d]">
              {cartCount}
            </span>
          </button>
          <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-300 mt-0.5">
            CART
          </span>
        </div>

        {/* Search */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-neutral-400 hover:text-white cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-wider uppercase font-bold">SEARCH</span>
        </button>

        {/* Account */}
        <Link
          href="/login"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            pathname === "/login" ? "text-white font-bold" : "text-neutral-400 hover:text-white"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-wider uppercase font-bold">ACCOUNT</span>
        </Link>
      </div>
    </div>
  );
}
