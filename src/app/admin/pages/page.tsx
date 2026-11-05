"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  Save,
  Check,
  X,
  Eye,
  Search,
  Globe,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import { PageItem } from "@/types/cms";

export default function AdminPagesPage() {
  const { pages, refreshData } = useCMS();
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "policies" | "custom">("all");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenAddModal = () => {
    const newPage: PageItem = {
      id: "",
      title: "",
      slug: "",
      isSystem: false,
      isPublished: true,
      template: "policy",
      content: "",
      seoTitle: "",
      seoDescription: "",
      updatedAt: new Date().toISOString(),
    };
    setIsNew(true);
    setEditingPage(newPage);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete page "${title}"?`)) return;
    try {
      const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showToast(`Page "${title}" deleted.`);
      } else {
        showToast(data.error || "Cannot delete system pages.", "error");
      }
    } catch {
      showToast("Failed to delete page.", "error");
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    setIsSaving(true);
    try {
      const url = isNew ? "/api/pages" : `/api/pages/${editingPage.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPage),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        setEditingPage(null);
        showToast(`Page "${editingPage.title}" saved & published successfully!`);
      } else {
        showToast(data.error || "Failed to save page.", "error");
      }
    } catch {
      showToast("Failed to save page.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPages = pages.filter((p) => {
    if (selectedFilter === "policies") {
      const isPolicy = ["terms", "privacy", "shipping", "return", "contact", "faq"].some((term) =>
        p.slug.toLowerCase().includes(term) || p.title.toLowerCase().includes(term)
      );
      if (!isPolicy) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          {notification.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-amber-400" />
            Website Pages &amp; Policy CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Edit text content, policies, contact info, FAQs, and SEO for all company footer and header pages.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pages by title or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              selectedFilter === "all"
                ? "bg-amber-500 text-black border-amber-500 font-bold"
                : "bg-slate-900 text-slate-300 border-slate-700 hover:text-white"
            }`}
          >
            All Pages ({pages.length})
          </button>
          <button
            onClick={() => setSelectedFilter("policies")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              selectedFilter === "policies"
                ? "bg-amber-500 text-black border-amber-500 font-bold"
                : "bg-slate-900 text-slate-300 border-slate-700 hover:text-white"
            }`}
          >
            Company &amp; Policies
          </button>
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Page Title</th>
              <th className="py-3 px-4">Live URL Route</th>
              <th className="py-3 px-4">Content Preview</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-slate-300">
            {filteredPages.map((p) => {
              const liveUrl = p.slug.startsWith("/") ? p.slug : `/${p.slug}`;
              return (
                <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{p.title}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-400 flex items-center gap-1 hover:underline"
                    >
                      <span>{liveUrl}</span>
                      <ExternalLink size={11} />
                    </a>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-slate-400">
                    {p.content || <span className="text-slate-500 italic">Page builder sections</span>}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.isPublished
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {p.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                        title="View Live Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditingPage(JSON.parse(JSON.stringify(p)));
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 transition"
                        title="Edit Page Content"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {!p.isSystem && (
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                          title="Delete page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Page Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl max-w-2xl w-full my-8 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                {isNew ? "Create New Page" : `Edit Content: ${editingPage.title}`}
              </h2>
              <button
                onClick={() => setEditingPage(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4 mt-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Page Title *</label>
                  <input
                    type="text"
                    value={editingPage.title}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        title: e.target.value,
                        slug: isNew
                          ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                          : editingPage.slug,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">URL Route Path</label>
                  <input
                    type="text"
                    value={editingPage.slug}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    placeholder="e.g. shipping/policy"
                    required
                  />
                </div>
              </div>

              {/* Content Body Editor */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Page Content / Policy Body
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Write or paste your policy clauses, FAQ questions/answers, or custom text. Plain text, markdown, or HTML is supported.
                </p>
                <textarea
                  rows={8}
                  value={editingPage.content || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  placeholder="Enter full page content here..."
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed font-sans focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* SEO Meta Fields */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  SEO &amp; Search Engine Optimization
                </span>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">SEO Meta Title</label>
                  <input
                    type="text"
                    value={editingPage.seoTitle || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, seoTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    placeholder="Meta title displayed on Google search results..."
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={editingPage.seoDescription || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, seoDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    placeholder="Brief description summarizing this page for search results..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPage.isPublished}
                    onChange={(e) => setEditingPage({ ...editingPage, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs font-bold text-slate-300">Published &amp; Live on Website</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Publishing..." : "Save & Publish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
