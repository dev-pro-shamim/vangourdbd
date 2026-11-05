"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Pause } from "lucide-react";

interface VideoBannerSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customEyebrow?: string;
  discountBadge?: string;
  buttonText?: string;
  buttonLink?: string;
  posterImage?: string;
}

export default function VideoBannerSection({
  customTitle = "Best Fashion Store Available to Everyone!",
  customSubtitle,
  customEyebrow = "Up to 25% Off Sale",
  discountBadge,
  buttonText = "Shop Collection",
  buttonLink = "/shop",
  posterImage = "/assets/banner/TAPFJ1784980888-dark-4348x1613.jpeg",
}: VideoBannerSectionProps = {}) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-neutral-900 shadow-xl">
          {/* Background Poster / Video Preview */}
          <img
            src={posterImage}
            alt="Best Fashion Store"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white z-10 space-y-3 sm:space-y-4">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-amber-400 bg-black/50 px-3.5 py-1 rounded backdrop-blur-xs">
              {discountBadge || customEyebrow}
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight max-w-2xl leading-tight">
              {customTitle}
            </h2>

            {customSubtitle && (
              <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
                {customSubtitle}
              </p>
            )}

            <div className="pt-2">
              <Link
                href={buttonLink}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black hover:bg-neutral-200 text-xs sm:text-sm font-black uppercase tracking-widest rounded-lg transition-all shadow-xl hover:scale-105"
              >
                {buttonText}
              </Link>
            </div>
          </div>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </div>
    </section>
  );
}
