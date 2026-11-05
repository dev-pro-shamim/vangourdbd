"use client";

import React from "react";
import { Section } from "@/types/cms";
import HeroSection from "@/components/home/HeroSection";
import CategoryCollectionSection from "@/components/home/CategoryCollectionSection";
import ProductSliderSection from "@/components/home/ProductSliderSection";
import VideoBannerSection from "@/components/home/VideoBannerSection";
import BannerGridSection from "@/components/home/BannerGridSection";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import BentoGridSection from "@/components/home/BentoGridSection";
import FeatureGridSection from "@/components/home/FeatureGridSection";
import Link from "next/link";

interface SectionRendererProps {
  section: Section;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  if (!section.isEnabled) return null;

  const styleOverrides: React.CSSProperties = {
    backgroundColor: section.styles?.bgColor || undefined,
    color: section.styles?.textColor || undefined,
    paddingTop: section.styles?.paddingTop || undefined,
    paddingBottom: section.styles?.paddingBottom || undefined,
    marginTop: section.styles?.marginTop || undefined,
    marginBottom: section.styles?.marginBottom || undefined,
  };

  const renderContent = () => {
    switch (section.type) {
      case "hero_slider":
        return <HeroSection customSlides={section.data?.slides} />;

      case "category_collection":
        return (
          <CategoryCollectionSection
            customTitle={section.title}
            customEyebrow={section.eyebrow}
          />
        );

      case "product_carousel":
        return (
          <ProductSliderSection
            title={section.title || "Featured Products"}
            categorySlug={section.data?.categorySlug || "Best-selling-Half-Shirts-2"}
          />
        );

      case "video_banner":
        return (
          <VideoBannerSection
            customTitle={section.title}
            customSubtitle={section.subtitle}
            customEyebrow={section.eyebrow}
            discountBadge={section.data?.discountBadge}
            buttonText={section.data?.buttonText}
            buttonLink={section.data?.buttonLink}
          />
        );

      case "banner_grid":
        return <BannerGridSection customBanners={section.data?.banners} />;

      case "new_arrivals":
        return (
          <NewArrivalsSection
            customTitle={section.title}
            customCategories={section.data?.categories}
          />
        );

      case "bento_grid":
        return (
          <BentoGridSection
            customTitle={section.title}
            customEyebrow={section.eyebrow}
            customItems={section.data?.bentoItems}
          />
        );

      case "feature_grid":
        return <FeatureGridSection customFeatures={section.data?.features} />;

      case "custom_html":
      case "rich_text":
        return (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
            {section.title && (
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4 tracking-tight">
                {section.title}
              </h2>
            )}
            <div
              className="prose max-w-none text-neutral-700"
              dangerouslySetInnerHTML={{ __html: section.data?.htmlContent || section.content || "" }}
            />
          </div>
        );

      case "image_banner":
        return (
          <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6">
            <Link
              href={section.data?.buttonLink || "/shop"}
              className="block relative rounded-2xl overflow-hidden shadow-sm group"
            >
              <img
                src={section.data?.posterImage || "/assets/banner/lbx2U1780402785-dark-1915x709.jpg"}
                alt={section.title || "Banner"}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-102"
              />
              {section.title && (
                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-6 text-white">
                  <h3 className="text-2xl sm:text-4xl font-black mb-2">{section.title}</h3>
                  {section.subtitle && <p className="text-sm sm:text-base">{section.subtitle}</p>}
                </div>
              )}
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styleOverrides} className={section.styles?.customClass || ""}>
      {renderContent()}
    </div>
  );
}
