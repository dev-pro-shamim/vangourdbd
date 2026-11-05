"use client";

import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { useCMS } from "@/context/CMSContext";
import { BRAND } from "@/config/brand";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const { settings, menus } = useCMS();

  const brandName = settings?.brand?.name || BRAND.name;
  const footerDesc = settings?.footer?.description || "The premium fashion and lifestyle brand engineered for high utility, unmatched durability, and modern urban aesthetics.";
  const phone = settings?.contact?.phone || BRAND.phone;
  const email = settings?.contact?.email || BRAND.email;
  const address = settings?.contact?.address || BRAND.address;
  const copyright = settings?.footer?.copyrightText || `© 2026 ${brandName} BD. All rights reserved.`;
  const watermark = settings?.footer?.watermarkText || `${brandName} BD`;

  const companyMenu = menus.find((m) => m.location === "footer_company");
  const policiesMenu = menus.find((m) => m.location === "footer_policies");
  const quickMenu = menus.find((m) => m.location === "footer_quick");

  return (
    <footer
      className="footer style-5 relative text-white pt-16 pb-24 md:pb-12 overflow-hidden border-t border-neutral-800"
      style={{ backgroundColor: settings?.footer?.bgColor || "#0a0a0a" }}
    >
      {/* Giant faint background watermark */}
      <div
        className="footer-big-name absolute left-1/2 -translate-x-1/2 top-4 text-[12vw] font-black uppercase text-white/[0.03] select-none pointer-events-none tracking-widest whitespace-nowrap"
        aria-hidden="true"
      >
        {watermark}
      </div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-neutral-800">
          {/* Left Panel: Brand info + contact info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <Logo isWhite />
              <p className="mt-4 text-neutral-400 text-sm max-w-sm leading-relaxed">
                {footerDesc}
              </p>
            </div>

            <div className="space-y-3 text-sm text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                aria-label="Facebook"
              >
                <span className="font-bold text-xs">FB</span>
              </a>
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                aria-label="Instagram"
              >
                <span className="font-bold text-xs">IG</span>
              </a>
              <a
                href={BRAND.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                aria-label="YouTube"
              >
                <span className="font-bold text-xs">YT</span>
              </a>
              <a
                href={BRAND.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                aria-label="WhatsApp"
              >
                <span className="font-bold text-xs">WA</span>
              </a>
            </div>

            <div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-wider rounded-md hover:bg-neutral-200 transition-colors"
              >
                CONTACT US <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Panel: Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Company Column */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-5">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms/of/services" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy/policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/shipping/policy" className="hover:text-white transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/return/policy" className="hover:text-white transition-colors">
                    Return & Refund
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Accounts Column */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-5">
                Accounts
              </h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/my/orders" className="hover:text-white transition-colors">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link href="/my/wishlists" className="hover:text-white transition-colors">
                    My Wishlist
                  </Link>
                </li>
                <li>
                  <Link href="/track/order" className="hover:text-white transition-colors">
                    Order Tracking
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-white transition-colors">
                    Cart View
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories Column */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-5">
                Categories
              </h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li>
                  <Link href="/category/polo-shirt" className="hover:text-white transition-colors">
                    Polo Shirts
                  </Link>
                </li>
                <li>
                  <Link href="/category/denim" className="hover:text-white transition-colors">
                    Denim Jeans
                  </Link>
                </li>
                <li>
                  <Link href="/category/half-shirts" className="hover:text-white transition-colors">
                    Half Sleeve Shirts
                  </Link>
                </li>
                <li>
                  <Link href="/category/T-Shirt" className="hover:text-white transition-colors">
                    T-Shirts
                  </Link>
                </li>
                <li>
                  <Link href="/category/shorts" className="hover:text-white transition-colors">
                    Cargo Shorts
                  </Link>
                </li>
                <li>
                  <Link href="/category/Winter-Collection" className="hover:text-white transition-colors">
                    Winter Drops
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-5">
                Customer Care
              </h4>
              <div className="space-y-3 text-sm text-neutral-400">
                <p className="text-xs text-neutral-500">Available: Sat - Thu (10am - 8pm)</p>
                <p className="font-bold text-white text-base">{phone}</p>
                <p className="text-xs text-neutral-400">Fast delivery across 64 districts in Bangladesh</p>
                <div className="pt-2">
                  <div className="flex flex-wrap gap-2 text-[10px] text-neutral-400">
                    <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">bKash</span>
                    <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">Nagad</span>
                    <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">COD</span>
                    <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">VISA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>{copyright}</p>
          <p>
            Designed & Developed by{" "}
            <a href="https://getcommerce.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
              Getcommerce
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
