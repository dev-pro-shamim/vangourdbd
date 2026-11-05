"use client";

import React from "react";
import Link from "next/link";
import { useCMS } from "@/context/CMSContext";

interface CategoryCollectionSectionProps {
  customTitle?: string;
  customEyebrow?: string;
}

export default function CategoryCollectionSection({
  customTitle = "Our Collection",
  customEyebrow = "CATEGORIES",
}: CategoryCollectionSectionProps = {}) {
  const { categories, products } = useCMS();

  const fallbackList = [
    { name: "Polo Shirt", slug: "polo-shirt", image: "/assets/category/A7Lq51780476457.jpg", count: "35+ Styles" },
    { name: "Half Sleeve Shirt", slug: "half-shirts", image: "/assets/category/dVZuG1780476419.jpg", count: "48+ Styles" },
    { name: "Denim Pant", slug: "denim", image: "/assets/category/hn8ac1780476447.jpg", count: "29+ Styles" },
    { name: "Cap & Accessories", slug: "cap", image: "/assets/category/A7Lq51780476457.jpg", count: "12+ Styles" },
    { name: "Tactical Vest", slug: "vest", image: "/assets/category/dVZuG1780476419.jpg", count: "14+ Styles" },
    { name: "Winter Drops", slug: "Winter-Collection", image: "/assets/category/hn8ac1780476447.jpg", count: "36+ Styles" },
  ];

  const dynamicCategories = categories?.filter((c) => c.isEnabled && !c.parentId).sort((a, b) => a.order - b.order) || [];

  const displayList =
    dynamicCategories.length > 0
      ? dynamicCategories.slice(0, 6).map((cat) => {
          const matchingCount =
            products?.filter(
              (p) =>
                p.categorySlug?.toLowerCase() === cat.slug?.toLowerCase() ||
                p.category?.toLowerCase() === cat.name?.toLowerCase() ||
                p.categoryId === cat.id
            ).length || cat.productCount || 12;

          return {
            name: cat.name,
            slug: cat.slug,
            image: cat.image || "/assets/category/A7Lq51780476457.jpg",
            count: `${matchingCount}+ Styles`,
          };
        })
      : fallbackList;

  return (
    <section className="py-10 md:py-16 bg-transparent">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Section Heading matching Commando exactly */}
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.22em] text-[#222831] mb-1.5">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 inline-block -mt-0.5"
            >
              <path
                d="M50 8C27 8 10 24 8 47C20 48 35 44 50 44C65 44 80 48 92 47C90 24 73 8 50 8Z"
                fill="#111111"
              />
              <path
                d="M5 49C22 51 36 47 50 47C64 47 78 51 95 49C94 51 91 53 87 54C75 52 63 50 50 50C37 50 25 52 13 54C9 53 6 51 5 49Z"
                fill="#111111"
              />
              <path
                d="M10 56H45L49 61H51L55 56H90V67C85 71 70 71 54 64L50 62L46 64C30 71 15 71 10 67V56Z"
                fill="#111111"
              />
            </svg>
            {customEyebrow}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#111111]">
            {customTitle}
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {displayList.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="group flex flex-col items-center text-center select-none cursor-pointer"
            >
              <div className="relative w-full aspect-square rounded-[20px] overflow-hidden bg-neutral-200 border border-neutral-200/60 shadow-xs group-hover:shadow-lg transition-all duration-300">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://commandobd.com/uploads/all/2024/09/24/slider-1.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <span className="text-white text-xs sm:text-sm font-black uppercase tracking-wider drop-shadow-md text-center">
                    {item.name}
                  </span>
                </div>
              </div>

              <h3 className="mt-3 text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#d4145a] transition-colors">
                {item.name}
              </h3>
              <span className="text-[11px] text-neutral-400 font-medium">
                {item.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
