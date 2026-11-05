"use client";

import React, { useState } from "react";
import {
  Footprints,
  Save,
  Check,
  Palette,
  Phone,
  Mail,
  MapPin,
  Share2,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function AdminFooterPage() {
  const { settings, updateSettings, refreshData } = useCMS();
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(settings)));
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
      await updateSettings(formData);
      await refreshData();
      showNotification("Footer settings saved live!");
    } catch {
      alert("Failed to save footer settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Footprints className="w-6 h-6 text-amber-400" />
            Footer Management CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage footer background, giant watermark text, company description, contact details, and social links.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Footer"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Footer Text & Watermark */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            General Footer Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Giant Watermark Text</label>
              <input
                type="text"
                value={formData.footer?.watermarkText || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footer: { ...formData.footer, watermarkText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold uppercase tracking-wider"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Copyright Notice</label>
              <input
                type="text"
                value={formData.footer?.copyrightText || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footer: { ...formData.footer, copyrightText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Footer Brand Bio</label>
            <textarea
              rows={3}
              value={formData.footer?.description || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  footer: { ...formData.footer, description: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.footer?.bgColor || "#0a0a0a"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: { ...formData.footer, bgColor: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded border border-slate-700 cursor-pointer"
                />
                <span className="font-mono text-slate-400">
                  {formData.footer?.bgColor || "#0a0a0a"}
                </span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer mt-5">
                <input
                  type="checkbox"
                  checked={formData.footer?.showNewsletter !== false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: { ...formData.footer, showNewsletter: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-amber-400 bg-slate-950 border-slate-700"
                />
                <span className="text-xs font-semibold text-slate-300">Show Newsletter Box</span>
              </label>
            </div>
          </div>
        </div>

        {/* Contact Info in Footer */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-400" />
            Contact & Support Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hotline / Phone</label>
              <input
                type="text"
                value={formData.contact?.phone || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="text"
                value={formData.contact?.email || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Store / HQ Address</label>
            <input
              type="text"
              value={formData.contact?.address || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, address: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            Social Media Handles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.social?.facebook || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social: { ...formData.social, facebook: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.social?.instagram || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social: { ...formData.social, instagram: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">YouTube Channel URL</label>
              <input
                type="text"
                value={formData.social?.youtube || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social: { ...formData.social, youtube: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">TikTok URL</label>
              <input
                type="text"
                value={formData.social?.tiktok || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social: { ...formData.social, tiktok: e.target.value },
                  })
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
