"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, Heart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useApp();
  const fallbackImg = "/assets/products/1tIg71784619728-light-690x966.jpg";
  const initialImg = product.image || (Array.isArray(product.images) && product.images[0]) || fallbackImg;
  const [imgSrc, setImgSrc] = useState(initialImg);
  const isWished = isInWishlist(product.id);

  // Sync state if product changes
  React.useEffect(() => {
    const validImg = product.image || (Array.isArray(product.images) && product.images[0]) || fallbackImg;
    setImgSrc(validImg);
  }, [product.image, product.images]);

  return (
    <div className="group relative flex flex-col bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Product Media */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={imgSrc || fallbackImg}
            alt={product.title}
            onError={() => {
              if (product.remoteImage && imgSrc !== product.remoteImage) {
                setImgSrc(product.remoteImage);
              } else if (Array.isArray(product.images) && product.images.length > 1 && imgSrc !== product.images[1]) {
                setImgSrc(product.images[1]);
              } else if (imgSrc !== fallbackImg) {
                setImgSrc(fallbackImg);
              }
            }}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Stock Out Badge */}
        {product.isStockOut && (
          <span className="absolute top-2.5 left-2.5 bg-black/85 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Stock Out
          </span>
        )}

        {/* Discount / Flag Badge */}
        {product.badge && !product.isStockOut && (
          <span className="absolute top-2.5 left-2.5 bg-[#d4145a] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Action Buttons Floating Overlay */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 translate-x-1 sm:group-hover:translate-x-0">
          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            aria-label="Add to wishlist"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md ${
              isWished
                ? "bg-[#d4145a] text-white"
                : "bg-white text-neutral-800 hover:bg-black hover:text-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWished ? "fill-current" : ""}`} />
          </button>

          {/* Quick View */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setQuickViewProduct(product);
            }}
            aria-label="Quick view"
            className="w-8 h-8 rounded-full bg-white text-neutral-800 hover:bg-black hover:text-white flex items-center justify-center transition-colors shadow-md"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Add to Cart quick button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1, product.sizes[0] || "L");
            }}
            aria-label="Add to cart"
            className="w-8 h-8 rounded-full bg-white text-neutral-800 hover:bg-black hover:text-white flex items-center justify-center transition-colors shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Overlay on bottom of image for desktop */}
        <div className="absolute bottom-0 inset-x-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <button
            type="button"
            onClick={() => addToCart(product, 1, product.sizes[0] || "L")}
            className="w-full py-2 bg-black/90 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg backdrop-blur-xs shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            {product.category}
          </span>

          <h3 className="font-semibold text-neutral-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-black transition-colors">
            <Link href={`/product/${product.slug}`}>{product.title}</Link>
          </h3>
        </div>

        <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-black text-sm sm:text-base">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color Dots */}
          <div className="flex items-center gap-1">
            {product.colors.map((c, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
