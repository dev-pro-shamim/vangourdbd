"use client";

import React, { useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { PRODUCTS, Product } from "@/data/products";
import { useCMS } from "@/context/CMSContext";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface ProductSliderSectionProps {
  title?: string;
  subtitle?: string;
  categorySlug?: string;
  products?: Product[];
  categoryLink?: string;
}

export default function ProductSliderSection({
  title = "Gentle Men's Choice",
  subtitle = "Featured Selection",
  categorySlug,
  products,
  categoryLink = "/shop",
}: ProductSliderSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products: cmsProducts } = useCMS();

  let displayProducts: any[] = [];
  if (products && products.length > 0) {
    displayProducts = products;
  } else if (cmsProducts && cmsProducts.length > 0) {
    if (categorySlug) {
      const filtered = cmsProducts.filter(
        (p) =>
          p.categorySlug?.toLowerCase() === categorySlug.toLowerCase() ||
          p.category?.toLowerCase() === categorySlug.toLowerCase()
      );
      displayProducts = filtered.length > 0 ? filtered : cmsProducts.slice(0, 10);
    } else {
      displayProducts = cmsProducts.slice(0, 10);
    }
  } else {
    displayProducts = PRODUCTS.slice(0, 10);
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 block mb-1">
              {subtitle}
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={categoryLink}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-black hover:text-[#d4145a] mr-4 transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-full border border-neutral-200 hover:border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-9 h-9 rounded-full border border-neutral-200 hover:border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {displayProducts.map((product) => {
            // Map product item if coming from CMS
            const pObj: any = {
              ...product,
              title: product.title || product.name,
              image: product.image || (Array.isArray(product.images) ? product.images[0] : "/assets/products/1tIg71784619728-light-690x966.jpg"),
            };
            return (
              <div key={pObj.id} className="w-[240px] sm:w-[280px] flex-shrink-0">
                <ProductCard product={pObj} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
