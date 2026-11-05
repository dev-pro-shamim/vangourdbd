"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Save, Check, Plus, Trash2, Phone, Send, MessageCircle } from "lucide-react";
import { FloatingContactSettings, FloatingContactButton } from "@/types/cms";

export default function AdminFloatingWidgetsPage() {
  const [settings, setSettings] = useState<FloatingContactSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/api/floating-contact")
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
      const res = await fetch("/api/floating-contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Floating contact widgets updated successfully.");
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddButton = () => {
    if (!settings) return;
    const newBtn: FloatingContactButton = {
      id: `btn-${Date.now()}`,
      type: "whatsapp",
      label: "Customer Support",
      value: "8801700000000",
      color: "#25D366",
      icon: "message-circle",
      enabled: true,
      showOnDesktop: true,
      showOnMobile: true,
    };
    setSettings({ ...settings, buttons: [...settings.buttons, newBtn] });
  };

  const handleRemoveButton = (idx: number) => {
    if (!settings) return;
    const updated = [...settings.buttons];
    updated.splice(idx, 1);
    setSettings({ ...settings, buttons: updated });
  };

  if (!settings) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Floating Contact Widgets...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="text-emerald-400" size={26} />
            Floating Contact Widgets Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Display floating WhatsApp, Direct Call, and Messenger buttons on the public storefront.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition disabled:opacity-50"
        >
          <Save size={15} />
          <span>{isSaving ? "Saving..." : "Save Widgets"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* General Floating Settings */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-sm">Floating Widget Master Switch</h3>
          <p className="text-xs text-slate-400">Turn floating contact widget dock on or off globally.</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={settings.position}
            onChange={(e: any) => setSettings({ ...settings, position: e.target.value })}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="bottom-right">Bottom Right Dock</option>
            <option value="bottom-left">Bottom Left Dock</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
            <input
              type="checkbox"
              checked={settings.isEnabled}
              onChange={(e) => setSettings({ ...settings, isEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600"
            />
            <span className={settings.isEnabled ? "text-emerald-400" : "text-slate-400"}>
              {settings.isEnabled ? "Active" : "Disabled"}
            </span>
          </label>
        </div>
      </div>

      {/* Buttons List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Active Contact Buttons</h3>
          <button
            type="button"
            onClick={handleAddButton}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700"
          >
            <Plus size={14} /> Add Button
          </button>
        </div>

        <div className="space-y-3">
          {settings.buttons.map((btn, idx) => (
            <div key={btn.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: btn.color }}
                  />
                  <input
                    type="text"
                    value={btn.label}
                    onChange={(e) => {
                      const updated = [...settings.buttons];
                      updated[idx].label = e.target.value;
                      setSettings({ ...settings, buttons: updated });
                    }}
                    className="font-bold text-white text-sm bg-transparent border-b border-transparent hover:border-slate-700 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={btn.enabled}
                      onChange={(e) => {
                        const updated = [...settings.buttons];
                        updated[idx].enabled = e.target.checked;
                        setSettings({ ...settings, buttons: updated });
                      }}
                      className="w-3.5 h-3.5 rounded text-emerald-600"
                    />
                    <span>Enabled</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveButton(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Widget Type</label>
                  <select
                    value={btn.type}
                    onChange={(e: any) => {
                      const updated = [...settings.buttons];
                      updated[idx].type = e.target.value;
                      if (e.target.value === "whatsapp") updated[idx].color = "#25D366";
                      else if (e.target.value === "call") updated[idx].color = "#111111";
                      else if (e.target.value === "messenger") updated[idx].color = "#0084FF";
                      setSettings({ ...settings, buttons: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="call">Phone Call</option>
                    <option value="messenger">Facebook Messenger</option>
                    <option value="livechat">Live Chat</option>
                    <option value="custom">Custom Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Phone / URL</label>
                  <input
                    type="text"
                    value={btn.value}
                    onChange={(e) => {
                      const updated = [...settings.buttons];
                      updated[idx].value = e.target.value;
                      setSettings({ ...settings, buttons: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Badge Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={btn.color}
                      onChange={(e) => {
                        const updated = [...settings.buttons];
                        updated[idx].color = e.target.value;
                        setSettings({ ...settings, buttons: updated });
                      }}
                      className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={btn.color}
                      onChange={(e) => {
                        const updated = [...settings.buttons];
                        updated[idx].color = e.target.value;
                        setSettings({ ...settings, buttons: updated });
                      }}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
