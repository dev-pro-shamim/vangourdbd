import React from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { getProducts, getCategories } from "@/lib/cmsDataStore";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { ChevronRight, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const allCategories = getCategories();
  const matchedCategory = allCategories.find(
    (c) => c.slug.toLowerCase() === decodedSlug.toLowerCase() || c.name.toLowerCase() === decodedSlug.toLowerCase()
  ) || CATEGORIES.find(
    (c) => c.slug.toLowerCase() === decodedSlug.toLowerCase()
  );

  const categoryTitle = matchedCategory ? matchedCategory.name : decodedSlug.replace(/-/g, " ");

  const dynamicCategoryProducts = getProducts({ category: decodedSlug });
  const displayProducts =
    dynamicCategoryProducts.length > 0
      ? dynamicCategoryProducts.map((p) => ({
          ...p,
          id: typeof p.id === "string" ? parseInt(p.id.replace(/\D/g, "")) || 101 : p.id,
          title: p.title || p.name,
          image: p.image || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "/assets/products/1tIg71784619728-light-690x966.jpg"),
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || "/assets/products/1tIg71784619728-light-690x966.jpg"],
          sizes: p.sizes?.length ? p.sizes : ["M", "L", "XL"],
          colors: p.colors?.length ? p.colors : ["#111"],
        }))
      : PRODUCTS.slice(0, 16);

  return (
    <div className="bg-white min-h-screen">
      {/* Category Hero / Breadcrumb */}
      <div className="bg-neutral-900 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-white transition-colors">
              Category
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold">{categoryTitle}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">
            {categoryTitle}
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 max-w-xl">
            {matchedCategory?.description || `Explore our curated ${categoryTitle} lineup. Premium heavyweight fabric, tactical accents, and all-day comfort.`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black mr-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Products
            </Link>
            <span className="text-xs text-neutral-400">|</span>
            <span className="text-xs text-neutral-500 font-medium">
              Showing <strong className="text-black">{displayProducts.length}</strong> items in{" "}
              <strong className="text-black">{categoryTitle}</strong>
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
