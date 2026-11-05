"use client";

import React, { useState } from "react";
import {
  Palette,
  Save,
  Check,
  RotateCcw,
  Sliders,
  Type,
  Layout,
  Eye,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function AdminDesignSettingsPage() {
  const { settings, updateSettings, refreshData } = useCMS();
  const [colors, setColors] = useState(JSON.parse(JSON.stringify(settings.colors)));
  const [layout, setLayout] = useState(JSON.parse(JSON.stringify(settings.layout)));
  const [typography, setTypography] = useState(JSON.parse(JSON.stringify(settings.typography)));
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
      await updateSettings({ colors, layout, typography });
      await refreshData();
      showNotification("Global design tokens updated! Changes live across website.");
    } catch {
      alert("Failed to save design settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (!confirm("Reset colors and design to reference defaults?")) return;
    setColors({
      primary: "#111111",
      secondary: "#d4145a",
      background: "#faf9f6",
      title: "#222831",
      paragraph: "#252a34",
      border: "#cccccc",
      alert: "#ff1818",
      success: "#34be82",
      warning: "#f8b400",
    });
    setLayout({
      containerWidth: 1440,
      borderRadius: "16px",
      sectionSpacing: "48px",
    });
    showNotification("Reset to reference defaults. Click 'Save All Changes' to apply.");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-amber-400" />
            Global Design Settings CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Customize the global color palette, typography, container widths, and border radiuses. Changes dynamically propagate to all components.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Design Settings"}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Live Color Swatch Strip */}
      <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-400" />
          Live Design Palette Preview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Primary", color: colors.primary },
            { label: "Secondary", color: colors.secondary },
            { label: "Background", color: colors.background },
            { label: "Titles", color: colors.title },
            { label: "Paragraphs", color: colors.paragraph },
            { label: "Borders", color: colors.border },
            { label: "Alert", color: colors.alert },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
              <div
                className="w-full h-10 rounded-lg border border-slate-700 mb-2 shadow-inner"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-[11px] font-bold text-white">{item.label}</div>
              <div className="text-[10px] font-mono text-slate-400">{item.color}</div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Color Palette Controls */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            Color Palette Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Brand Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={colors.primary}
                  onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Secondary Accent Color (Discount & Highlights)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={colors.secondary}
                  onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Page Canvas Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.background}
                  onChange={(e) => setColors({ ...colors, background: e.target.value })}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={colors.background}
                  onChange={(e) => setColors({ ...colors, background: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Headings & Titles Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.title}
                  onChange={(e) => setColors({ ...colors, title: e.target.value })}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={colors.title}
                  onChange={(e) => setColors({ ...colors, title: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Body Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.paragraph}
                  onChange={(e) => setColors({ ...colors, paragraph: e.target.value })}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={colors.paragraph}
                  onChange={(e) => setColors({ ...colors, paragraph: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Border Lines Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.border}
                  onChange={(e) => setColors({ ...colors, border: e.target.value })}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={colors.border}
                  onChange={(e) => setColors({ ...colors, border: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Layout & Typography Controls */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Layout className="w-4 h-4 text-amber-400" />
            Layout Spacing & Border Radius
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Container Max Width (px)</label>
              <input
                type="number"
                value={layout.containerWidth}
                onChange={(e) =>
                  setLayout({ ...layout, containerWidth: parseInt(e.target.value) || 1440 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Corner Border Radius</label>
              <select
                value={layout.borderRadius}
                onChange={(e) => setLayout({ ...layout, borderRadius: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              >
                <option value="8px">Small (8px)</option>
                <option value="12px">Medium (12px)</option>
                <option value="16px">Standard (16px - Commando Original)</option>
                <option value="20px">Rounded (20px)</option>
                <option value="24px">Extra Rounded (24px)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Base Font Size (px)</label>
              <input
                type="number"
                value={typography.baseFontSize || 14}
                onChange={(e) =>
                  setTypography({ ...typography, baseFontSize: parseInt(e.target.value) || 14 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
