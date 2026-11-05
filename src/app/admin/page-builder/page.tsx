"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Settings,
  Palette,
  Type,
  Link as LinkIcon,
  Save,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Edit,
  EyeOff,
  X,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import SectionRenderer from "@/components/cms/SectionRenderer";
import { Section, SectionType } from "@/types/cms";
import SingleImageUploader from "@/components/admin/SingleImageUploader";

export default function VisualPageBuilder() {
  const { sections, pages, refreshData, reorderSections } = useCMS();
  const [selectedPage, setSelectedPage] = useState("home");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Modals for visual actions
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [buttonModalOpen, setButtonModalOpen] = useState(false);
  const [addSectionModalOpen, setAddSectionModalOpen] = useState(false);

  const pageSections = sections
    .filter((s) => s.pageSlug === selectedPage)
    .sort((a, b) => a.order - b.order);

  const activeSection = pageSections.find((s) => s.id === activeSectionId) || pageSections[0];

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pageSections.length) return;

    const newSections = [...pageSections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const orderedIds = newSections.map((s) => s.id);
    await reorderSections(orderedIds);
    showNotification("Section rearranged!");
  };

  const handleUpdateActiveSection = async (updatedData: Partial<Section>) => {
    if (!activeSection) return;
    try {
      const res = await fetch(`/api/sections/${activeSection.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...activeSection, ...updatedData }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showNotification("Changes published live!");
      }
    } catch {
      alert("Failed to update section.");
    }
  };

  const handleToggleVisibility = async (sec: Section) => {
    try {
      const res = await fetch(`/api/sections/${sec.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sec, isEnabled: !sec.isEnabled }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showNotification(sec.isEnabled ? `Section disabled` : `Section enabled`);
      }
    } catch {
      alert("Failed to toggle section.");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/sections/${id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showNotification("Section duplicated!");
      }
    } catch {
      alert("Failed to duplicate.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this section?")) return;
    try {
      const res = await fetch(`/api/sections/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showNotification("Section removed.");
      }
    } catch {
      alert("Failed to delete.");
    }
  };

  const handleCreateSection = async (type: SectionType, name: string) => {
    try {
      const newSec: Partial<Section> = {
        name,
        type,
        title: name,
        order: pageSections.length + 1,
        isEnabled: true,
        pageSlug: selectedPage,
        styles: { paddingTop: "32px", paddingBottom: "32px", bgColor: "#ffffff", textColor: "#111111" },
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
        setAddSectionModalOpen(false);
        setActiveSectionId(data.data.id);
        showNotification(`New section "${name}" added!`);
      }
    } catch {
      alert("Failed to add section.");
    }
  };

  const viewportWidthClass =
    viewport === "mobile"
      ? "w-[375px]"
      : viewport === "tablet"
      ? "w-[768px]"
      : "w-full max-w-[1360px]";

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Page Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Visual Page Builder
            </span>
          </div>
          <select
            value={selectedPage}
            onChange={(e) => {
              setSelectedPage(e.target.value);
              setActiveSectionId(null);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
          >
            <option value="home">Homepage (Main Storefront)</option>
            {pages
              ?.filter((p) => p.slug !== "home")
              .map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.title} (/{p.slug})
                </option>
              ))}
          </select>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setViewport("desktop")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewport === "desktop"
                ? "bg-amber-400 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewport === "tablet"
                ? "bg-amber-400 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewport === "mobile"
                ? "bg-amber-400 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Save Notification */}
        <div className="flex items-center gap-2">
          {successMsg && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              {successMsg}
            </span>
          )}
          <button
            onClick={() => setAddSectionModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Section</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-190px)] min-h-[640px]">
        {/* Left Side: Sections Tree & Visual Actions (4 cols) */}
        <div className="lg:col-span-4 bg-[#1e293b] rounded-2xl border border-slate-700 flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="p-3.5 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Sections Tree ({pageSections.length})
            </h3>
            <span className="text-[10px] text-slate-400">Click to Select</span>
          </div>

          {/* Section List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {pageSections.map((sec, idx) => {
              const isSelected = activeSection?.id === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-amber-400/10 border-amber-400 text-white shadow-sm"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  } ${!sec.isEnabled ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-400">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="font-bold truncate flex items-center gap-1.5">
                        <span>{sec.name}</span>
                        {!sec.isEnabled && <EyeOff size={11} className="text-slate-500" />}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{sec.type}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleVisibility(sec)}
                      title={sec.isEnabled ? "Disable section" : "Enable section"}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      {sec.isEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === pageSections.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(sec.id)}
                      className="p-1 text-slate-400 hover:text-amber-400"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(sec.id)}
                      className="p-1 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Live Visual Actions Toolbar */}
          {activeSection && (
            <div className="p-4 border-t border-slate-700 bg-slate-900/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 truncate max-w-[200px]">
                  {activeSection.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{activeSection.type}</span>
              </div>

              {/* Dedicated Visual Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTextModalOpen(true)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 border border-slate-700 text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition"
                >
                  <Type size={14} className="text-amber-400" />
                  <span>Edit Text</span>
                </button>

                <button
                  onClick={() => setImageModalOpen(true)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 border border-slate-700 text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition"
                >
                  <ImageIcon size={14} className="text-cyan-400" />
                  <span>Edit Image</span>
                </button>

                <button
                  onClick={() => setButtonModalOpen(true)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 border border-slate-700 text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition"
                >
                  <LinkIcon size={14} className="text-emerald-400" />
                  <span>Edit Button</span>
                </button>
              </div>

              {/* Color Styling */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={activeSection.styles?.bgColor || "#ffffff"}
                      onChange={(e) =>
                        handleUpdateActiveSection({
                          styles: { ...activeSection.styles, bgColor: e.target.value },
                        })
                      }
                      className="w-6 h-6 rounded border border-slate-700 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-400">
                      {activeSection.styles?.bgColor || "#ffffff"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Text Color
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={activeSection.styles?.textColor || "#111111"}
                      onChange={(e) =>
                        handleUpdateActiveSection({
                          styles: { ...activeSection.styles, textColor: e.target.value },
                        })
                      }
                      className="w-6 h-6 rounded border border-slate-700 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-400">
                      {activeSection.styles?.textColor || "#111111"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Visual Preview Canvas */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-700/80 p-4 flex flex-col items-center justify-start overflow-y-auto">
          <div
            className={`${viewportWidthClass} bg-[#faf9f6] text-black rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 min-h-full border border-neutral-300`}
          >
            {/* Visual Canvas Render */}
            <div className="divide-y divide-neutral-200">
              {pageSections
                .filter((s) => s.isEnabled)
                .map((sec) => (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`relative cursor-pointer transition-all ${
                      activeSection?.id === sec.id
                        ? "ring-2 ring-amber-500 shadow-md"
                        : "hover:ring-1 hover:ring-blue-400/50"
                    }`}
                  >
                    {activeSection?.id === sec.id && (
                      <div className="absolute top-2 right-2 z-30 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider shadow">
                        Selected: {sec.name}
                      </div>
                    )}
                    <SectionRenderer section={sec} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Edit Section Text */}
      {textModalOpen && activeSection && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Type size={16} className="text-amber-400" />
                Edit Text: {activeSection.name}
              </h3>
              <button
                onClick={() => setTextModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Section Title</label>
                <input
                  type="text"
                  value={activeSection.title || ""}
                  onChange={(e) => handleUpdateActiveSection({ title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Eyebrow / Subtitle</label>
                <input
                  type="text"
                  value={activeSection.eyebrow || ""}
                  onChange={(e) => handleUpdateActiveSection({ eyebrow: e.target.value })}
                  placeholder="e.g. LIMITED EDITION, NEW ARRIVALS"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Content</label>
                <textarea
                  rows={3}
                  value={activeSection.description || ""}
                  onChange={(e) => handleUpdateActiveSection({ description: e.target.value })}
                  placeholder="Optional section description paragraph..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setTextModalOpen(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Replace Section Image */}
      {imageModalOpen && activeSection && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ImageIcon size={16} className="text-cyan-400" />
                Replace Image: {activeSection.name}
              </h3>
              <button
                onClick={() => setImageModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>

            <SingleImageUploader
              label="Upload Section Poster or Banner Image"
              value={activeSection.data?.posterImage || activeSection.data?.image || ""}
              onChange={(newUrl) => {
                handleUpdateActiveSection({
                  data: {
                    ...activeSection.data,
                    posterImage: newUrl,
                    image: newUrl,
                  },
                });
              }}
              folder="banners"
            />

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Button Label & Link */}
      {buttonModalOpen && activeSection && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <LinkIcon size={16} className="text-emerald-400" />
                Edit Button: {activeSection.name}
              </h3>
              <button
                onClick={() => setButtonModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Button Label</label>
                <input
                  type="text"
                  value={activeSection.data?.buttonText || "Shop Now"}
                  onChange={(e) =>
                    handleUpdateActiveSection({
                      data: { ...activeSection.data, buttonText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Button Link (URL)</label>
                <input
                  type="text"
                  value={activeSection.data?.buttonLink || "/shop"}
                  onChange={(e) =>
                    handleUpdateActiveSection({
                      data: { ...activeSection.data, buttonLink: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setButtonModalOpen(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Section */}
      {addSectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-sm">Add New Section to {selectedPage}</h3>
              <button
                onClick={() => setAddSectionModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { type: "product_carousel", name: "Product Carousel", desc: "Swipeable products slider" },
                { type: "category_collection", name: "Category Grid", desc: "Circular category bubbles" },
                { type: "hero_slider", name: "Hero Banner", desc: "Multi-slide fullwidth banner" },
                { type: "video_banner", name: "Promo Banner", desc: "Banner with CTA button" },
                { type: "bento_grid", name: "Bento Feature Grid", desc: "Modern mosaic tiles" },
                { type: "feature_grid", name: "Trust Badges", desc: "Delivery & warranty icons" },
              ].map((s) => (
                <button
                  key={s.type}
                  onClick={() => handleCreateSection(s.type as SectionType, s.name)}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/80 text-left transition group"
                >
                  <div className="font-bold text-white group-hover:text-amber-400">{s.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
