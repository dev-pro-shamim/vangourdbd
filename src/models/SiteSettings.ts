import mongoose, { Schema, Document, Model } from "mongoose";
import { SiteSettings as ISiteSettings } from "@/types/cms";

export interface SiteSettingsDocument extends Document, ISiteSettings {}

const SiteSettingsSchema = new Schema(
  {
    brand: {
      name: { type: String, default: "VANGUARD" },
      tagline: { type: String, default: "EXPLORE YOUR FASHION" },
      logoUrl: { type: String, default: "" },
      logoWidth: { type: Number, default: 44 },
      logoHeight: { type: Number, default: 44 },
      faviconUrl: { type: String, default: "" },
    },
    colors: {
      primary: { type: String, default: "#111111" },
      secondary: { type: String, default: "#d4145a" },
      background: { type: String, default: "#faf9f6" },
      title: { type: String, default: "#222831" },
      paragraph: { type: String, default: "#252a34" },
      border: { type: String, default: "#cccccc" },
      alert: { type: String, default: "#ff1818" },
      success: { type: String, default: "#34be82" },
      warning: { type: String, default: "#f8b400" },
    },
    typography: {
      fontFamily: { type: String, default: "Open Sans, sans-serif" },
      headingFont: { type: String, default: "Open Sans, sans-serif" },
      bodyFont: { type: String, default: "Open Sans, sans-serif" },
      baseFontSize: { type: Number, default: 14 },
    },
    layout: {
      containerWidth: { type: Number, default: 1440 },
      borderRadius: { type: String, default: "16px" },
      sectionSpacing: { type: String, default: "48px" },
    },
    announcement: {
      isEnabled: { type: booleanSchema(), default: false },
      text: { type: String, default: "⚡ Free shipping on all orders over ৳3,000 across Bangladesh!" },
      link: { type: String, default: "/shop" },
      bgColor: { type: String, default: "#111111" },
      textColor: { type: String, default: "#ffffff" },
    },
    header: {
      isSticky: { type: booleanSchema(), default: true },
      showSearch: { type: booleanSchema(), default: true },
      showCart: { type: booleanSchema(), default: true },
      showLogin: { type: booleanSchema(), default: true },
      bgColor: { type: String, default: "#ffffff" },
      textColor: { type: String, default: "#111111" },
    },
    footer: {
      description: {
        type: String,
        default:
          "VANGUARD BD brings you modern utility, timeless denim, tailored aesthetics, and performance activewear crafted for the daring individual.",
      },
      copyrightText: { type: String, default: "© 2026 VANGUARD BD. All rights reserved." },
      watermarkText: { type: String, default: "VANGUARD BD" },
      bgColor: { type: String, default: "#111111" },
      textColor: { type: String, default: "#ffffff" },
      showNewsletter: { type: booleanSchema(), default: true },
    },
    contact: {
      phone: { type: String, default: "+880 1756-096104" },
      whatsapp: { type: String, default: "+8801756096104" },
      email: { type: String, default: "support@vanguardbd.com" },
      address: { type: String, default: "House 12, Road 4, Sector 3, Uttara, Dhaka-1230, Bangladesh" },
      hours: { type: String, default: "Saturday - Thursday: 10:00 AM - 9:00 PM" },
    },
    social: {
      facebook: { type: String, default: "https://facebook.com" },
      instagram: { type: String, default: "https://instagram.com" },
      youtube: { type: String, default: "https://youtube.com" },
      tiktok: { type: String, default: "https://tiktok.com" },
    },
    shipping: {
      insideDhaka: { type: Number, default: 70 },
      outsideDhaka: { type: Number, default: 130 },
      freeShippingThreshold: { type: Number, default: 3000 },
      currency: { type: String, default: "৳" },
    },
    seo: {
      metaTitle: { type: String, default: "VANGUARD BD - High-End Lifestyle & Fashion Store" },
      metaDescription: {
        type: String,
        default:
          "Explore the latest collection of premium shirts, polo, denim, joggers, tactical outerwear, and accessories in Bangladesh.",
      },
      canonicalUrl: { type: String, default: "https://vanguardbd.com" },
      ogImage: { type: String, default: "/assets/banner/VuASK1790148496-light-4348x1613.jpeg" },
      keywords: { type: String, default: "fashion, bangladesh, shirts, denim, clothing, apparel, men fashion" },
    },
  },
  { timestamps: true }
);

function booleanSchema() {
  return Boolean;
}

export const SiteSettingsModel: Model<SiteSettingsDocument> =
  mongoose.models.SiteSettings || mongoose.model<SiteSettingsDocument>("SiteSettings", SiteSettingsSchema);
