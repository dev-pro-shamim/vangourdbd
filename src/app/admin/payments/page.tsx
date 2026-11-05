"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Save, Check, RefreshCw } from "lucide-react";
import { PaymentGatewaySettings } from "@/types/cms";

export default function AdminPaymentsPage() {
  const [settings, setSettings] = useState<PaymentGatewaySettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/api/payments/settings")
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
      const res = await fetch("/api/payments/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Payment gateway settings saved successfully.");
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Payment Gateways...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="text-emerald-400" size={26} />
            Payment Gateway Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Configure Bangladesh mobile banking (bKash, Nagad, Rocket, Upay), COD, Bank Transfer, and SSLCommerz.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition disabled:opacity-50"
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

      {/* 1. Cash on Delivery (COD) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              COD
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Cash on Delivery (COD)</h3>
              <p className="text-[11px] text-slate-400">Customer pays cash upon delivery</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
            <input
              type="checkbox"
              checked={settings.cod.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cod: { ...settings.cod, enabled: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-emerald-600"
            />
            <span className={settings.cod.enabled ? "text-emerald-400" : "text-slate-400"}>
              {settings.cod.enabled ? "Active" : "Disabled"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Extra COD Processing Fee (BDT)</label>
            <input
              type="number"
              value={settings.cod.extraCharge}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cod: { ...settings.cod, extraCharge: Number(e.target.value) },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Instructions</label>
            <input
              type="text"
              value={settings.cod.instructions || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cod: { ...settings.cod, instructions: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 2. bKash Gateway */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold text-xs">
              bK
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">bKash Payment Gateway</h3>
              <p className="text-[11px] text-slate-400">Merchant Tokenized Checkout API</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
            <input
              type="checkbox"
              checked={settings.bkash.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  bkash: { ...settings.bkash, enabled: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-pink-600"
            />
            <span className={settings.bkash.enabled ? "text-emerald-400" : "text-slate-400"}>
              {settings.bkash.enabled ? "Active" : "Disabled"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">App Key</label>
            <input
              type="text"
              value={settings.bkash.appKey}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  bkash: { ...settings.bkash, appKey: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">App Secret</label>
            <input
              type="password"
              value={settings.bkash.appSecret}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  bkash: { ...settings.bkash, appSecret: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Nagad Gateway */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold text-xs">
              NG
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Nagad Payment Gateway</h3>
              <p className="text-[11px] text-slate-400">Post-paid and instant checkout</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
            <input
              type="checkbox"
              checked={settings.nagad.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  nagad: { ...settings.nagad, enabled: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-orange-600"
            />
            <span className={settings.nagad.enabled ? "text-emerald-400" : "text-slate-400"}>
              {settings.nagad.enabled ? "Active" : "Disabled"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Merchant ID</label>
            <input
              type="text"
              value={settings.nagad.merchantId}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  nagad: { ...settings.nagad, merchantId: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Merchant Public Key</label>
            <input
              type="text"
              value={settings.nagad.publicKey}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  nagad: { ...settings.nagad, publicKey: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Bank Transfer */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
              BANK
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Direct Bank Wire / BEFTN</h3>
              <p className="text-[11px] text-slate-400">Corporate and manual bank transfers</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
            <input
              type="checkbox"
              checked={settings.bankTransfer.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  bankTransfer: { ...settings.bankTransfer, enabled: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-blue-600"
            />
            <span className={settings.bankTransfer.enabled ? "text-emerald-400" : "text-slate-400"}>
              {settings.bankTransfer.enabled ? "Active" : "Disabled"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bank Name</label>
            <input
              type="text"
              value={settings.bankTransfer.bankName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  bankTransfer: { ...settings.bankTransfer, bankName: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Account Name</label>
            <input
              type="text"
              value={settings.bankTransfer.accountName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  bankTransfer: { ...settings.bankTransfer, accountName: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Account Number</label>
            <input
              type="text"
              value={settings.bankTransfer.accountNumber}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  bankTransfer: { ...settings.bankTransfer, accountNumber: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
