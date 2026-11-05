"use client";

import React, { useState } from "react";
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Save,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  AlertCircle,
  CornerDownRight,
  Upload,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import { CategoryItem } from "@/types/cms";
import SingleImageUploader from "@/components/admin/SingleImageUploader";

export default function AdminCategoriesPage() {
  const { categories, products, refreshData } = useCMS();
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [filterType, setFilterType] = useState<"all" | "parents" | "subcategories">("all");

  // Reassignment Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState("");
  const [affectedProductsCount, setAffectedProductsCount] = useState(0);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleOpenAddModal = (parentId: string | null = null) => {
    const parent = parentId ? categories.find((c) => c.id === parentId || c.slug === parentId) : null;
    const newCat: CategoryItem = {
      id: "",
      name: "",
      slug: "",
      image: "/assets/category/hn8ac1780476447.jpg",
      parentId: parent ? parent.id || parent.slug : null,
      level: parent ? 1 : 0,
      productCount: 0,
      description: "",
      order: categories.length + 1,
      isEnabled: true,
      seoTitle: "",
      seoDescription: "",
    };
    setIsNew(true);
    setEditingCategory(newCat);
  };

  const handleEdit = (cat: CategoryItem) => {
    setIsNew(false);
    setEditingCategory({ ...cat });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsSaving(true);
    setErrorMsg("");

    try {
      const payload = {
        ...editingCategory,
        slug: editingCategory.slug || editingCategory.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        level: editingCategory.parentId ? 1 : 0,
      };

      let res;
      if (isNew) {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        await refreshData();
        setEditingCategory(null);
        showNotification(isNew ? "New category created successfully." : "Category updated successfully.");
      } else {
        setErrorMsg(data.error || "Failed to save category.");
      }
    } catch {
      setErrorMsg("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const initiateDelete = (cat: CategoryItem) => {
    const matchingProducts = products?.filter(
      (p) => p.categorySlug === cat.slug || p.categoryId === cat.id || p.subcategoryId === cat.id
    ) || [];

    setCategoryToDelete(cat);
    setAffectedProductsCount(matchingProducts.length);
    setReassignTargetId("");
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const query = reassignTargetId ? `?reassignToId=${encodeURIComponent(reassignTargetId)}` : "";
      const res = await fetch(`/api/categories/${categoryToDelete.id}${query}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        showNotification(`Category "${categoryToDelete.name}" deleted successfully.`);
      } else {
        alert(data.error || "Failed to delete category.");
      }
    } catch {
      alert("Error occurred while deleting category.");
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (filterType === "parents") return !c.parentId;
    if (filterType === "subcategories") return !!c.parentId;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FolderTree className="text-amber-400" size={26} />
            Category & Subcategory Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Build nested subcategories, upload category artwork, assign products, and protect against orphan items.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => handleOpenAddModal(null)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-lg shadow-md transition active:scale-95"
          >
            <Plus size={15} />
            <span>+ Add Main Category</span>
          </button>
          <button
            onClick={() => {
              const firstParent = categories.find((c) => !c.parentId);
              handleOpenAddModal(firstParent ? firstParent.id || firstParent.slug : null);
            }}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition active:scale-95"
          >
            <CornerDownRight size={15} />
            <span>+ Add Subcategory</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-semibold animate-in fade-in">
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setFilterType("all")}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            filterType === "all"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <span>All Categories ({categories.length})</span>
        </button>
        <button
          onClick={() => setFilterType("parents")}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            filterType === "parents"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <span>Root Categories ({categories.filter((c) => !c.parentId).length})</span>
        </button>
        <button
          onClick={() => setFilterType("subcategories")}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            filterType === "subcategories"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <span>Nested Subcategories ({categories.filter((c) => !!c.parentId).length})</span>
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const parentCategory = cat.parentId ? categories.find((c) => c.id === cat.parentId || c.slug === cat.parentId) : null;
          const count = products?.filter((p) => p.categorySlug === cat.slug || p.categoryId === cat.id).length || 0;

          return (
            <div
              key={cat.id || cat.slug}
              className={`bg-slate-900/80 border rounded-xl overflow-hidden transition-all flex flex-col justify-between ${
                cat.parentId ? "border-slate-800/60 ml-0 sm:ml-4 bg-slate-950/40" : "border-slate-800"
              }`}
            >
              <div className="p-4 flex items-start gap-3.5">
                <div className="relative group shrink-0">
                  <img
                    src={cat.image || "https://commandobd.com/uploads/all/2024/09/24/slider-1.jpg"}
                    alt={cat.name}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-800 border border-slate-700 shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                    <ImageIcon size={16} className="text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm truncate">{cat.name}</h3>
                    {cat.isEnabled ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" title="Disabled" />
                    )}
                  </div>

                  <div className="text-[11px] font-mono text-amber-400/90 truncate mt-0.5">
                    /{cat.slug}
                  </div>

                  {parentCategory && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <CornerDownRight size={12} className="text-slate-400" />
                      <span>Sub of: <strong className="text-slate-300">{parentCategory.name}</strong></span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {count} Products
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Order: #{cat.order}</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {cat.level === 0 ? "Root Category" : "Subcategory"}
                </span>
                <div className="flex items-center gap-2">
                  {!cat.parentId && (
                    <button
                      onClick={() => handleOpenAddModal(cat.id || cat.slug)}
                      className="px-2 py-1 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-md text-[11px] font-bold transition flex items-center gap-1"
                      title="Add a subcategory directly under this category"
                    >
                      <Plus size={12} />
                      <span>Subcategory</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-xs transition"
                    title="Edit Category & Artwork"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => initiateDelete(cat)}
                    className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-rose-400 rounded-md text-xs transition"
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-white text-base">
                {isNew ? "Create Category / Subcategory" : `Edit: ${editingCategory.name}`}
              </h3>
              <button onClick={() => setEditingCategory(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tactical Cargo Pants"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                      slug: isNew ? e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-") : editingCategory.slug,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="tactical-cargo-pants"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category Type & Hierarchy</label>
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingCategory({ ...editingCategory, parentId: null, level: 0 })}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      !editingCategory.parentId
                        ? "bg-amber-400/20 border-amber-400 text-amber-300"
                        : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    Main Root Category
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const firstParent = categories.find((c) => !c.parentId && c.id !== editingCategory.id);
                      setEditingCategory({
                        ...editingCategory,
                        parentId: firstParent ? firstParent.id || firstParent.slug : null,
                        level: 1,
                      });
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      editingCategory.parentId
                        ? "bg-amber-400/20 border-amber-400 text-amber-300"
                        : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    Nested Subcategory
                  </button>
                </div>

                {editingCategory.parentId && (
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-400 mb-1">
                      Select Parent Category *
                    </label>
                    <select
                      value={editingCategory.parentId || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          parentId: e.target.value ? e.target.value : null,
                          level: e.target.value ? 1 : 0,
                        })
                      }
                      className="w-full bg-slate-900 border border-amber-400/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 ring-1 ring-amber-400/20"
                    >
                      {categories
                        .filter((c) => c.id !== editingCategory.id && !c.parentId)
                        .map((parent) => (
                          <option key={parent.id || parent.slug} value={parent.id || parent.slug}>
                            📁 {parent.name}
                          </option>
                        ))}
                    </select>
                    <p className="text-[11px] text-amber-400/80 mt-1">This will be created as a subcategory under the selected parent.</p>
                  </div>
                )}
              </div>

              {/* Category & Subcategory Image Upload & Replacement */}
              <div>
                <SingleImageUploader
                  label={editingCategory.parentId ? "Subcategory Artwork / Banner Image" : "Category Artwork / Banner Image"}
                  value={editingCategory.image || ""}
                  onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                  folder="categories"
                  required={true}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Describe this category for search engines and category banner text..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingCategory.order}
                    onChange={(e) => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={editingCategory.isEnabled ? "true" : "false"}
                    onChange={(e) => setEditingCategory({ ...editingCategory, isEnabled: e.target.value === "true" })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="true">Enabled (Visible in Menu & Store)</option>
                    <option value="false">Disabled (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save size={15} />
                  <span>{isSaving ? "Saving..." : "Save Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Reassign Protection Modal */}
      {deleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Delete Category: {categoryToDelete.name}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  {affectedProductsCount > 0 ? (
                    <>
                      This category currently contains <strong className="text-amber-400">{affectedProductsCount} product(s)</strong>.
                      To protect data integrity, please select a replacement category to safely reassign them.
                    </>
                  ) : (
                    "Are you sure you want to delete this category? This action cannot be undone."
                  )}
                </p>
              </div>
            </div>

            {affectedProductsCount > 0 && (
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Reassign products to:
                </label>
                <select
                  value={reassignTargetId}
                  onChange={(e) => setReassignTargetId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">Select Target Category...</option>
                  {categories
                    .filter((c) => c.id !== categoryToDelete.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.slug})
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={affectedProductsCount > 0 && !reassignTargetId}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-md transition disabled:opacity-50"
              >
                {affectedProductsCount > 0 ? "Reassign & Delete" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
