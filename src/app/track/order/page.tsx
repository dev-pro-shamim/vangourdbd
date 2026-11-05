"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Search, Package, CheckCircle2, Clock, Truck, MapPin } from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [tracked, setTracked] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim() || phone.trim()) {
      setTracked(true);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-[900px] mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">Track Order</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-neutral-900 text-white p-8 md:p-12 rounded-2xl mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-lg space-y-2">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-black/40 px-3 py-1 rounded">
              Live Order Tracking
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              Track Your Order
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Enter your Order ID or phone number to see real-time updates on your delivery.
            </p>
          </div>
        </div>

        {/* Search Card */}
        <div className="p-6 md:p-8 bg-neutral-50 rounded-2xl border border-neutral-200 mb-8">
          <form onSubmit={handleTrack} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  Order ID / Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. VNG-582910"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 017xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-black hover:bg-neutral-800 text-white font-black uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" /> Track Status
            </button>
          </form>
        </div>

        {/* Tracking Result Timeline */}
        {tracked && (
          <div className="p-6 md:p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-neutral-200 gap-2 text-xs">
              <div>
                <span className="text-neutral-500">Tracking for: </span>
                <strong className="text-black font-mono">{orderId || "VNG-829104"}</strong>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                Out for Delivery
              </span>
            </div>

            {/* Timeline Steps */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              {/* Step 1 */}
              <div className="relative flex items-start gap-4">
                <div className="absolute -left-6 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Order Received & Confirmed</h4>
                  <p className="text-[11px] text-neutral-500">Order verified via telephone confirmation.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-4">
                <div className="absolute -left-6 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Quality Checked & Packed</h4>
                  <p className="text-[11px] text-neutral-500">Security sealed and prepared at central warehouse.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-4">
                <div className="absolute -left-6 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Dispatched via Express Courier</h4>
                  <p className="text-[11px] text-neutral-500">Handed to delivery partner for last-mile shipping.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-4">
                <div className="absolute -left-6 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] animate-pulse">
                  ●
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-700">Out for Delivery Today</h4>
                  <p className="text-[11px] text-neutral-500">Rider will contact your phone before arriving.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
