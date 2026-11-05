"use client";

import React, { useState, useEffect } from "react";
import { Package, Save, Check, Plus, Trash2 } from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import { ShippingConfig } from "@/types/cms";

export default function AdminShippingPage() {
  const { settings, refreshData } = useCMS();
  const [shipping, setShipping] = useState<ShippingConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (settings?.shipping) {
      setShipping({ ...settings.shipping });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipping }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        setSuccessMsg("Shipping charges and threshold rules updated.");
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const addDistrictRate = () => {
    if (!shipping) return;
    setShipping({
      ...shipping,
      districtRates: [...(shipping.districtRates || []), { district: "New District", rate: 130 }],
    });
  };

  const removeDistrictRate = (idx: number) => {
    if (!shipping) return;
    const updated = [...shipping.districtRates];
    updated.splice(idx, 1);
    setShipping({ ...shipping, districtRates: updated });
  };

  if (!shipping) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Shipping Rules...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Package className="text-amber-400" size={26} />
            Shipping Charge & Zone Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Configure Dhaka inside/outside rates, district-level overrides, and free shipping order thresholds.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition disabled:opacity-50"
        >
          <Save size={15} />
          <span>{isSaving ? "Saving..." : "Save Shipping Rules"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Core Shipping Rates */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider">Primary Delivery Rates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Inside Dhaka City (BDT)</label>
            <input
              type="number"
              value={shipping.insideDhaka}
              onChange={(e) => setShipping({ ...shipping, insideDhaka: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Outside Dhaka City (BDT)</label>
            <input
              type="number"
              value={shipping.outsideDhaka}
              onChange={(e) => setShipping({ ...shipping, outsideDhaka: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Free Delivery Threshold (BDT)</label>
            <input
              type="number"
              value={shipping.freeShippingThreshold}
              onChange={(e) => setShipping({ ...shipping, freeShippingThreshold: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* District-Wise Overrides */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">District-Level Charge Overrides</h3>
            <p className="text-slate-400 text-xs">Set specific delivery rates for high-frequency or remote districts.</p>
          </div>
          <button
            type="button"
            onClick={addDistrictRate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700"
          >
            <Plus size={14} /> Add District
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shipping.districtRates?.map((dist, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <input
                type="text"
                value={dist.district}
                onChange={(e) => {
                  const updated = [...shipping.districtRates];
                  updated[idx].district = e.target.value;
                  setShipping({ ...shipping, districtRates: updated });
                }}
                className="flex-1 bg-transparent text-xs text-white focus:outline-none"
              />
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className="text-slate-400">৳</span>
                <input
                  type="number"
                  value={dist.rate}
                  onChange={(e) => {
                    const updated = [...shipping.districtRates];
                    updated[idx].rate = Number(e.target.value);
                    setShipping({ ...shipping, districtRates: updated });
                  }}
                  className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-right focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeDistrictRate(idx)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
