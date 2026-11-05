"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSectionProps {
  customSlides?: Array<{
    id: string | number;
    desktopImage: string;
    mobileImage: string;
    buttonLink?: string;
    buttonText?: string;
    link?: string;
    title?: string;
    subtitle?: string;
    hasBrandOverlay?: boolean;
    isEnabled?: boolean;
  }>;
}

export default function HeroSection({ customSlides }: HeroSectionProps = {}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultHeroSlides = [
    {
      id: "slide-1",
      desktopImage: "/assets/banner/VuASK1790148496-light-4348x1613.jpeg",
      mobileImage: "/assets/banner/M93eh1790150699-light-1686x1800.jpg",
      link: "/category/New-Arrivals",
      title: "VANGUARD TACTICAL DROP",
      subtitle: "EXPLORE YOUR FASHION",
      buttonText: "Shop Collection",
      hasBrandOverlay: false,
    },
    {
      id: "slide-2",
      desktopImage: "/assets/banner/TAPFJ1784980888-dark-4348x1613.jpeg",
      mobileImage: "/assets/banner/21vgD1784981320-dark-1101x1321.jpeg",
      link: "/category/Best-selling-Half-Shirts-2",
      title: "Best Selling Half Shirts",
      subtitle: "Premium lightweight summer fabrics",
      buttonText: "Explore Shirts",
      hasBrandOverlay: false,
    },
    {
      id: "slide-3",
      desktopImage: "/assets/banner/lbx2U1780402785-dark-1915x709.jpg",
      mobileImage: "/assets/banner/nMofP1790167547-light-1500x2100.jpg",
      link: "/category/denim",
      title: "Signature Denim 2026",
      subtitle: "Bring your denim back to life",
      buttonText: "Discover Denim",
      hasBrandOverlay: false,
    },
  ];

  const activeSlides = (customSlides && customSlides.length > 0)
    ? customSlides.filter((s) => s.isEnabled !== false)
    : defaultHeroSlides;
  const heroSlides = activeSlides.length > 0 ? activeSlides : defaultHeroSlides;

  const defaultDesktop = "/assets/banner/VuASK1790148496-light-4348x1613.jpeg";
  const defaultMobile = "/assets/banner/M93eh1790150699-light-1686x1800.jpg";

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section className="pt-2 sm:pt-4 pb-8 px-3 sm:px-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Banner Carousel Card */}
        <div className="group relative w-full aspect-[4/5] sm:aspect-[16/7] md:aspect-[21/8] min-h-[460px] sm:min-h-[340px] max-h-[640px] rounded-[24px] overflow-hidden bg-neutral-100 shadow-sm">
          {heroSlides.map((slide, index) => {
            const isCurrent = index === currentSlide;
            const targetLink = slide.link || slide.buttonLink || "/category/New-Arrivals";

            return (
              <div
                key={slide.id || index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Link href={targetLink} className="block w-full h-full relative cursor-pointer">
                  {/* Desktop Banner Image */}
                  <img
                    src={slide.desktopImage || defaultDesktop}
                    alt={slide.title || "Campaign banner"}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== defaultDesktop) {
                        target.src = defaultDesktop;
                      }
                    }}
                    className="hidden sm:block w-full h-full object-cover object-center"
                  />

                  {/* Mobile Banner Image */}
                  <img
                    src={slide.mobileImage || defaultMobile}
                    alt={slide.title || "Campaign mobile banner"}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== defaultMobile) {
                        target.src = defaultMobile;
                      }
                    }}
                    className="sm:hidden w-full h-full object-cover object-center"
                  />

                  {/* Optional Brand Badge Overlay (Non-blocking) */}
                  {slide.hasBrandOverlay && (
                    <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20 bg-black/60 backdrop-blur-md text-white px-4 py-2 sm:px-6 sm:py-3 rounded-2xl border border-white/20 shadow-lg">
                      <span className="text-sm sm:text-lg font-black uppercase tracking-[0.2em] block">
                        {BRAND.name}
                      </span>
                      <span className="text-[10px] sm:text-xs text-neutral-300 font-medium tracking-wider">
                        EXPLORE YOUR FASHION
                      </span>
                    </div>
                  )}

                  {/* Optional Slide Content (Title, Subtitle, CTA Button) */}
                  {(slide.title || slide.buttonText) && !slide.hasBrandOverlay && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-12 text-white">
                      {slide.subtitle && (
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400 mb-1">
                          {slide.subtitle}
                        </span>
                      )}
                      {slide.title && (
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4 max-w-xl">
                          {slide.title}
                        </h2>
                      )}
                      {slide.buttonText && (
                        <div>
                          <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg hover:bg-neutral-200 transition-colors">
                            {slide.buttonText}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              </div>
            );
          })}

          {/* Previous / Next Arrow Controls */}
          {heroSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous banner"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-black backdrop-blur-xs flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next banner"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-black backdrop-blur-xs flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {heroSlides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
              {heroSlides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentSlide(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    dotIdx === currentSlide
                      ? "w-8 bg-black shadow-sm"
                      : "w-2 bg-neutral-300/80 hover:bg-neutral-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
