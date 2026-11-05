"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/product/ProductCard";
import { Heart, ChevronRight, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist } = useApp();

  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">My Wishlist</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-8 pb-4 border-b border-neutral-200">
          My Saved Items ({wishlist.length})
        </h1>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-neutral-800">Your wishlist is empty</h2>
            <p className="text-xs text-neutral-500">
              Save your favorite items by tapping the heart icon on any product card!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-neutral-800"
            >
              Discover Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlist.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
