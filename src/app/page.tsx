"use client";

import React from "react";
import { useCMS } from "@/context/CMSContext";
import SectionRenderer from "@/components/cms/SectionRenderer";

export default function HomePage() {
  const { sections } = useCMS();

  const homeSections = sections
    .filter((s) => s.pageSlug === "home" && s.isEnabled)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen bg-transparent transition-colors">
      {homeSections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}
