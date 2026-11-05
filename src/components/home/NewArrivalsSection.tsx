"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { PRODUCTS } from "@/data/products";
import { ArrowRight } from "lucide-react";

interface NewArrivalsSectionProps {
  customTitle?: string;
  customCategories?: string[];
}

export default function NewArrivalsSection({
  customTitle = "New Arrivals",
  customCategories,
}: NewArrivalsSectionProps = {}) {
  const tabs = [
    { label: "All Items", key: "all" },
    { label: "T-Shirts", key: "t-shirt" },
    { label: "Polo Shirts", key: "polo" },
    { label: "Shirts", key: "shirt" },
    { label: "Denim & Pants", key: "pant" },
    { label: "Shorts & Vests", key: "vest" },
  ];

  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeTab === "all") return true;
    const text = (p.category + " " + p.title + " " + p.slug).toLowerCase();
    if (activeTab === "t-shirt") return text.includes("t-shirt") || text.includes("tee");
    if (activeTab === "polo") return text.includes("polo");
    if (activeTab === "shirt") return text.includes("shirt") && !text.includes("t-shirt");
    if (activeTab === "pant") return text.includes("denim") || text.includes("pant") || text.includes("chinos") || text.includes("trouser");
    if (activeTab === "vest") return text.includes("vest") || text.includes("shorts");
    return true;
  }).slice(0, 12);

  return (
    <section className="py-12 md:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        {/* Section Heading */}
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 block mb-1">
            Season Highlights
          </span>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900">
            New Arrivals
          </h2>
          <div className="w-10 h-0.5 bg-black mx-auto mt-3" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer flex-shrink-0 ${
                activeTab === tab.key
                  ? "bg-black text-white shadow-md"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-lg hover:scale-105 transition-all"
          >
            Explore Full Shop Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
