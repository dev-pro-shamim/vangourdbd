"use client";

import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { ChevronRight } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function PrivacyPolicyPage() {
  const { pages, settings } = useCMS();
  const pageData = pages.find(
    (p) => p.slug === "privacy/policy" || p.slug === "/privacy/policy" || p.id === "page-privacy"
  );

  const phone = settings?.contact?.phone || BRAND.phoneDisplay;
  const email = settings?.contact?.email || BRAND.email;
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
            {pageData?.title || "Privacy Policy"}
          </span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900 mb-6 pb-4 border-b border-neutral-200">
          {pageData?.title || "Privacy Policy"}
        </h1>

        <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
          {pageData?.content ? (
            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
              <div className="whitespace-pre-line leading-relaxed text-neutral-800 text-sm">
                {pageData.content}
              </div>
              <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500">
                If you have any questions about this Privacy Policy, please contact us by email at{" "}
                <strong className="text-black">{email}</strong> or call{" "}
                <strong className="text-black">{phone}</strong>.
              </div>
            </div>
          ) : (
            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
              <p className="text-xs text-neutral-500 font-medium">Effective date: November 2026</p>
              <p>
                {siteName} ("us", "we", or "our") operates the e-commerce store. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>

              <h3 className="text-base font-black uppercase text-neutral-900 pt-2">
                Information Collection And Use
              </h3>
              <p>
                We collect several different types of information for various purposes to provide and improve our services to you, including:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Full customer name</li>
                <li>Phone number & alternative contact numbers</li>
                <li>Shipping address, City, District</li>
                <li>Email address</li>
                <li>Order history and communication logs</li>
              </ul>

              <h3 className="text-base font-black uppercase text-neutral-900 pt-2">
                Security of Data
              </h3>
              <p>
                The security of your personal data is paramount to us. We implement industry-standard encryption, SSL protocols, and secure verification systems to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h3 className="text-base font-black uppercase text-neutral-900 pt-2">
                Questions & Contact
              </h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us by email at{" "}
                <strong>{email}</strong> or call <strong>{phone}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
