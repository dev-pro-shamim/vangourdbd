"use client";

import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { ChevronRight } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function TermsOfServicePage() {
  const { pages, settings } = useCMS();
  const pageData = pages.find(
    (p) => p.slug === "terms/of/services" || p.slug === "/terms/of/services" || p.id === "page-terms"
  );

  const phone = settings?.contact?.phone || BRAND.phoneDisplay;
  const email = settings?.contact?.email || BRAND.email;

  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-[1000px] mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">
            {pageData?.title || "Terms of Services"}
          </span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900 mb-6 pb-4 border-b border-neutral-200">
          {pageData?.title || "Terms of Services"}
        </h1>

        <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
          {pageData?.content ? (
            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
              <div className="whitespace-pre-line leading-relaxed text-neutral-800 text-sm">
                {pageData.content}
              </div>
              <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500">
                Questions about the Terms of Service should be sent to us at{" "}
                <strong className="text-black">{email}</strong> or by phone at{" "}
                <strong className="text-black">{phone}</strong>.
              </div>
            </div>
          ) : (
            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
              <h3 className="text-base font-black uppercase text-neutral-900">
                1. General Overview & Agreement
              </h3>
              <p>
                Welcome to {settings?.siteName || BRAND.fullName}. Throughout the site, the terms "we", "us", and "our" refer to {settings?.siteName || BRAND.fullName}. By accessing our website, purchasing products, or engaging our services, you agree to be bound by these Terms of Service, including any additional policies referenced herein.
              </p>

              <h3 className="text-base font-black uppercase text-neutral-900 pt-2">
                2. Accuracy of Billing and Account Information
              </h3>
              <p>
                We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we will attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
              </p>

              <h3 className="text-base font-black uppercase text-neutral-900 pt-2">
                3. Products, Pricing & Availability
              </h3>
              <p>
                Prices for our products are subject to change without prior notice. We reserve the right at any time to modify or discontinue any product or service without notice. All descriptions of products or product pricing are subject to change at any time at our sole discretion.
              </p>

              <h3 className="text-base font-black uppercase text-neutral-900 pt-2">
                4. Contact Information
              </h3>
              <p>
                Questions about the Terms of Service should be sent to us at{" "}
                <strong>{email}</strong> or by phone at <strong>{phone}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
