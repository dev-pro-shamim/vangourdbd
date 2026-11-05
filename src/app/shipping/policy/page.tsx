"use client";

import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { ChevronRight, Truck, ShieldCheck } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function ShippingPolicyPage() {
  const { pages, settings } = useCMS();
  const pageData = pages.find(
    (p) => p.slug === "shipping/policy" || p.slug === "/shipping/policy" || p.id === "page-shipping"
  );

  const phone = settings?.contact?.phone || BRAND.phoneDisplay;
  const insideShipping = settings?.shipping?.insideDhakaFee || 70;
  const outsideShipping = settings?.shipping?.outsideDhakaFee || 130;
  const freeShippingMin = settings?.shipping?.freeShippingMinAmount || 3000;

  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-[1000px] mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">
            {pageData?.title || "Shipping Policy"}
          </span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900 mb-6 pb-4 border-b border-neutral-200">
          {pageData?.title || "Shipping & Delivery Policy"}
        </h1>

        <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
          {pageData?.content ? (
            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
              <div className="whitespace-pre-line leading-relaxed text-neutral-800 text-sm">
                {pageData.content}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <div className="p-4 bg-white rounded-xl border border-neutral-200">
                  <span className="font-bold text-black block mb-1">Inside Dhaka:</span>
                  <span className="text-neutral-600">Delivery in 24 - 48 hours. Shipping charge ৳{insideShipping}.</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-neutral-200">
                  <span className="font-bold text-black block mb-1">Outside Dhaka:</span>
                  <span className="text-neutral-600">Delivery in 48 - 72 hours. Shipping charge ৳{outsideShipping}.</span>
                </div>
              </div>
              <p className="text-xs text-neutral-500">
                * Free nationwide shipping applies to orders above ৳{freeShippingMin}.
              </p>
            </div>
          ) : (
            <>
              <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <h3 className="text-base font-black uppercase text-neutral-900 tracking-wide flex items-center gap-2">
                  <Truck className="w-5 h-5 text-black" /> Delivery Information
                </h3>
                <p>
                  For nationwide orders, we deliver across all 64 districts in Bangladesh through trusted courier partners including SteadFast Courier, Pathao Courier, and RedX.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-xl border border-neutral-200">
                    <span className="font-bold text-black block mb-1">Inside Dhaka:</span>
                    <span className="text-neutral-600">Delivery within 24 - 48 business hours. Shipping charge ৳{insideShipping}.</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-neutral-200">
                    <span className="font-bold text-black block mb-1">Outside Dhaka:</span>
                    <span className="text-neutral-600">Delivery within 2 - 4 business days. Shipping charge ৳{outsideShipping}.</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500">
                  * Free shipping automatically applies on any cart total exceeding ৳{freeShippingMin}.
                </p>
              </div>

              <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <h3 className="text-base font-black uppercase text-neutral-900 tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-black" /> Cash On Delivery (COD) Policies
                </h3>
                <p>
                  You can place an order directly on the website and enter your full shipping address during checkout. We provide nationwide cash-on-delivery services.
                </p>
                <p>
                  After you place an order, our dispatch representative will call you within 24 hours to confirm your order details. Alternatively, you can also confirm the order yourself by calling us directly at <strong>{phone}</strong>.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
