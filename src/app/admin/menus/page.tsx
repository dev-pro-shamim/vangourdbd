"use client";

import React, { useState } from "react";
import {
  Menu as MenuIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Check,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function AdminMenusPage() {
  const { menus, refreshData } = useCMS();
  const [selectedLocation, setSelectedLocation] = useState("header_main");
  const [activeMenu, setActiveMenu] = useState(
    menus.find((m) => m.location === "header_main") || menus[0]
  );
  const [menuItems, setMenuItems] = useState(activeMenu?.items || []);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc);
    const target = menus.find((m) => m.location === loc);
    if (target) {
      setActiveMenu(target);
      setMenuItems(JSON.parse(JSON.stringify(target.items)));
    }
  };

  const handleAddLink = () => {
    setMenuItems([
      ...menuItems,
      {
        id: `m-${Date.now()}`,
        label: "New Navigation Item",
        href: "/shop",
        isHighlight: false,
      },
    ]);
  };

  const handleMove = (idx: number, dir: "up" | "down") => {
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= menuItems.length) return;
    const arr = [...menuItems];
    const [item] = arr.splice(idx, 1);
    arr.splice(target, 0, item);
    setMenuItems(arr);
  };

  const handleRemove = (id: string) => {
    setMenuItems(menuItems.filter((m) => m.id !== id));
  };

  const handleSave = async () => {
    if (!activeMenu) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeMenu.id, items: menuItems }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showNotification(`Saved "${activeMenu.name}" successfully!`);
      }
    } catch {
      alert("Failed to save menu.");
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
            <MenuIcon className="w-6 h-6 text-amber-400" />
            Navigation Menus CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build and organize custom navigation links for your Header, Mobile Drawer, and Footer columns.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Menu"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Menu Location Selector */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 mr-2">Select Menu:</span>
        {[
          { key: "header_main", label: "Header Main Menu" },
          { key: "footer_company", label: "Footer Company" },
          { key: "footer_policies", label: "Footer Policies" },
          { key: "footer_quick", label: "Footer Quick Links" },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => handleSelectLocation(m.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedLocation === m.key
                ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                : "bg-slate-900 text-slate-300 hover:text-white border border-slate-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Menu Items Editor */}
      <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            Links in {activeMenu?.name} ({menuItems.length})
          </h2>
          <button
            onClick={handleAddLink}
            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-2">
          {menuItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-3"
            >
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === menuItems.length - 1}
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
                    const arr = [...menuItems];
                    arr[idx].label = e.target.value;
                    setMenuItems(arr);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="Link Label"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => {
                    const arr = [...menuItems];
                    arr[idx].href = e.target.value;
                    setMenuItems(arr);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  placeholder="URL Destination"
                />
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                className="p-1.5 text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
