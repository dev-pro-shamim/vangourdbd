"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit,
  Save,
  X,
  Palette,
  Image,
  Link as LinkIcon,
  Check,
  MoveVertical,
  Sparkles,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import { Section, SectionType } from "@/types/cms";

export default function HomepageSectionsManager() {
  const { sections, refreshData, toggleSectionStatus, reorderSections } = useCMS();
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const homeSections = sections
    .filter((s) => s.pageSlug === "home")
    .sort((a, b) => a.order - b.order);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= homeSections.length) return;

    const newSections = [...homeSections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const orderedIds = newSections.map((s) => s.id);
    const success = await reorderSections(orderedIds);
    if (success) {
      showNotification("Section order updated successfully!");
    }
  };

  const handleToggle = async (section: Section) => {
    const success = await toggleSectionStatus(section.id, !section.isEnabled);
    if (success) {
      showNotification(`Section "${section.name}" ${!section.isEnabled ? "enabled" : "disabled"}!`);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/sections/${id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showNotification("Section duplicated successfully!");
      }
    } catch {
      alert("Failed to duplicate section.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/sections/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showNotification(`Section "${name}" deleted.`);
      }
    } catch {
      alert("Failed to delete section.");
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/sections/${editingSection.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSection),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        setEditingSection(null);
        showNotification(`Saved changes for "${editingSection.name}"!`);
      }
    } catch {
      alert("Failed to save section changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateSection = async (type: SectionType, name: string) => {
    try {
      const newSec = {
        name,
        type,
        title: name,
        isEnabled: true,
        pageSlug: "home",
        styles: {
          paddingTop: "24px",
          paddingBottom: "48px",
          bgColor: "#ffffff",
          textColor: "#111111",
        },
        data: {},
      };
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSec),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        setIsAddModalOpen(false);
        setEditingSection(data.data);
        showNotification(`New section "${name}" created!`);
      }
    } catch {
      alert("Failed to create new section.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-400" />
            Homepage Sections CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reorder, customize colors, toggle visibility, and edit every section appearing on the homepage.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Section</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sections Table / Cards */}
      <div className="space-y-3">
        {homeSections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              sec.isEnabled
                ? "bg-slate-800/80 border-slate-700/80 hover:border-slate-600 shadow-sm"
                : "bg-slate-900/60 border-slate-800 opacity-60"
            }`}
          >
            {/* Left: Position and Name */}
            <div className="flex items-center gap-4">
              {/* Order Number Badge */}
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-amber-400">
                {idx + 1}
              </div>

              {/* Position Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === homeSections.length - 1}
                  className="p-1 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Metadata */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{sec.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-900 text-slate-400 border border-slate-700">
                    {sec.type}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                  <span>Title: &quot;{sec.title || "—"}&quot;</span>
                  {sec.styles?.bgColor && (
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-slate-600"
                        style={{ backgroundColor: sec.styles.bgColor }}
                      />
                      <span>{sec.styles.bgColor}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/60">
              {/* Toggle Visibility */}
              <button
                onClick={() => handleToggle(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                  sec.isEnabled
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {sec.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{sec.isEnabled ? "Visible" : "Hidden"}</span>
              </button>

              {/* Edit Details */}
              <button
                onClick={() => setEditingSection(JSON.parse(JSON.stringify(sec)))}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>

              {/* Duplicate Section */}
              <button
                onClick={() => handleDuplicate(sec.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Duplicate section"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              {/* Delete Section */}
              <button
                onClick={() => handleDelete(sec.id, sec.name)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                title="Delete section"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Section Modal / Drawer */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-amber-400" />
                  Edit Section: {editingSection.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Type: <span className="font-mono text-amber-300">{editingSection.type}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveSection} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* General Settings */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Content & Headings
                </h3>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Section Display Name</label>
                  <input
                    type="text"
                    value={editingSection.name}
                    onChange={(e) => setEditingSection({ ...editingSection, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Main Heading (Title)</label>
                    <input
                      type="text"
                      value={editingSection.title || ""}
                      onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Eyebrow / Badge Label</label>
                    <input
                      type="text"
                      value={editingSection.eyebrow || ""}
                      onChange={(e) => setEditingSection({ ...editingSection, eyebrow: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={editingSection.subtitle || ""}
                    onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Styling & Color Settings */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-400" />
                  Colors & Spacing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingSection.styles?.bgColor || "#ffffff"}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            styles: { ...editingSection.styles, bgColor: e.target.value },
                          })
                        }
                        className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={editingSection.styles?.bgColor || ""}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            styles: { ...editingSection.styles, bgColor: e.target.value },
                          })
                        }
                        placeholder="#ffffff"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingSection.styles?.textColor || "#111111"}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            styles: { ...editingSection.styles, textColor: e.target.value },
                          })
                        }
                        className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={editingSection.styles?.textColor || ""}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            styles: { ...editingSection.styles, textColor: e.target.value },
                          })
                        }
                        placeholder="#111111"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Top Padding (e.g. 24px, 48px)</label>
                    <input
                      type="text"
                      value={editingSection.styles?.paddingTop || ""}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          styles: { ...editingSection.styles, paddingTop: e.target.value },
                        })
                      }
                      placeholder="24px"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Bottom Padding</label>
                    <input
                      type="text"
                      value={editingSection.styles?.paddingBottom || ""}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          styles: { ...editingSection.styles, paddingBottom: e.target.value },
                        })
                      }
                      placeholder="48px"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Type-Specific Data Customizer */}
              {editingSection.type === "video_banner" && (
                <div className="space-y-4 pt-4 border-t border-slate-700">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Banner Buttons & Links
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Button Text</label>
                      <input
                        type="text"
                        value={editingSection.data?.buttonText || ""}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            data: { ...editingSection.data, buttonText: e.target.value },
                          })
                        }
                        placeholder="Shop Collection"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Button Link</label>
                      <input
                        type="text"
                        value={editingSection.data?.buttonLink || ""}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            data: { ...editingSection.data, buttonLink: e.target.value },
                          })
                        }
                        placeholder="/shop"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-6 border-t border-slate-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
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
                  <span>{isSaving ? "Saving..." : "Save Section"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Section Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Select Section Type to Add
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { type: "hero_slider", name: "Campaign Hero Slider", desc: "Top banner rotating carousel" },
                { type: "product_carousel", name: "Product Carousel", desc: "Horizontal scroll product row" },
                { type: "category_collection", name: "Category Grid", desc: "Categories with icons & counts" },
                { type: "video_banner", name: "Promo Video Banner", desc: "Hero video/poster with overlay CTA" },
                { type: "banner_grid", name: "3-Column Promo Grid", desc: "Three campaign spotlight banners" },
                { type: "new_arrivals", name: "New Arrivals Tabs", desc: "Tabbed category product filter" },
                { type: "bento_grid", name: "Bento Active Grid", desc: "Asymmetric collage promo layout" },
                { type: "feature_grid", name: "Value Propositions", desc: "Delivery, returns, authentication" },
                { type: "custom_html", name: "Custom HTML / Text", desc: "Freeform rich text or HTML embed" },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleCreateSection(item.type as SectionType, item.name)}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-amber-400/60 hover:bg-slate-800/80 text-left transition-all group"
                >
                  <div className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
