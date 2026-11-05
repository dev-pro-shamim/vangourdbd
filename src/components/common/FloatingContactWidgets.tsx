"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Phone, Send, MessageSquare, ExternalLink, X } from "lucide-react";
import { FloatingContactSettings, FloatingContactButton } from "@/types/cms";

export default function FloatingContactWidgets() {
  const [settings, setSettings] = useState<FloatingContactSettings | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/floating-contact")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSettings(d.data);
      })
      .catch(() => {});
  }, []);

  if (!settings || !settings.isEnabled) return null;

  const enabledButtons = settings.buttons.filter((b) => b.enabled);
  if (enabledButtons.length === 0) return null;

  const isBottomRight = settings.position === "bottom-right";

  const renderIcon = (type: string) => {
    switch (type) {
      case "whatsapp":
        return <MessageCircle size={20} />;
      case "call":
        return <Phone size={18} />;
      case "messenger":
        return <Send size={18} />;
      default:
        return <MessageSquare size={18} />;
    }
  };

  const getHref = (btn: FloatingContactButton) => {
    if (btn.type === "whatsapp") {
      const clean = btn.value.replace(/[^0-9]/g, "");
      return `https://wa.me/${clean}`;
    }
    if (btn.type === "call") {
      return `tel:${btn.value}`;
    }
    return btn.value.startsWith("http") ? btn.value : `https://${btn.value}`;
  };

  return (
    <div
      className={`fixed z-40 flex flex-col items-end gap-2.5 transition-all duration-300 ${
        isBottomRight ? "bottom-20 sm:bottom-6 right-4 sm:right-6" : "bottom-20 sm:bottom-6 left-4 sm:left-6 items-start"
      }`}
    >
      {/* Expanded Button Options */}
      {isOpen && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {enabledButtons.map((btn) => (
            <a
              key={btn.id}
              href={getHref(btn)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-white shadow-xl font-bold text-xs transition transform hover:scale-105 active:scale-95 ${
                btn.showOnDesktop ? "flex" : "hidden sm:hidden"
              } ${btn.showOnMobile ? "flex" : "hidden sm:flex"}`}
              style={{ backgroundColor: btn.color || "#111111" }}
            >
              {renderIcon(btn.type)}
              <span className="whitespace-nowrap">{btn.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-neutral-900 text-white border-2 border-white/20 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition"
        style={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
        }}
        title="Contact Customer Support"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={26} className="text-emerald-400" />}
      </button>
    </div>
  );
}
