import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface BentoGridSectionProps {
  customTitle?: string;
  customEyebrow?: string;
  customItems?: Array<{
    id: string | number;
    title: string;
    subtitle: string;
    image: string;
    link: string;
    size?: string;
  }>;
}

export default function BentoGridSection({
  customTitle = "Are You a Sporty Person!",
  customEyebrow = "Athletic & Tactical",
  customItems,
}: BentoGridSectionProps = {}) {
  return (
    <section className="py-12 md:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        {/* Section Heading */}
        <div className="text-center mb-8 md:mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 block mb-1">
            Athletic & Tactical
          </span>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900">
            Are You a Sporty Person!
          </h2>
          <div className="w-10 h-0.5 bg-black mx-auto mt-3" />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Bento Item 1 (Tall Left) */}
          <Link
            href="/category/vest"
            className="group relative md:row-span-2 aspect-[4/5] md:aspect-auto rounded-2xl overflow-hidden bg-neutral-900 shadow-md block"
          >
            <img
              src="/assets/banner/Dsr1I1785564499-2001x2069.jpg"
              alt="Activewear & Vests"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300">
                Performance Gear
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-1">
                Activewear & Vests
              </h3>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white group-hover:text-amber-400">
                Shop Vests <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Bento Item 2 (Wide Top Right) */}
          <Link
            href="/category/shorts"
            className="group relative md:col-span-2 aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-900 shadow-md block"
          >
            <img
              src="/assets/banner/gZMsL1785584381-2002x1037.jpg"
              alt="Tactical Shorts"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300">
                Utility Comfort
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-1">
                Tactical & Inner Shorts
              </h3>
              <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white group-hover:text-amber-400">
                Explore Shorts <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Bento Item 3 (Bottom Mid) */}
          <Link
            href="/category/cap"
            className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 shadow-md block"
          >
            <img
              src="/assets/banner/R6slD1785564518-2001x2069.jpg"
              alt="Signature Caps"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="text-lg font-black uppercase tracking-tight">
                Signature Caps
              </h3>
              <div className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white group-hover:text-amber-400">
                View Caps <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Bento Item 4 (Bottom Right) */}
          <Link
            href="/category/JOGGERS"
            className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 shadow-md block"
          >
            <img
              src="/assets/banner/nrmQW1785571630-1726x1854.jpg"
              alt="Urban Movement"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="text-lg font-black uppercase tracking-tight">
                Urban Joggers
              </h3>
              <div className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white group-hover:text-amber-400">
                View Joggers <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
