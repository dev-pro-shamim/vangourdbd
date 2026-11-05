import React from "react";
import { Truck, ShieldCheck, Clock, Headphones } from "lucide-react";

interface FeatureGridSectionProps {
  customFeatures?: Array<{
    num: string;
    title: string;
    description?: string;
    desc?: string;
    icon?: string;
  }>;
}

export default function FeatureGridSection({ customFeatures }: FeatureGridSectionProps = {}) {
  const defaultFeatures = [
    {
      num: "01",
      icon: Truck,
      title: "FREE SHIPPING",
      desc: "On all eligible orders with no hidden fees — smooth delivery every time."
    },
    {
      num: "02",
      icon: ShieldCheck,
      title: "SECURE PAYMENTS",
      desc: "Fully protected checkout via trusted payment gateways. Always safe."
    },
    {
      num: "03",
      icon: Clock,
      title: "FAST DELIVERY",
      desc: "Your favourite styles dispatched and delivered without the wait."
    },
    {
      num: "04",
      icon: Headphones,
      title: "24/7 SUPPORT",
      desc: "Our team is always on hand — anytime, any day, any question."
    }
  ];

  const features = customFeatures && customFeatures.length > 0
    ? customFeatures.map((f, i) => ({
        num: f.num || `0${i + 1}`,
        icon: [Truck, ShieldCheck, Clock, Headphones][i % 4],
        title: f.title,
        desc: f.description || f.desc || "",
      }))
    : defaultFeatures;

  return (
    <section className="bg-[#f9f8f5] border-t border-b border-[#e5e3de] py-0">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#e5e3de]">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.num}
                className="relative p-6 sm:p-8 lg:p-10 overflow-hidden flex flex-col justify-between"
              >
                {/* Background Large Number */}
                <span
                  className="absolute top-0 right-2 text-7xl sm:text-8xl font-black text-black/[0.04] select-none pointer-events-none leading-none"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {feat.num}
                </span>

                <div>
                  <div className="mb-4 text-black">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="w-7 h-0.5 bg-black mb-3" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-neutral-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed max-w-xs">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
