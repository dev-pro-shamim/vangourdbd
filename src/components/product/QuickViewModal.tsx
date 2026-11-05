"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { X, Heart, ShoppingBag, ArrowRight, Check, ShieldCheck, Truck } from "lucide-react";

export default function QuickViewModal() {
  const router = useRouter();
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist } =
    useApp();
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const qvImages: string[] = quickViewProduct
    ? (Array.isArray(quickViewProduct.images) && quickViewProduct.images.length > 0
        ? quickViewProduct.images
        : [quickViewProduct.image]
      ).filter(Boolean)
    : [];

  const [selectedQvImg, setSelectedQvImg] = useState<string>("");

  React.useEffect(() => {
    if (qvImages.length > 0) {
      setSelectedQvImg(qvImages[0]);
    }
  }, [quickViewProduct?.id]);

  if (!quickViewProduct) return null;

  const isWished = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedSize, selectedColor);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, quantity, selectedSize, selectedColor);
    setQuickViewProduct(null);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-black hover:text-white flex items-center justify-center shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Gallery */}
          <div className="flex flex-col bg-neutral-100">
            <div className="relative aspect-[3/4] flex items-center justify-center overflow-hidden">
              <img
                src={selectedQvImg || qvImages[0] || quickViewProduct.image}
                alt={quickViewProduct.title}
                className="w-full h-full object-cover object-top"
              />
              {quickViewProduct.badge && (
                <span className="absolute top-4 left-4 bg-[#d4145a] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {quickViewProduct.badge}
                </span>
              )}
              {quickViewProduct.isStockOut && (
                <span className="absolute top-4 left-4 bg-black/90 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  Stock Out
                </span>
              )}
            </div>

            {/* Quick View Thumbnails */}
            {qvImages.length > 1 && (
              <div className="flex gap-2 p-3 bg-white border-t border-neutral-200 overflow-x-auto scrollbar-none">
                {qvImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedQvImg(imgUrl)}
                    className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      (selectedQvImg || qvImages[0]) === imgUrl
                        ? "border-black ring-1 ring-black"
                        : "border-neutral-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span className="uppercase font-bold tracking-wider">
                  {quickViewProduct.category}
                </span>
                <span>SKU: {quickViewProduct.sku}</span>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-neutral-900 leading-snug">
                {quickViewProduct.title}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 my-3">
                <span className="text-2xl font-black text-black">
                  ৳{quickViewProduct.price.toLocaleString()}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    ৳{quickViewProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-xs font-bold text-[#d4145a] bg-red-50 px-2 py-0.5 rounded">
                    Save ৳{(quickViewProduct.originalPrice - quickViewProduct.price).toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {quickViewProduct.description}
              </p>

              {/* Size Selector */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span>SELECT SIZE:</span>
                  <span className="text-neutral-500 font-normal">Regular Fit</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded border transition-all ${
                        selectedSize === s
                          ? "bg-black text-white border-black"
                          : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold text-neutral-800">QUANTITY:</span>
                <div className="flex items-center border border-neutral-300 rounded overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-200">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={quickViewProduct.isStockOut}
                  className="flex-1 py-3 bg-neutral-900 hover:bg-black disabled:bg-neutral-300 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {quickViewProduct.isStockOut ? "Out of Stock" : "Add to Cart"}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`p-3 rounded-lg border transition-colors ${
                    isWished
                      ? "bg-red-50 border-red-200 text-[#d4145a]"
                      : "border-neutral-300 hover:border-black text-neutral-700"
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWished ? "fill-current" : ""}`} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={quickViewProduct.isStockOut}
                className="w-full py-3 bg-[#d4145a] hover:bg-[#b01048] disabled:bg-neutral-300 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Buy Now (Instant Checkout)
              </button>

              <div className="text-center pt-2">
                <Link
                  href={`/product/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="text-xs font-semibold text-neutral-700 hover:text-black hover:underline"
                >
                  View Full Product Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
