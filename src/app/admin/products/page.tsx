"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Star,
  Check,
  X,
  Image as ImageIcon,
  Save,
  Tag,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import { ProductItem } from "@/types/cms";
import MultiImageGalleryUploader from "@/components/admin/MultiImageGalleryUploader";

export default function AdminProductsPage() {
  const { products, categories, refreshData } = useCMS();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const rootCategories = categories.filter((c) => !c.parentId);

  // Subcategories for current editing product based on selected category
  const currentSubcategories = editingProduct
    ? categories.filter((c) => {
        const selectedCat = categories.find((cat) => cat.name === editingProduct.category);
        if (!selectedCat) return false;
        return (
          c.parentId === selectedCat.id ||
          c.parentId === selectedCat.slug ||
          c.parentId?.toLowerCase() === selectedCat.name.toLowerCase() ||
          c.parentId?.toLowerCase() === selectedCat.slug?.toLowerCase()
        );
      })
    : [];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      p.categorySlug.toLowerCase() === selectedCategory.toLowerCase() ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSubcategory =
      selectedSubcategory === "all" ||
      (p.subcategorySlug && p.subcategorySlug.toLowerCase() === selectedSubcategory.toLowerCase()) ||
      (p.subcategory && p.subcategory.toLowerCase() === selectedSubcategory.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "featured"
        ? p.isFeatured
        : statusFilter === "out_of_stock"
        ? p.isStockOut
        : !p.isStockOut;

    return matchesSearch && matchesCategory && matchesSubcategory && matchesStatus;
  });

  const handleOpenAddModal = () => {
    const rootCats = categories.filter((c) => !c.parentId);
    const firstCat = rootCats[0] || categories[0];
    const initialSubs = categories.filter(
      (c) =>
        c.parentId === firstCat?.id ||
        c.parentId === firstCat?.slug ||
        c.parentId?.toLowerCase() === firstCat?.name?.toLowerCase()
    );

    const newProd: ProductItem = {
      id: "",
      name: "",
      slug: "",
      sku: `VGD-${Math.floor(1000 + Math.random() * 9000)}`,
      category: firstCat?.name || "Men",
      categorySlug: firstCat?.slug || "men",
      categoryId: firstCat?.id || firstCat?.slug || "",
      subcategory: initialSubs[0]?.name || "",
      subcategorySlug: initialSubs[0]?.slug || "",
      subcategoryId: initialSubs[0]?.id || "",
      price: 1290,
      compareAtPrice: 1590,
      isStockOut: false,
      isFeatured: false,
      image: "/assets/products/1tIg71784619728-light-690x966.jpg",
      images: ["/assets/products/1tIg71784619728-light-690x966.jpg"],
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["#111111", "#4A5568"],
      stockQuantity: 50,
      description: "Premium engineered lifestyle apparel crafted with breathable fabric.",
      tags: ["new-arrival", "featured"],
      rating: 5,
      reviewCount: 1,
      seoTitle: "",
      seoDescription: "",
    };
    setIsNew(true);
    setEditingProduct(newProd);
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showNotification("Product duplicated successfully!");
      }
    } catch {
      alert("Failed to duplicate product.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showNotification(`Product "${name}" deleted.`);
      }
    } catch {
      alert("Failed to delete product.");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSaving(true);
    try {
      const url = isNew ? "/api/products" : `/api/products/${editingProduct.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        setEditingProduct(null);
        showNotification(`Product "${editingProduct.name}" saved successfully!`);
      }
    } catch {
      alert("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            Product Catalog & Inventory CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage titles, regular & sale prices, stock quantities, images, variations, and SEO.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or SKU..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory("all");
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.filter(c => !c.parentId).map((c) => (
              <option key={c.id || c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Filter if Parent selected */}
        {selectedCategory !== "all" && categories.some(c => c.parentId === selectedCategory || c.parentId?.toLowerCase() === selectedCategory.toLowerCase()) && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400 font-semibold">Subcategory:</span>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-amber-400/50 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 ring-1 ring-amber-400/20"
            >
              <option value="all">All Subcategories</option>
              {categories
                .filter(c => c.parentId === selectedCategory || c.parentId?.toLowerCase() === selectedCategory.toLowerCase())
                .map((sub) => (
                  <option key={sub.id || sub.slug} value={sub.slug}>
                    ↳ {sub.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Stock Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="featured">Featured ⭐</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (৳)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || "/assets/products/1tIg71784619728-light-690x966.jpg"}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-slate-700 shrink-0"
                      />
                      <div className="max-w-[240px]">
                        <div className="font-bold text-white line-clamp-1">{p.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{p.slug}</div>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-3 px-4 font-mono font-semibold text-slate-300">{p.sku}</td>

                  {/* Category & Subcategory */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-700">
                        {p.category}
                      </span>
                      {p.subcategory && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-400/10 text-amber-300 border border-amber-400/30">
                          ↳ {p.subcategory}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Pricing */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">৳{p.price.toLocaleString()}</div>
                    {p.compareAtPrice > p.price && (
                      <div className="text-[10px] text-slate-500 line-through">
                        ৳{p.compareAtPrice.toLocaleString()}
                      </div>
                    )}
                  </td>

                  {/* Stock Quantity */}
                  <td className="py-3 px-4 font-mono">
                    <span
                      className={`font-bold ${
                        p.stockQuantity > 10
                          ? "text-emerald-400"
                          : p.stockQuantity > 0
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {p.stockQuantity} pcs
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.isStockOut
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {p.isStockOut ? "Stock Out" : "In Stock"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditingProduct(JSON.parse(JSON.stringify(p)));
                        }}
                        className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-400"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(p.id)}
                        className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                        title="Duplicate product"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  {isNew ? "Add New Product" : `Edit Product: ${editingProduct.name}`}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  SKU: <span className="font-mono text-amber-300">{editingProduct.sku}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Product Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={editingProduct.slug}
                      onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">SKU *</label>
                    <input
                      type="text"
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      required
                    />
                  </div>

                  {/* Main Category */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Main Category *
                    </label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => {
                        const catName = e.target.value;
                        const selected = categories.find((c) => c.name === catName);
                        const catId = selected?.id || selected?.slug || "";
                        const catSlug = selected?.slug || catName.toLowerCase().replace(/\s+/g, "-");
                        
                        // Find child subcategories for this category
                        const subs = categories.filter((c) => 
                          c.parentId === catId || 
                          c.parentId === catSlug || 
                          c.parentId?.toLowerCase() === catName.toLowerCase() ||
                          c.parentId?.toLowerCase() === catSlug.toLowerCase()
                        );

                        setEditingProduct({
                          ...editingProduct,
                          category: catName,
                          categorySlug: catSlug,
                          categoryId: catId,
                          subcategory: subs[0]?.name || "",
                          subcategorySlug: subs[0]?.slug || "",
                          subcategoryId: subs[0]?.id || "",
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs cursor-pointer focus:border-amber-400"
                    >
                      {categories.filter(c => !c.parentId).map((c) => (
                        <option key={c.id || c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory (Automatic Cascading) */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                      <span>Subcategory</span>
                      {currentSubcategories.length > 0 && (
                        <span className="text-[10px] text-amber-400 font-normal">
                          {currentSubcategories.length} found
                        </span>
                      )}
                    </label>
                    {currentSubcategories.length > 0 ? (
                      <select
                        value={editingProduct.subcategory || ""}
                        onChange={(e) => {
                          const subName = e.target.value;
                          const selectedSub = currentSubcategories.find((s) => s.name === subName);
                          setEditingProduct({
                            ...editingProduct,
                            subcategory: subName,
                            subcategorySlug: selectedSub?.slug || subName.toLowerCase().replace(/\s+/g, "-"),
                            subcategoryId: selectedSub?.id || "",
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-400/60 text-white text-xs cursor-pointer focus:border-amber-400 ring-1 ring-amber-400/20"
                      >
                        <option value="">None / General ({editingProduct.category})</option>
                        {currentSubcategories.map((sub) => (
                          <option key={sub.id || sub.slug} value={sub.name}>
                            ↳ {sub.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-400 text-xs italic">
                        No subcategories found
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={editingProduct.stockQuantity}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stockQuantity: parseInt(e.target.value) || 0,
                          isStockOut: (parseInt(e.target.value) || 0) <= 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Sale Price (৳ BDT)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Regular / Compare-at Price (৳ BDT)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.compareAtPrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          compareAtPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isStockOut}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, isStockOut: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700"
                    />
                    <span>Mark as Out of Stock</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFeatured}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700"
                    />
                    <span>Mark as Featured Product</span>
                  </label>
                </div>
              </div>

              {/* Images Gallery with Multi-Image Drag & Drop Upload */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    Product Image Gallery & Upload
                  </h3>
                  <span className="text-[11px] text-amber-400 font-semibold">
                    Multi-Upload Supported (Desktop, Mobile, Tablet)
                  </span>
                </div>

                <MultiImageGalleryUploader
                  images={editingProduct.images || []}
                  onChange={(newImages) =>
                    setEditingProduct({
                      ...editingProduct,
                      images: newImages,
                    })
                  }
                  folder="products"
                  maxImages={20}
                />
              </div>

              {/* Description */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Description
                </h3>
                <textarea
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-6 border-t border-slate-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
