"use client";

import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { ChevronRight, RotateCcw } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function ReturnPolicyPage() {
  const { pages, settings } = useCMS();
  const pageData = pages.find(
    (p) => p.slug === "return/policy" || p.slug === "/return/policy" || p.id === "page-return"
  );

  const phone = settings?.contact?.phone || BRAND.phoneDisplay;
  const siteName = settings?.siteName || BRAND.fullName;

  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-[1000px] mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">
            {pageData?.title || "Return & Exchange"}
          </span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900 mb-6 pb-4 border-b border-neutral-200">
          {pageData?.title || "Return & Exchange Policy"}
        </h1>

        <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
          {pageData?.content ? (
            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
              <div className="whitespace-pre-line leading-relaxed text-neutral-800 text-sm">
                {pageData.content}
              </div>
              <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500">
                To request an exchange or report any defect, please contact our support team at{" "}
                <strong className="text-black">{phone}</strong>.
              </div>
            </div>
          ) : (
            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
              <h3 className="text-base font-black uppercase text-neutral-900 tracking-wide flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-black" /> Return & Exchange Terms
              </h3>

              <ul className="space-y-3 list-disc pl-5">
                <li>
                  When a client receives a product and delivery is complete, he/she has <strong>3 days</strong> to request a size exchange and inform our customer service team about any defects or blemishes on the item.
                </li>
                <li>
                  The item must be returned to <strong>{siteName} CUSTOMER SERVICE TEAM</strong> within <strong>7 days</strong> of delivery with original tags intact and unworn condition.
                </li>
                <li>
                  Upon consideration by our team, we will inform the customer regarding whether the request for size exchange, damaged product replacement, or return is approved.
                </li>
                <li>
                  If you receive a faulty or damaged item from {siteName}, it will be issued as online credit or direct replacement, allowing you to choose a product in the same price range.
                </li>
                <li>
                  If product quality is compromised or fabric defects occur within 7 days of delivery, the customer must immediately notify our support team at <strong>{phone}</strong>.
                </li>
                <li>
                  Every exchange or return issue must be finalized within a <strong>10-day duration</strong> from the date of initial delivery. After that period, no party will be able to place any claim.
                </li>
                <li>
                  Every client is strongly encouraged to perform a <strong>spot inspection</strong> before taking final delivery and making payment to our courier partner.
                </li>
                <li>
                  <strong>Discounted / Flash Sale items:</strong> Items purchased under clearance or flash sale discounts are not eligible for exchange or return unless a severe manufacturer defect is present.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
