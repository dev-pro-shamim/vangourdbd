import React from "react";
import Link from "next/link";
import { ChevronRight, Package, ArrowRight } from "lucide-react";

export default function MyOrdersPage() {
  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-[1000px] mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">My Orders</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-8 pb-4 border-b border-neutral-200">
          Order History
        </h1>

        <div className="p-8 md:p-12 bg-neutral-50 rounded-2xl border border-neutral-200 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto text-neutral-500">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-neutral-900 text-base">No orders yet</h3>
          <p className="text-xs text-neutral-500">
            Once you complete an order, your order receipt, tracking details, and shipment progress will appear here.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase rounded-lg hover:bg-neutral-800"
            >
              Start Shopping <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
