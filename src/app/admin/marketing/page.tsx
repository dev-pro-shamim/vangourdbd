"use client";

import React, { useState, useEffect } from "react";
import { Tag, Save, Check, ShieldCheck, Activity } from "lucide-react";
import { TrackingSettings } from "@/types/cms";

export default function AdminMarketingPage() {
  const [settings, setSettings] = useState<TrackingSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/api/tracking")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSettings(d.data);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/tracking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Tracking and Marketing configurations saved successfully.");
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Tracking Engine...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Tag className="text-indigo-400" size={26} />
            Marketing & Tracking Integrations
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Meta Pixel, Server-Side Conversions API (CAPI), and Google Tag Manager (GTM) data layer tracking.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition disabled:opacity-50"
        >
          <Save size={15} />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Meta Facebook Pixel & Conversions API */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-sm">
              f
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Meta Facebook Pixel & Conversions API (CAPI)</h3>
              <p className="text-slate-400 text-xs">Track client-side events and dispatch server-side CAPI events.</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
            <input
              type="checkbox"
              checked={settings.metaPixel.isEnabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  metaPixel: { ...settings.metaPixel, isEnabled: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-indigo-600"
            />
            <span className={settings.metaPixel.isEnabled ? "text-emerald-400" : "text-slate-400"}>
              {settings.metaPixel.isEnabled ? "Active" : "Disabled"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Pixel ID</label>
            <input
              type="text"
              placeholder="e.g. 982736451029384"
              value={settings.metaPixel.pixelId}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  metaPixel: { ...settings.metaPixel, pixelId: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Test Event Code (Optional)</label>
            <input
              type="text"
              placeholder="e.g. TEST99281"
              value={settings.metaPixel.testEventCode || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  metaPixel: { ...settings.metaPixel, testEventCode: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Conversions API Access Token (CAPI)
          </label>
          <input
            type="password"
            placeholder="EAABs..."
            value={settings.metaPixel.capiToken}
            onChange={(e) =>
              setSettings({
                ...settings,
                metaPixel: { ...settings.metaPixel, capiToken: e.target.value },
              })
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">Tracked E-Commerce Events</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key: "pageView", label: "PageView" },
              { key: "viewContent", label: "ViewContent (Product View)" },
              { key: "search", label: "Search" },
              { key: "addToCart", label: "AddToCart" },
              { key: "initiateCheckout", label: "InitiateCheckout" },
              { key: "purchase", label: "Purchase (Orders)" },
            ].map((ev) => (
              <label
                key={ev.key}
                className="flex items-center gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(settings.metaPixel.enabledEvents as any)[ev.key]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      metaPixel: {
                        ...settings.metaPixel,
                        enabledEvents: {
                          ...settings.metaPixel.enabledEvents,
                          [ev.key]: e.target.checked,
                        },
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="font-mono">{ev.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Google Tag Manager (GTM) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black text-sm">
              GTM
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Google Tag Manager (GTM)</h3>
              <p className="text-slate-400 text-xs">Inject standard container snippet and e-commerce dataLayer.</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
            <input
              type="checkbox"
              checked={settings.gtm.isEnabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  gtm: { ...settings.gtm, isEnabled: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-cyan-600"
            />
            <span className={settings.gtm.isEnabled ? "text-emerald-400" : "text-slate-400"}>
              {settings.gtm.isEnabled ? "Active" : "Disabled"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">GTM Container ID</label>
            <input
              type="text"
              placeholder="e.g. GTM-VG8892A"
              value={settings.gtm.containerId}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  gtm: { ...settings.gtm, containerId: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={settings.gtm.trackEcommerce}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    gtm: { ...settings.gtm, trackEcommerce: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-cyan-600"
              />
              <span>Push GA4 Enhanced E-commerce dataLayer events</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
