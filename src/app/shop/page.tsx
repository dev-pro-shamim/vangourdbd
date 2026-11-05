"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { PRODUCTS, Product } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { useCMS } from "@/context/CMSContext";
import { SlidersHorizontal, ChevronRight, Grid3X3, LayoutGrid, X } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const searchQ = searchParams.get("q") || "";
  const { products: cmsProducts, categories: cmsCategories } = useCMS();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(6000);
  const [sortBy, setSortBy] = useState<string>("default");
  const [gridCols, setGridCols] = useState<number>(4);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const baseProducts = useMemo(() => {
    if (cmsProducts && cmsProducts.length > 0) {
      return cmsProducts.map((p) => ({
        ...p,
        id: typeof p.id === "string" ? parseInt(p.id.replace(/\D/g, "")) || Math.floor(Math.random() * 9000) : p.id,
        title: p.title || p.name,
        image: p.image || (Array.isArray(p.images) ? p.images[0] : "/assets/products/1tIg71784619728-light-690x966.jpg"),
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || "/assets/products/1tIg71784619728-light-690x966.jpg"],
        sizes: p.sizes || ["M", "L", "XL"],
        colors: p.colors || ["#111"],
      }));
    }
    return PRODUCTS;
  }, [cmsProducts]);

  // Filter products
  const filtered = useMemo(() => {
    let result = [...baseProducts];

    if (searchQ) {
      const q = searchQ.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (p) =>
          p.categorySlug.toLowerCase() === selectedCategory.toLowerCase() ||
          p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (inStockOnly) {
      result = result.filter((p) => !p.isStockOut);
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        selectedSizes.some((s) => p.sizes.includes(s))
      );
    }

    result = result.filter((p) => p.price <= priceRange);

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [searchQ, selectedCategory, inStockOnly, selectedSizes, priceRange, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Header */}
      <div className="bg-neutral-100 py-6 border-b border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-black font-semibold">Shop Catalog</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900">
            {searchQ ? `Search Results for "${searchQ}"` : "All Products"}
          </h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 pb-3 border-b border-neutral-200">
                Categories
              </h3>
              <ul className="mt-4 space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left py-1 flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCategory === "all" ? "font-black text-black" : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    <span>All Categories</span>
                    <span>({baseProducts.length})</span>
                  </button>
                </li>
                {(cmsCategories && cmsCategories.length > 0 ? cmsCategories.filter(c => !c.parentId && c.isEnabled) : CATEGORIES).slice(0, 20).map((cat) => (
                  <li key={cat.slug}>
                    <button
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left py-1 flex items-center justify-between transition-colors cursor-pointer ${
                        selectedCategory === cat.slug
                          ? "font-black text-[#d4145a]"
                          : "text-neutral-600 hover:text-black"
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className="text-neutral-400">
                        (
                        {baseProducts.filter(
                          (p) =>
                            p.categorySlug?.toLowerCase() === cat.slug?.toLowerCase() ||
                            p.category?.toLowerCase() === cat.name?.toLowerCase()
                        ).length}
                        )
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 pb-3 border-b border-neutral-200">
                Max Price: ৳{priceRange}
              </h3>
              <div className="mt-4">
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-2 font-medium">
                  <span>৳500</span>
                  <span>৳6,000</span>
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 pb-3 border-b border-neutral-200">
                Filter by Size
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {["M", "L", "XL", "XXL", "Free Size"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 text-xs font-bold rounded border transition-all cursor-pointer ${
                      selectedSizes.includes(size)
                        ? "bg-black text-white border-black"
                        : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 pb-3 border-b border-neutral-200">
                Availability
              </h3>
              <label className="mt-4 flex items-center gap-2 text-xs text-neutral-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-black rounded"
                />
                In Stock Only
              </label>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Top Toolbar */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-bold text-neutral-800"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                <span className="text-xs font-medium text-neutral-600">
                  Showing <strong className="text-black">{filtered.length}</strong> Products
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-500 font-medium hidden sm:inline-block">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-neutral-300 text-neutral-800 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-black"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Product Name: A to Z</option>
                  </select>
                </div>

                {/* Grid Layout Toggle */}
                <div className="hidden sm:flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setGridCols(3)}
                    aria-label="3 columns grid"
                    className={`p-1.5 cursor-pointer ${gridCols === 3 ? "bg-black text-white" : "text-neutral-600"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridCols(4)}
                    aria-label="4 columns grid"
                    className={`p-1.5 cursor-pointer ${gridCols === 4 ? "bg-black text-white" : "text-neutral-600"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filtered.length > 0 ? (
              <div
                className={`grid grid-cols-2 gap-4 md:gap-6 ${
                  gridCols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-3 lg:grid-cols-4"
                }`}
              >
                {filtered.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-neutral-50 rounded-2xl border border-neutral-200 p-8 space-y-4">
                <p className="text-lg font-bold text-neutral-700">No products match your filters</p>
                <p className="text-xs text-neutral-500">
                  Try adjusting the price range or resetting your selected categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedSizes([]);
                    setPriceRange(6000);
                    setInStockOnly(false);
                  }}
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                <h3 className="font-black uppercase tracking-wider text-sm">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} aria-label="Close filters">
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-neutral-400 mb-3">Categories</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left py-1 cursor-pointer ${
                      selectedCategory === "all" ? "font-bold text-black" : "text-neutral-600"
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`block w-full text-left py-1 truncate cursor-pointer ${
                        selectedCategory === c.slug ? "font-bold text-black" : "text-neutral-600"
                      }`}
                    >
                      {c.name} ({c.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-neutral-400 mb-3">
                  Max Price: ৳{priceRange}
                </h4>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-neutral-400 mb-3">Sizes</h4>
                <div className="flex flex-wrap gap-2">
                  {["M", "L", "XL", "XXL", "Free Size"].map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 text-xs font-bold rounded border cursor-pointer ${
                        selectedSizes.includes(s)
                          ? "bg-black text-white border-black"
                          : "border-neutral-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg mt-6"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
