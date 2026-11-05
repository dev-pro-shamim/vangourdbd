"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PROMO_BANNERS } from "@/data/banners";
import { ArrowRight } from "lucide-react";

interface BannerGridSectionProps {
  customBanners?: Array<{
    id: string | number;
    title: string;
    subtitle?: string;
    image: string;
    link: string;
    badge?: string;
  }>;
}

export default function BannerGridSection({ customBanners }: BannerGridSectionProps = {}) {
  const banners = customBanners && customBanners.length > 0 ? customBanners : PROMO_BANNERS;

  const fallbackImages = [
    "/assets/banner/OxByZ1785564423-1726x1854.jpg",
    "/assets/banner/lbx2U1780402785-dark-1915x709.jpg",
    "/assets/banner/wfNI31785564455-1726x1854.jpg",
  ];

  return (
    <section className="py-12 md:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((banner, idx) => {
            const fallback = fallbackImages[idx % fallbackImages.length];
            return (
              <BannerCard
                key={banner.id || idx}
                banner={banner}
                fallbackImage={fallback}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BannerCard({ banner, fallbackImage }: { banner: any; fallbackImage: string }) {
  const [imgSrc, setImgSrc] = useState(banner.image || fallbackImage);

  React.useEffect(() => {
    setImgSrc(banner.image || fallbackImage);
  }, [banner.image, fallbackImage]);

  return (
    <Link
      href={banner.link || "/shop"}
      className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 shadow-md hover:shadow-xl transition-all duration-300 block"
    >
      <img
        src={imgSrc}
        alt={banner.title}
        onError={() => {
          if (imgSrc !== fallbackImage) {
            setImgSrc(fallbackImage);
          }
        }}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-300 mb-1">
          Featured Category
        </span>
        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-snug">
          {banner.title}
        </h3>
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:text-amber-400 transition-colors">
          <span>Explore Now</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
