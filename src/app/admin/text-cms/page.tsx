"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Edit,
  RotateCcw,
  Sliders,
  Sparkles,
  Layers,
  Globe,
  HelpCircle,
} from "lucide-react";
import { WebsiteTextItem, TextGroup } from "@/types/cms";

export default function AdminTextCMSPage() {
  const [texts, setTexts] = useState<WebsiteTextItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<WebsiteTextItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchTexts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/text-content");
      const data = await res.json();
      if (data.success) {
        setTexts(data.data || []);
      }
    } catch {
      showToast("Failed to fetch website text content.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  const handleValueChange = (key: string, newValue: string) => {
    setTexts((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value: newValue } : item))
    );
    setHasChanges(true);
  };

  const handleResetToDefault = (key: string) => {
    const item = texts.find((t) => t.key === key);
    if (!item) return;
    handleValueChange(key, item.defaultValue || "");
    showToast(`Reset "${item.label}" to default value.`);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/text-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(texts),
      });
      const data = await res.json();
      if (data.success) {
        showToast("All website text changes saved & published successfully!");
        setHasChanges(false);
      } else {
        showToast(data.error || "Failed to save text content.", "error");
      }
    } catch {
      showToast("Network error while saving website text.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSingle = async (item: WebsiteTextItem) => {
    try {
      const res = await fetch("/api/text-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Saved "${item.label}" successfully!`);
      }
    } catch {
      showToast("Failed to save item.", "error");
    }
  };

  const groups: Array<{ id: string; label: string; count?: number }> = [
    { id: "all", label: "All Texts" },
    { id: "homepage", label: "Homepage & Banners" },
    { id: "products", label: "Products & Sections" },
    { id: "categories", label: "Categories" },
    { id: "announcement", label: "Announcement Bar" },
    { id: "newsletter", label: "Newsletter" },
    { id: "footer", label: "Footer & Watermark" },
    { id: "contact", label: "Helpline & Contact" },
    { id: "policy", label: "Shipping & Return Policies" },
  ];

  const filteredTexts = texts.filter((item) => {
    if (selectedGroup !== "all" && item.group !== selectedGroup) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.label.toLowerCase().includes(q) ||
        item.key.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileText className="text-amber-400" size={26} />
            Website Text & Content CMS
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Centralized content manager: edit any heading, description, button label, or policy text on the storefront without editing code.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchTexts}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
            title="Reload Text Content"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving || !hasChanges}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            <span>{isSaving ? "Publishing..." : hasChanges ? "Save & Publish Changes" : "All Content Synced"}</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <Sparkles size={16} />
            <span>You have unsaved text modifications. Click &quot;Save &amp; Publish Changes&quot; to push updates to the live storefront.</span>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0"
          >
            Publish Now
          </button>
        </div>
      )}

      {/* Search & Groups Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search any text label, identifier, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Group Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedGroup === g.id
                  ? "bg-amber-500 text-black border-amber-500 shadow-md font-bold"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-700/80"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Items List */}
      <div className="space-y-4">
        {filteredTexts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-800/40 border border-slate-700 text-slate-500 text-xs">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-slate-400">No matching text items found.</p>
          </div>
        ) : (
          filteredTexts.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition space-y-3 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{item.label}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-900 text-amber-400 border border-slate-700">
                    {item.key}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 uppercase">
                    {item.group}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResetToDefault(item.key)}
                    title="Reset to default text"
                    className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={() => handleSaveSingle(item)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition flex items-center gap-1"
                  >
                    <Save size={12} />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {item.description && (
                <p className="text-[11px] text-slate-400 italic">{item.description}</p>
              )}

              {/* Text Input / Textarea */}
              {item.value.length > 80 || item.group === "policy" || item.group === "footer" ? (
                <textarea
                  rows={3}
                  value={item.value}
                  onChange={(e) => handleValueChange(item.key, e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                />
              ) : (
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => handleValueChange(item.key, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                />
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>Default: &quot;{item.defaultValue}&quot;</span>
                <span>Last updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
