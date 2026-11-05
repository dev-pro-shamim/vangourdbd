"use client";

import React, { useState } from "react";
import {
  Navigation,
  Save,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Palette,
  Sliders,
  Bell,
  Eye,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function AdminHeaderPage() {
  const { settings, menus, updateSettings, refreshData } = useCMS();
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(settings)));
  const [headerMenuItems, setHeaderMenuItems] = useState(
    JSON.parse(JSON.stringify(menus.find((m) => m.location === "header_main")?.items || []))
  );
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
      // 1. Update Site Settings (Brand, Header, Announcement)
      await updateSettings(formData);

      // 2. Update Header Navigation Menu
      const headerMenu = menus.find((m) => m.location === "header_main");
      if (headerMenu) {
        await fetch("/api/menus", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: headerMenu.id, items: headerMenuItems }),
        });
      }

      await refreshData();
      showNotification("Header settings & menus saved live!");
    } catch {
      alert("Failed to save header settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMenuItem = () => {
    setHeaderMenuItems([
      ...headerMenuItems,
      {
        id: `m-${Date.now()}`,
        label: "New Link",
        href: "/shop",
        isHighlight: false,
      },
    ]);
  };

  const handleRemoveMenuItem = (id: string) => {
    setHeaderMenuItems(headerMenuItems.filter((item: any) => item.id !== id));
  };

  const handleMoveMenuItem = (idx: number, dir: "up" | "down") => {
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= headerMenuItems.length) return;
    const arr = [...headerMenuItems];
    const [item] = arr.splice(idx, 1);
    arr.splice(target, 0, item);
    setHeaderMenuItems(arr);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Navigation className="w-6 h-6 text-amber-400" />
            Header & Navigation CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your brand logo, dimensions, announcement bar, menu links, and header visibility switches.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save All Changes"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Brand Logo & Name */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Logo & Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Brand Name</label>
              <input
                type="text"
                value={formData.brand?.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, brand: { ...formData.brand, name: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tagline</label>
              <input
                type="text"
                value={formData.brand?.tagline || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    brand: { ...formData.brand, tagline: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Custom Logo Image URL</label>
            <input
              type="text"
              value={formData.brand?.logoUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, brand: { ...formData.brand, logoUrl: e.target.value } })
              }
              placeholder="Leave empty to use built-in vector tactical emblem"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Logo Width ({formData.brand?.logoWidth || 44}px)
              </label>
              <input
                type="range"
                min="24"
                max="120"
                value={formData.brand?.logoWidth || 44}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    brand: { ...formData.brand, logoWidth: parseInt(e.target.value) },
                  })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Logo Height ({formData.brand?.logoHeight || 44}px)
              </label>
              <input
                type="range"
                min="24"
                max="120"
                value={formData.brand?.logoHeight || 44}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    brand: { ...formData.brand, logoHeight: parseInt(e.target.value) },
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              Announcement Bar
            </h2>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcement?.isEnabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcement: { ...formData.announcement, isEnabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700"
              />
              <span className="text-xs font-bold text-slate-300">Enable Announcement Bar</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Announcement Message</label>
            <input
              type="text"
              value={formData.announcement?.text || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  announcement: { ...formData.announcement, text: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Link</label>
              <input
                type="text"
                value={formData.announcement?.link || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcement: { ...formData.announcement, link: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.announcement?.bgColor || "#111111"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      announcement: { ...formData.announcement, bgColor: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded border border-slate-700 cursor-pointer"
                />
                <span className="font-mono text-slate-400">
                  {formData.announcement?.bgColor || "#111111"}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.announcement?.textColor || "#ffffff"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      announcement: { ...formData.announcement, textColor: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded border border-slate-700 cursor-pointer"
                />
                <span className="font-mono text-slate-400">
                  {formData.announcement?.textColor || "#ffffff"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Layout & Navigation Links */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-400" />
              Navigation Menu Links ({headerMenuItems.length})
            </h2>

            <button
              type="button"
              onClick={handleAddMenuItem}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-2">
            {headerMenuItems.map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center gap-3"
              >
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveMenuItem(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveMenuItem(idx, "down")}
                    disabled={idx === headerMenuItems.length - 1}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...headerMenuItems];
                      updated[idx].label = e.target.value;
                      setHeaderMenuItems(updated);
                    }}
                    placeholder="Menu Label"
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => {
                      const updated = [...headerMenuItems];
                      updated[idx].href = e.target.value;
                      setHeaderMenuItems(updated);
                    }}
                    placeholder="/category/..."
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <label className="flex items-center gap-1.5 text-slate-400 text-[11px] cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={item.isHighlight}
                    onChange={(e) => {
                      const updated = [...headerMenuItems];
                      updated[idx].isHighlight = e.target.checked;
                      setHeaderMenuItems(updated);
                    }}
                    className="w-3.5 h-3.5 text-amber-400 rounded bg-slate-950 border-slate-700"
                  />
                  <span>Highlight</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleRemoveMenuItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Switches */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            Header Icons & Behaviors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.header?.showSearch !== false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    header: { ...formData.header, showSearch: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-amber-400 bg-slate-950 border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-300">Search Modal Icon</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.header?.showCart !== false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    header: { ...formData.header, showCart: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-amber-400 bg-slate-950 border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-300">Shopping Cart Button</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.header?.showLogin !== false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    header: { ...formData.header, showLogin: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-amber-400 bg-slate-950 border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-300">Login / Account Pill</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
