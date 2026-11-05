"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, HelpCircle } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { pages } = useCMS();
  const pageData = pages.find(
    (p) => p.slug === "faq" || p.slug === "/faq" || p.id === "page-faq"
  );

  const defaultFaqs = [
    {
      q: "What is your return & exchange policy?",
      a: "We have a flexible return policy. If you need a size exchange or receive a defective item, you may request an exchange within 3 days of delivery. The item must be returned within 7 days in its original condition with tags intact."
    },
    {
      q: "What are your shipping options and delivery times?",
      a: "We deliver nationwide across Bangladesh. For Inside Dhaka, delivery takes 24 to 48 hours (৳70). For Outside Dhaka, delivery takes 3 to 5 business days (৳130). Free delivery is available on orders above ৳2,000."
    },
    {
      q: "How long does it take to process and dispatch an order?",
      a: "Orders are typically verified by our team within 12-24 hours via phone call. Once confirmed, they are packed and handed over to our courier partner immediately."
    },
    {
      q: "What payment methods do you accept?",
      a: "We offer Cash on Delivery (COD) everywhere in Bangladesh, as well as digital payments through bKash, Nagad, Rocket, and major debit/credit cards."
    },
    {
      q: "How can I choose the right size?",
      a: "Every product page features an interactive Size Guide with detailed measurements for Chest, Length, and Shoulder across M, L, XL, and XXL sizes. If you are between sizes, we recommend sizing up for an oversized streetwear look."
    },
    {
      q: "How do I track my shipment?",
      a: "You can track your order status in real time by visiting our 'Track Your Order' page and entering your phone number or Order ID."
    }
  ];

  const parsedFaqs = useMemo(() => {
    if (!pageData?.content || pageData.content.trim().length === 0) {
      return defaultFaqs;
    }

    // Try to parse Q: ... A: ... blocks
    const lines = pageData.content.split("\n\n");
    const dynamicList: { q: string; a: string }[] = [];

    for (const block of lines) {
      const qMatch = block.match(/Q:\s*(.+)/i);
      const aMatch = block.match(/A:\s*([\s\S]+)/i);
      if (qMatch && aMatch) {
        dynamicList.push({
          q: qMatch[1].trim(),
          a: aMatch[1].trim(),
        });
      }
    }

    if (dynamicList.length > 0) {
      return dynamicList;
    }

    // If not matching Q:/A:, just return default or single block
    return defaultFaqs;
  }, [pageData?.content]);

  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-[900px] mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">
            {pageData?.title || "FAQs"}
          </span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900 mb-2">
          {pageData?.title || "Frequently Asked Questions"}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mb-8 pb-4 border-b border-neutral-200">
          Find fast answers to common questions regarding ordering, sizing, delivery, and payments.
        </p>

        {pageData?.content && !pageData.content.includes("Q:") && (
          <div className="mb-6 p-6 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
            {pageData.content}
          </div>
        )}

        <div className="space-y-4">
          {parsedFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-neutral-200 rounded-2xl overflow-hidden transition-all duration-200 hover:border-neutral-400"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left bg-neutral-50 hover:bg-neutral-100/80 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-neutral-900 flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 text-xs sm:text-sm text-neutral-600 leading-relaxed bg-white border-t border-neutral-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
