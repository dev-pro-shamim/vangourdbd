"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PRODUCTS, Product } from "@/data/products";
import { Search, X, TrendingUp } from "lucide-react";

export default function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  if (!isSearchOpen) return null;

  const handleInput = (val: string) => {
    setQuery(val);
    if (val.trim().length > 1) {
      const q = val.toLowerCase();
      const matched = PRODUCTS.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      ).slice(0, 8);
      setResults(matched);
    } else {
      setResults([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const trendingTags = ["Denim", "Polo", "Vest", "Cargo", "Half Shirt", "Tees", "Shorts"];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl mx-auto mt-4 sm:mt-12 bg-white rounded-2xl shadow-2xl overflow-hidden z-10 mx-4">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Search Products
          </p>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-full hover:bg-neutral-100 text-neutral-600"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-neutral-100">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Type to search (e.g. Acid Wash Vest, Cargo Chinos)..."
              className="w-full pl-10 pr-4 py-3 bg-neutral-100 focus:bg-white text-sm font-medium rounded-xl outline-none border border-neutral-200 focus:border-black transition-all"
            />
          </div>
        </form>

        {/* Trending Searches */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="flex items-center gap-1 font-bold text-neutral-500 flex-shrink-0">
            <TrendingUp className="w-3.5 h-3.5" /> Trending:
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleInput(tag)}
              className="px-2.5 py-1 bg-white border border-neutral-200 hover:border-black rounded-full font-medium text-neutral-800 transition-colors flex-shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-neutral-100">
          {query.trim().length > 1 ? (
            results.length > 0 ? (
              results.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/product/${prod.slug}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-3 py-3 hover:bg-neutral-50 rounded-lg px-2 transition-colors"
                >
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-12 h-14 object-cover rounded bg-neutral-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-neutral-900 truncate">{prod.title}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{prod.category}</p>
                    <p className="text-xs font-black text-black mt-1">৳{prod.price}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center py-8 text-sm text-neutral-500">
                No products match "{query}". Try checking your spelling or search another keyword.
              </p>
            )
          ) : (
            <p className="text-center py-8 text-xs text-neutral-400">
              Start typing above to search our full catalog.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
