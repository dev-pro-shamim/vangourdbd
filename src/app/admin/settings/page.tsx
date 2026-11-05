"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  Check,
  Database,
  Cloud,
  Truck,
  Phone,
  DollarSign,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function AdminSettingsPage() {
  const { settings, updateSettings, refreshData } = useCMS();
  const [shipping, setShipping] = useState(JSON.parse(JSON.stringify(settings.shipping)));
  const [contact, setContact] = useState(JSON.parse(JSON.stringify(settings.contact)));
  const [brand, setBrand] = useState(JSON.parse(JSON.stringify(settings.brand)));
  const [mongoUri, setMongoUri] = useState("mongodb://localhost:27017/commandobd_cms");
  const [cloudName, setCloudName] = useState("");
  const [apiKey, setApiKey] = useState("");
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
      await updateSettings({ shipping, contact, brand });
      await refreshData();
      showNotification("Website settings and business rules updated!");
    } catch {
      alert("Failed to save settings.");
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
            <Settings className="w-6 h-6 text-amber-400" />
            Website & Store Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure delivery fees across Bangladesh, free shipping thresholds, contact hotlines, and database integrations.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Shipping & Delivery Rules */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            Shipping & Delivery Charges (Bangladesh)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Inside Dhaka Delivery Fee (৳)
              </label>
              <input
                type="number"
                value={shipping.insideDhaka}
                onChange={(e) =>
                  setShipping({ ...shipping, insideDhaka: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Outside Dhaka Delivery Fee (৳)
              </label>
              <input
                type="number"
                value={shipping.outsideDhaka}
                onChange={(e) =>
                  setShipping({ ...shipping, outsideDhaka: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Free Delivery Minimum Order (৳)
              </label>
              <input
                type="number"
                value={shipping.freeShippingThreshold}
                onChange={(e) =>
                  setShipping({
                    ...shipping,
                    freeShippingThreshold: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold"
                required
              />
            </div>
          </div>
        </div>

        {/* Database & Cloud Architecture Settings */}
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Database & Cloudinary Integration
          </h2>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              MongoDB Connection URI
            </label>
            <input
              type="text"
              value={mongoUri}
              onChange={(e) => setMongoUri(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Set `MONGODB_URI` environment variable to connect to your live MongoDB Atlas cluster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Cloudinary Cloud Name
              </label>
              <input
                type="text"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="e.g. commandobd-store"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Cloudinary API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="e.g. 1234567890"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
