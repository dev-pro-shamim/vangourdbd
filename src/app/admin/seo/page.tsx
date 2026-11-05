"use client";

import React, { useState } from "react";
import {
  Search,
  Save,
  Check,
  Globe,
  Share2,
  FileCode,
  Image as ImageIcon,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function AdminSEOPage() {
  const { settings, updateSettings, refreshData } = useCMS();
  const [seo, setSeo] = useState(JSON.parse(JSON.stringify(settings.seo)));
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({ seo });
      await refreshData();
      showNotification("Global SEO and Open Graph metadata updated!");
    } catch {
      alert("Failed to save SEO settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Search className="w-6 h-6 text-amber-400" />
            SEO & Open Graph Metadata CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure global search engine optimization, Google search appearance, and social media sharing previews.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save SEO Settings"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Google Search Result Preview */}
      <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          Google Search SERP Preview
        </h2>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-1 font-sans">
          <div className="text-[11px] text-slate-400 font-mono">
            {seo.canonicalUrl || "https://vanguardbd.com"}
          </div>
          <div className="text-base font-medium text-blue-400 hover:underline cursor-pointer">
            {seo.metaTitle || "VANGUARD BD - High-End Lifestyle & Fashion Store"}
          </div>
          <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {seo.metaDescription ||
              "Explore the latest collection of premium shirts, polo, denim, joggers, tactical outerwear, and accessories in Bangladesh."}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Search Meta Form */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            Metadata Configuration
          </h2>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Global Site Title (50-60 characters recommended)
            </label>
            <input
              type="text"
              value={seo.metaTitle || ""}
              onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Global Meta Description (150-160 characters recommended)
            </label>
            <textarea
              rows={3}
              value={seo.metaDescription || ""}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Canonical URL</label>
              <input
                type="text"
                value={seo.canonicalUrl || ""}
                onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Keywords</label>
              <input
                type="text"
                value={seo.keywords || ""}
                onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                placeholder="fashion, bangladesh, shirts..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Social Sharing / Open Graph */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            Social Media Sharing (Open Graph & Twitter Cards)
          </h2>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Default Social Sharing Image (1200x630 recommended)
            </label>
            <input
              type="text"
              value={seo.ogImage || ""}
              onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
