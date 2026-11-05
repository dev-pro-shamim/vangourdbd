"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, MessageSquare } from "lucide-react";
import { BRAND } from "@/config/brand";

export default function FloatingCartButton() {
  const { cartCount, cartTotal, setIsCartOpen } = useApp();

  return (
    <>
      {/* Right Edge Sticky Cart Tab (matching original site) */}
      <div className="hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="bg-[#111111] hover:bg-black text-white px-3.5 py-3 rounded-l-xl shadow-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:pl-4 border-l border-t border-b border-neutral-700"
          aria-label="Sticky cart widget"
        >
          <ShoppingBag className="w-5 h-5 text-white" />
          <span className="text-[11px] font-bold tracking-tight">
            {cartCount} Items
          </span>
          <span className="text-[11px] font-bold text-neutral-300">
            BDT{cartTotal.toLocaleString()}.00
          </span>
        </button>
      </div>

      {/* Floating Bottom-Right WhatsApp / Chat Widget */}
      <div className="fixed right-5 bottom-20 lg:bottom-6 z-40">
        <a
          href={BRAND.social.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#111111] hover:bg-black text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-neutral-700"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-5 h-5 fill-white text-transparent" />
        </a>
      </div>
    </>
  );
}
