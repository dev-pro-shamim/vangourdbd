"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  Save,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Package,
  Layers,
  MapPin,
  Key,
} from "lucide-react";
import { CourierSettings, CourierBooking } from "@/types/cms";

export default function AdminCourierPage() {
  const [settings, setSettings] = useState<CourierSettings | null>(null);
  const [bookings, setBookings] = useState<CourierBooking[]>([]);
  const [activeTab, setActiveTab] = useState<"settings" | "bookings">("settings");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = async () => {
    try {
      const [setRes, bookRes] = await Promise.all([
        fetch("/api/courier/settings"),
        fetch("/api/courier/bookings"),
      ]);
      const setData = await setRes.json();
      const bookData = await bookRes.json();
      if (setData.success) setSettings(setData.data);
      if (bookData.success) setBookings(bookData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/courier/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Courier settings saved successfully.");
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Courier Engine...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Truck className="text-blue-400" size={26} />
            Courier Logistics Integration
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Connect Steadfast, Pathao, and RedX for automated 1-click order fulfillment and tracking.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition disabled:opacity-50"
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === "settings"
              ? "border-blue-400 text-blue-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Key size={15} />
          <span>Courier API Configuration</span>
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === "bookings"
              ? "border-blue-400 text-blue-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Package size={15} />
          <span>Consignment Bookings ({bookings.length})</span>
        </button>
      </div>

      {activeTab === "settings" ? (
        <div className="space-y-6">
          {/* Default Courier & Sender Info */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin size={16} className="text-blue-400" />
              Default Courier & Warehouse Dispatch Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Default Courier Partner</label>
                <select
                  value={settings.defaultCourier}
                  onChange={(e: any) => setSettings({ ...settings, defaultCourier: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="Steadfast">Steadfast Courier</option>
                  <option value="Pathao">Pathao Courier</option>
                  <option value="RedX">RedX Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sender Merchant Name</label>
                <input
                  type="text"
                  value={settings.senderInfo.name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      senderInfo: { ...settings.senderInfo, name: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sender Helpline Phone</label>
                <input
                  type="text"
                  value={settings.senderInfo.phone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      senderInfo: { ...settings.senderInfo, phone: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Warehouse Pickup Address</label>
                <input
                  type="text"
                  value={settings.senderInfo.address}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      senderInfo: { ...settings.senderInfo, address: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* 1. Steadfast Courier */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-black text-xs">
                  SF
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Steadfast Courier Integration</h3>
                  <p className="text-[11px] text-slate-400">portal.steadfast.com.bd REST API v1</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                <input
                  type="checkbox"
                  checked={settings.steadfast.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      steadfast: { ...settings.steadfast, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className={settings.steadfast.enabled ? "text-emerald-400" : "text-slate-400"}>
                  {settings.steadfast.enabled ? "Active" : "Disabled"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">API Key</label>
                <input
                  type="text"
                  value={settings.steadfast.apiKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      steadfast: { ...settings.steadfast, apiKey: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Secret Key</label>
                <input
                  type="password"
                  value={settings.steadfast.secretKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      steadfast: { ...settings.steadfast, secretKey: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Base Endpoint</label>
                <input
                  type="text"
                  value={settings.steadfast.baseUrl}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      steadfast: { ...settings.steadfast, baseUrl: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* 2. Pathao Courier */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-black text-xs">
                  PT
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Pathao Courier Integration</h3>
                  <p className="text-[11px] text-slate-400">courier.pathao.com B2B Consignment API</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                <input
                  type="checkbox"
                  checked={settings.pathao.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pathao: { ...settings.pathao, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className={settings.pathao.enabled ? "text-emerald-400" : "text-slate-400"}>
                  {settings.pathao.enabled ? "Active" : "Disabled"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Client ID</label>
                <input
                  type="text"
                  value={settings.pathao.clientId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pathao: { ...settings.pathao, clientId: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Client Secret</label>
                <input
                  type="password"
                  value={settings.pathao.clientSecret}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pathao: { ...settings.pathao, clientSecret: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Store / Warehouse ID</label>
                <input
                  type="text"
                  value={settings.pathao.storeId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pathao: { ...settings.pathao, storeId: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* 3. RedX */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 border border-red-600/30 flex items-center justify-center font-black text-xs">
                  RX
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">RedX Logistics Integration</h3>
                  <p className="text-[11px] text-slate-400">openapi.redx.com.bd API</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                <input
                  type="checkbox"
                  checked={settings.redx.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      redx: { ...settings.redx, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className={settings.redx.enabled ? "text-emerald-400" : "text-slate-400"}>
                  {settings.redx.enabled ? "Active" : "Disabled"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">API Key</label>
                <input
                  type="text"
                  value={settings.redx.apiKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      redx: { ...settings.redx, apiKey: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Base Endpoint</label>
                <input
                  type="text"
                  value={settings.redx.baseUrl}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      redx: { ...settings.redx, baseUrl: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Consignment Bookings Tab */
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Booking Date</th>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Courier Partner</th>
                  <th className="py-3 px-4">Consignment ID</th>
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">COD Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-bold text-amber-400 font-mono">{b.orderNumber}</td>
                    <td className="py-3 px-4 font-bold text-white">{b.courierName}</td>
                    <td className="py-3 px-4 font-mono text-blue-400">{b.consignmentId}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{b.trackingCode}</td>
                    <td className="py-3 px-4">
                      <div className="text-white font-bold">{b.customerName}</div>
                      <div className="text-[10px] text-slate-400">{b.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">৳{b.codAmount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      No consignments booked yet. Use the 1-Click Courier Booking button from any order!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
