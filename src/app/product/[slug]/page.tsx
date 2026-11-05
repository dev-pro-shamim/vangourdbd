"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductBySlug, PRODUCTS } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { useApp } from "@/context/AppContext";
import { useCMS } from "@/context/CMSContext";
import { BRAND } from "@/config/brand";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Ruler,
  Phone,
  MessageCircle,
  Star,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const { products: cmsProducts } = useCMS();

  const cmsMatch = cmsProducts?.find(
    (p) => p.slug === slug || p.id === slug || String(p.id) === slug
  );
  const fallbackMatch = getProductBySlug(slug) || PRODUCTS[0];
  const product: any = cmsMatch
    ? {
        ...cmsMatch,
        title: cmsMatch.title || cmsMatch.name,
        image:
          cmsMatch.image ||
          (Array.isArray(cmsMatch.images) && cmsMatch.images.length > 0
            ? cmsMatch.images[0]
            : "/assets/products/1tIg71784619728-light-690x966.jpg"),
        images:
          Array.isArray(cmsMatch.images) && cmsMatch.images.length > 0
            ? cmsMatch.images
            : [cmsMatch.image || "/assets/products/1tIg71784619728-light-690x966.jpg"],
        sizes: cmsMatch.sizes?.length ? cmsMatch.sizes : ["M", "L", "XL"],
        colors: cmsMatch.colors?.length ? cmsMatch.colors : ["#111"],
      }
    : fallbackMatch;

  const isWished = isInWishlist(product.id);

  const galleryImages: string[] = (
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : ["/assets/products/1tIg71784619728-light-690x966.jpg"]
  ).filter(Boolean);

  const [selectedImage, setSelectedImage] = useState<string>(galleryImages[0] || "/assets/products/1tIg71784619728-light-690x966.jpg");

  useEffect(() => {
    if (galleryImages.length > 0) {
      setSelectedImage(galleryImages[0]);
    }
  }, [product.id, product.slug, JSON.stringify(galleryImages)]);

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "L");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "#111");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "size" | "shipping" | "reviews">("desc");
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name || product.title,
          customerName: reviewName,
          rating: reviewRating,
          reviewText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSubmitted(true);
        setTimeout(() => {
          setReviewSubmitted(false);
          setReviewModalOpen(false);
          setReviewName("");
          setReviewText("");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    router.push("/checkout");
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-neutral-100 py-3.5 border-b border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-black">
              Shop
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/category/${product.categorySlug}`} className="hover:text-black">
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-black font-semibold truncate max-w-xs">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Image with Zoom & Carousel Arrows */}
            <div className="group relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm">
              <img
                src={selectedImage || galleryImages[0] || product.image}
                alt={product.title}
                className="w-full h-full object-cover object-top transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://commandobd.com/uploads/all/2024/09/24/slider-1.jpg";
                }}
              />

              {/* Prev / Next Controls if multiple gallery images exist */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const curIdx = galleryImages.indexOf(selectedImage);
                      const prevIdx = curIdx > 0 ? curIdx - 1 : galleryImages.length - 1;
                      setSelectedImage(galleryImages[prevIdx]);
                    }}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-black hover:text-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const curIdx = galleryImages.indexOf(selectedImage);
                      const nextIdx = curIdx < galleryImages.length - 1 ? curIdx + 1 : 0;
                      setSelectedImage(galleryImages[nextIdx]);
                    }}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-black hover:text-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono">
                    {Math.max(1, galleryImages.indexOf(selectedImage) + 1)} / {galleryImages.length}
                  </div>
                </>
              )}

              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#d4145a] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow">
                  {product.badge}
                </span>
              )}
              {product.isStockOut && (
                <span className="absolute top-4 left-4 bg-black/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  Stock Out
                </span>
              )}
            </div>

            {/* Thumbnail preview list for ALL uploaded gallery images */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
                {galleryImages.map((imgUrl, idx) => {
                  const isCurrent = (selectedImage || galleryImages[0]) === imgUrl;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                        isCurrent
                          ? "border-black ring-2 ring-black/20 shadow-md scale-102"
                          : "border-neutral-200 hover:border-neutral-400 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.title} gallery thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://commandobd.com/uploads/all/2024/09/24/slider-1.jpg";
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Product Info (7 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="font-bold uppercase tracking-wider text-black">
                  {product.category}
                </span>
                <span className="font-mono">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating stars */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-neutral-500 font-medium">(24 verified reviews)</span>
              </div>

              {/* Price section */}
              <div className="flex items-baseline gap-4 my-4 pb-4 border-b border-neutral-200">
                <span className="text-3xl font-black text-black">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-neutral-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice > product.price && (
                  <span className="text-xs font-extrabold text-[#d4145a] bg-red-50 border border-red-200 px-2.5 py-1 rounded">
                    Save ৳{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
                    Select Size:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSizeChartOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-black underline"
                  >
                    <Ruler className="w-3.5 h-3.5" /> Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[48px] px-4 py-2 text-xs font-extrabold rounded-lg border transition-all ${
                        selectedSize === s
                          ? "bg-black text-white border-black shadow-md scale-105"
                          : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
                  Quantity:
                </span>
                <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-neutral-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 text-sm font-black text-neutral-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.isStockOut}
                    className="flex-1 py-3.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {product.isStockOut ? "Out of Stock" : "Add to Cart"}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-xl border transition-colors flex items-center justify-center ${
                      isWished
                        ? "bg-red-50 border-red-200 text-[#d4145a]"
                        : "border-neutral-300 hover:border-black text-neutral-700"
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWished ? "fill-current" : ""}`} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.isStockOut}
                  className="w-full py-3.5 bg-[#d4145a] hover:bg-[#b01048] disabled:bg-neutral-300 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Buy It Now (Direct Checkout)
                </button>

                {/* WhatsApp Order Button */}
                <a
                  href={`https://wa.me/${BRAND.phone}?text=Hello%20${encodeURIComponent(
                    BRAND.name
                  )},%20I%20want%20to%20order:%20${encodeURIComponent(
                    product.title
                  )}%20(Size:%20${selectedSize},%20Qty:%20${quantity})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Order via WhatsApp
                </a>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Truck className="w-4 h-4 text-black flex-shrink-0" />
                  <span>Fast delivery across Bangladesh</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <RotateCcw className="w-4 h-4 text-black flex-shrink-0" />
                  <span>7-day easy return policy</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <ShieldCheck className="w-4 h-4 text-black flex-shrink-0" />
                  <span>100% Genuine guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Phone className="w-4 h-4 text-black flex-shrink-0" />
                  <span>Hotline: {BRAND.phoneDisplay}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs */}
        <div className="mt-16 border-t border-neutral-200 pt-10">
          <div className="flex gap-8 border-b border-neutral-200 overflow-x-auto text-sm font-bold uppercase tracking-wider mb-6">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "desc"
                  ? "border-black text-black"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("size")}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "size"
                  ? "border-black text-black"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              Size Chart
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "shipping"
                  ? "border-black text-black"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              Delivery & Returns
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "reviews"
                  ? "border-black text-black"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              Reviews (24)
            </button>
          </div>

          <div className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
            {activeTab === "desc" && (
              <div className="space-y-4">
                <p>
                  Introducing our signature <strong>{product.title}</strong>, engineered for the modern urban warrior. Designed with heavy-duty GSM combed fabric, double-reinforced seams, and pre-shrunk wash.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Premium breathable combed cotton blend.</li>
                  <li>Military-inspired stitching and hardware accents.</li>
                  <li>Color-fast anti-fade reactive dye wash.</li>
                  <li>Machine wash cold with like colors, tumble dry low.</li>
                </ul>
              </div>
            )}

            {activeTab === "size" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-neutral-200">
                  <thead className="bg-neutral-100 uppercase font-black text-neutral-700">
                    <tr>
                      <th className="p-3 border">Size</th>
                      <th className="p-3 border">Chest (Inches)</th>
                      <th className="p-3 border">Length (Inches)</th>
                      <th className="p-3 border">Shoulder (Inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 font-medium">
                    <tr>
                      <td className="p-3 border font-bold">M</td>
                      <td className="p-3 border">38 - 40</td>
                      <td className="p-3 border">28</td>
                      <td className="p-3 border">17.5</td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-bold">L</td>
                      <td className="p-3 border">40 - 42</td>
                      <td className="p-3 border">29</td>
                      <td className="p-3 border">18.5</td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-bold">XL</td>
                      <td className="p-3 border">42 - 44</td>
                      <td className="p-3 border">30</td>
                      <td className="p-3 border">19.5</td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-bold">XXL</td>
                      <td className="p-3 border">44 - 46</td>
                      <td className="p-3 border">31</td>
                      <td className="p-3 border">20.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-3 text-xs sm:text-sm">
                <p>
                  <strong>Inside Dhaka:</strong> Delivery within 24-48 hours. Shipping charge ৳70.
                </p>
                <p>
                  <strong>Outside Dhaka:</strong> Delivery within 3-5 business days via courier. Shipping charge ৳130.
                </p>
                <p>
                  <strong>Return Policy:</strong> You may inspect and exchange the product at the time of delivery if the size or color doesn't fit, or request an exchange within 7 days.
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-neutral-900">Average Rating: 5.0 / 5.0</p>
                    <p className="text-xs text-neutral-500">Based on verified customer reviews</p>
                  </div>
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition"
                  >
                    Write a Review
                  </button>
                </div>
                <div className="divide-y divide-neutral-100 text-xs">
                  <div className="py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-neutral-900">Sabbir Hossain</p>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                        Verified Purchase
                      </span>
                    </div>
                    <div className="text-amber-400 text-xs mt-0.5">★★★★★</div>
                    <p className="text-neutral-600 mt-1">
                      "Material quality is out of this world! The deep pockets and ripstop stitching feel very durable."
                    </p>
                  </div>
                  <div className="py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-neutral-900">Tanvir Ahmed</p>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                        Verified Purchase
                      </span>
                    </div>
                    <div className="text-amber-400 text-xs mt-0.5">★★★★★</div>
                    <p className="text-neutral-600 mt-1">
                      "Fitting is 10/10. Delivered in Dhaka within 24 hours. Highly recommended."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-neutral-200">
            <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900 mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Chart Modal */}
      {sizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSizeChartOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-base uppercase">Size Guide Chart</h3>
              <button onClick={() => setSizeChartOpen(false)} className="text-neutral-500 font-bold">
                ✕
              </button>
            </div>
            <table className="w-full text-left text-xs border border-neutral-200">
              <thead className="bg-neutral-100 font-bold">
                <tr>
                  <th className="p-2 border">Size</th>
                  <th className="p-2 border">Chest</th>
                  <th className="p-2 border">Length</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2 border">M</td><td className="p-2 border">38-40"</td><td className="p-2 border">28"</td></tr>
                <tr><td className="p-2 border">L</td><td className="p-2 border">40-42"</td><td className="p-2 border">29"</td></tr>
                <tr><td className="p-2 border">XL</td><td className="p-2 border">42-44"</td><td className="p-2 border">30"</td></tr>
                <tr><td className="p-2 border">XXL</td><td className="p-2 border">44-46"</td><td className="p-2 border">31"</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setReviewModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full z-10 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-black text-sm uppercase">Write a Review</h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-neutral-500 font-bold">
                ✕
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="py-6 text-center text-xs text-emerald-600 font-bold space-y-2">
                <Check size={28} className="mx-auto" />
                <p>Thank you! Your review has been submitted for moderation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asaduzzaman"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-none focus:border-black"
                  >
                    <option value={5}>★★★★★ (5/5 Excellent)</option>
                    <option value={4}>★★★★☆ (4/5 Very Good)</option>
                    <option value={3}>★★★☆☆ (3/5 Average)</option>
                    <option value={2}>★★☆☆☆ (2/5 Below Average)</option>
                    <option value={1}>★☆☆☆☆ (1/5 Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Your Review *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your experience regarding sizing, fabric, and delivery..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2.5 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-neutral-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black text-white font-bold rounded-lg shadow-md"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
