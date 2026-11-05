"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Sparkles,
  Smartphone,
  Monitor,
  Link as LinkIcon,
  Layers,
  HelpCircle,
  Copy,
  AlertCircle,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import SingleImageUploader from "@/components/admin/SingleImageUploader";
import { Section } from "@/types/cms";

interface HeroSlide {
  id: string;
  desktopImage: string;
  mobileImage: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  link?: string;
  hasBrandOverlay?: boolean;
  isEnabled?: boolean;
}

export default function HeroBannersAdminPage() {
  const { sections, refreshData } = useCMS();
  const heroSection = sections.find((s) => s.type === "hero_slider");

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (heroSection?.data?.slides) {
      setSlides(JSON.parse(JSON.stringify(heroSection.data.slides)));
    }
  }, [heroSection]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      desktopImage: "/assets/banner/VuASK1790148496-light-4348x1613.jpeg",
      mobileImage: "/assets/banner/M93eh1790150699-light-1686x1800.jpg",
      title: "New Campaign Drop",
      subtitle: "EXPLORE YOUR FASHION",
      buttonText: "Shop Collection",
      buttonLink: "/category/New-Arrivals",
      link: "/category/New-Arrivals",
      hasBrandOverlay: false,
      isEnabled: true,
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setActiveSlideIdx(updated.length - 1);
    showToast("New banner slide added! Click Save to apply changes.");
  };

  const handleDuplicateSlide = (index: number) => {
    const target = slides[index];
    const copy: HeroSlide = {
      ...JSON.parse(JSON.stringify(target)),
      id: `slide-${Date.now()}`,
      title: `${target.title || "Banner"} (Copy)`,
    };
    const updated = [...slides];
    updated.splice(index + 1, 0, copy);
    setSlides(updated);
    setActiveSlideIdx(index + 1);
    showToast("Banner slide duplicated!");
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert("At least one hero banner slide is required.");
      return;
    }
    if (!confirm("Are you sure you want to delete this banner slide?")) return;
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
    setActiveSlideIdx(Math.max(0, index - 1));
    showToast("Banner slide removed.");
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= slides.length) return;
    const updated = [...slides];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setSlides(updated);
    setActiveSlideIdx(target);
  };

  const handleUpdateCurrentSlide = (field: keyof HeroSlide, value: any) => {
    const updated = [...slides];
    updated[activeSlideIdx] = {
      ...updated[activeSlideIdx],
      [field]: value,
    };
    setSlides(updated);
  };

  const handleSaveAll = async () => {
    if (!heroSection) {
      alert("Hero section not found in CMS.");
      return;
    }
    setIsSaving(true);
    try {
      const updatedSection: Section = {
        ...heroSection,
        data: {
          ...heroSection.data,
          slides: slides,
        },
      };

      const res = await fetch(`/api/sections/${heroSection.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSection),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showToast("Hero banner slides updated and published successfully!");
      } else {
        showToast(data.message || "Failed to update banners", "error");
      }
    } catch {
      showToast("Error saving banner changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const currentSlide = slides[activeSlideIdx];

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all duration-300 animate-slide-in ${
            notification.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/90 border-red-500/40 text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-[#1e293b] border border-slate-700/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              WEBSITE CMS
            </span>
            <span className="text-xs text-slate-400 font-medium">Homepage Top Hero Banner</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ImageIcon className="w-7 h-7 text-amber-400" />
            Hero Banner Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Upload and customize hero carousel banners. Change desktop and mobile banner images, links, titles, and ordering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" /> View Live Homepage
          </Link>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save All Banners"}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Slide Tabs + Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Slide List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#1e293b] border border-slate-700/80 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Banner Slides ({slides.length})
              </h3>
              <button
                onClick={handleAddSlide}
                className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Slide
              </button>
            </div>

            <div className="space-y-3">
              {slides.map((slide, idx) => {
                const isActive = idx === activeSlideIdx;
                return (
                  <div
                    key={slide.id || idx}
                    onClick={() => setActiveSlideIdx(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isActive
                        ? "bg-amber-400/10 border-amber-400/50 shadow-md ring-1 ring-amber-400/30"
                        : "bg-slate-900/60 border-slate-700/60 hover:bg-slate-850 hover:border-slate-600"
                    }`}
                  >
                    {/* Thumbnail Preview */}
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0 relative">
                      <img
                        src={slide.desktopImage || "/assets/banner/VuASK1790148496-light-4348x1613.jpeg"}
                        alt="Slide"
                        className="w-full h-full object-cover"
                      />
                      {!slide.isEnabled && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Slide Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">
                          Slide #{idx + 1}: {slide.title || "Banner"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {slide.isEnabled !== false ? (
                            <span className="text-emerald-400">● Active</span>
                          ) : (
                            <span className="text-slate-500">○ Hidden</span>
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        Link: {slide.link || slide.buttonLink || "/category/New-Arrivals"}
                      </p>
                    </div>

                    {/* Reorder / Actions */}
                    <div className="flex flex-col gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleMoveSlide(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(idx, "down")}
                        disabled={idx === slides.length - 1}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Slide Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentSlide ? (
            <div className="bg-[#1e293b] border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              {/* Slide Title & Quick Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Editing Slide #{activeSlideIdx + 1}
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">ID: {currentSlide.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateCurrentSlide("isEnabled", currentSlide.isEnabled === false ? true : false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                      currentSlide.isEnabled !== false
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {currentSlide.isEnabled !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{currentSlide.isEnabled !== false ? "Visible on Site" : "Hidden"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicateSlide(activeSlideIdx)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                    title="Duplicate slide"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(activeSlideIdx)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                    title="Delete slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Image Uploaders: Desktop and Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Desktop Image */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-amber-400" /> Desktop Banner Image *
                    </label>
                    <span className="text-[10px] text-slate-500">Recommended: 1920x800 or 4348x1613</span>
                  </div>

                  <SingleImageUploader
                    currentImage={currentSlide.desktopImage}
                    onImageUploaded={(url) => handleUpdateCurrentSlide("desktopImage", url)}
                    onRemove={() => handleUpdateCurrentSlide("desktopImage", "/assets/banner/VuASK1790148496-light-4348x1613.jpeg")}
                    label="Upload Desktop Banner"
                  />
                  <div className="mt-1">
                    <input
                      type="text"
                      placeholder="Or enter image URL (/assets/banner/... or https://...)"
                      value={currentSlide.desktopImage || ""}
                      onChange={(e) => handleUpdateCurrentSlide("desktopImage", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Mobile Image */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-400" /> Mobile Banner Image
                    </label>
                    <span className="text-[10px] text-slate-500">Recommended: 1080x1350 or 1686x1800</span>
                  </div>

                  <SingleImageUploader
                    currentImage={currentSlide.mobileImage}
                    onImageUploaded={(url) => handleUpdateCurrentSlide("mobileImage", url)}
                    onRemove={() => handleUpdateCurrentSlide("mobileImage", "/assets/banner/M93eh1790150699-light-1686x1800.jpg")}
                    label="Upload Mobile Banner"
                  />
                  <div className="mt-1">
                    <input
                      type="text"
                      placeholder="Or enter mobile image URL (/assets/banner/...)"
                      value={currentSlide.mobileImage || ""}
                      onChange={(e) => handleUpdateCurrentSlide("mobileImage", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Banner Details & Target Link */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Banner Text & Link Destination
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Slide Heading (Title)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VANGUARD TACTICAL DROP"
                      value={currentSlide.title || ""}
                      onChange={(e) => handleUpdateCurrentSlide("title", e.target.value)}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-medium outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Subtitle / Eyebrow Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EXPLORE YOUR FASHION"
                      value={currentSlide.subtitle || ""}
                      onChange={(e) => handleUpdateCurrentSlide("subtitle", e.target.value)}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-medium outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Button Text (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Shop Collection"
                      value={currentSlide.buttonText || ""}
                      onChange={(e) => handleUpdateCurrentSlide("buttonText", e.target.value)}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-medium outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                      Target Click Link (URL) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /category/New-Arrivals or /shop"
                      value={currentSlide.link || currentSlide.buttonLink || ""}
                      onChange={(e) => {
                        handleUpdateCurrentSlide("link", e.target.value);
                        handleUpdateCurrentSlide("buttonLink", e.target.value);
                      }}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Overlay Toggle */}
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Brand Badge Overlay
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Display brand badge overlay in top corner of banner. Keep disabled if your banner artwork already contains brand text.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!currentSlide.hasBrandOverlay}
                      onChange={(e) => handleUpdateCurrentSlide("hasBrandOverlay", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                  </label>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Tip: Uploading high-resolution WEBP or JPG photos produces the sharpest banner.
                </span>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save All Banners"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-[#1e293b] rounded-3xl border border-slate-700 text-slate-400">
              No banner slide selected. Click "Add Slide" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
