"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useCMS } from "@/context/CMSContext";
import { BRAND } from "@/config/brand";
import { Search, ShoppingBag, User, Menu, X, ChevronRight } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const { cartCount, setIsCartOpen, setIsSearchOpen, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const { settings, menus } = useCMS();

  const defaultNavItems = [
    { label: "Flash Sale", href: "/category/Flash-Sale", isHighlight: true },
    { label: "New Collection", href: "/category/New-Arrivals" },
    { label: "New Arrivals", href: "/category/New-Arrivals" },
    { label: "Men", href: "/category/Men" },
    { label: "Women's Wear", href: "/category/Woman's-Wear" },
    { label: "Pant Section", href: "/category/pant" },
    { label: "Oversized", href: "/category/signature-tees" },
    { label: "Accessories", href: "/category/cap" },
    { label: "Blazer", href: "/category/Jacket" },
    { label: "Activewear", href: "/category/activewear" },
    { label: "Legend Series", href: "/category/Legend-T-Shirt" },
    { label: "Winter Collection", href: "/category/Winter-Collection" },
  ];

  const headerMenu = menus.find((m) => m.location === "header_main");
  const navMenuItems = headerMenu?.items && headerMenu.items.length > 0 ? headerMenu.items : defaultNavItems;

  const brandName = settings?.brand?.name || BRAND.name;

  return (
    <>
      {/* Dynamic Announcement Bar */}
      {settings?.announcement?.isEnabled && (
        <div
          className="text-xs py-2 px-4 text-center font-bold tracking-wide transition-colors"
          style={{
            backgroundColor: settings.announcement.bgColor || "#111111",
            color: settings.announcement.textColor || "#ffffff",
          }}
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2">
            <span>{settings.announcement.text}</span>
            {settings.announcement.link && (
              <Link href={settings.announcement.link} className="underline hover:opacity-80 ml-1">
                Shop Now
              </Link>
            )}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-transparent transition-all duration-200 pt-2 sm:pt-3 pb-2 px-3 sm:px-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Main Rounded Navigation Card */}
          <div
            className="rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-neutral-200/70 px-4 sm:px-8 py-2.5 sm:py-3.5 transition-all"
            style={{ backgroundColor: settings?.header?.bgColor || "#ffffff" }}
          >
            {/* Top Tier: Left Company Name | Center Logo Emblem | Right Search, Cart, Login */}
            <div className="flex items-center justify-between lg:grid lg:grid-cols-3 min-h-[44px]">
              {/* Left Column: Brand Name (Desktop) / Hamburger Toggle (Mobile) */}
              <div className="flex items-center justify-start">
                {/* Mobile Menu Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-1.5 -ml-1 text-neutral-800 hover:text-black focus:outline-none cursor-pointer"
                  aria-label="Toggle navigation"
                >
                  <Menu className="w-6 h-6 stroke-[2]" />
                </button>

                {/* Company Name (Desktop) */}
                <Link
                  href="/"
                  className="hidden lg:inline-block font-sans font-bold text-[17px] tracking-[0.22em] text-[#111111] uppercase hover:opacity-80 transition-opacity select-none"
                  style={{ letterSpacing: "0.22em" }}
                >
                  {brandName}BD <span className="text-[11px] font-normal align-super">®</span>
                </Link>
              </div>

              {/* Center Column: Replaced Brand Logo Emblem */}
              <div className="flex flex-col items-center justify-center">
                <Link href="/" className="inline-flex flex-col items-center justify-center group" aria-label="Home">
                  {settings?.brand?.logoUrl ? (
                    <img
                      src={settings.brand.logoUrl}
                      alt={brandName}
                      style={{
                        width: settings.brand.logoWidth || 44,
                        height: settings.brand.logoHeight || 44,
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    /* Tactical Emblem Badge replacing original Commando helmet */
                    <svg
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-9 h-9 sm:w-11 sm:h-11 transition-transform duration-300 group-hover:scale-105"
                    >
                      <path
                        d="M50 8C27 8 10 24 8 47C20 48 35 44 50 44C65 44 80 48 92 47C90 24 73 8 50 8Z"
                        fill="#111111"
                      />
                      <polygon
                        points="50,15 53.5,23.5 62.5,23.5 55,29 58,37.5 50,32 42,37.5 45,29 37.5,23.5 46.5,23.5"
                        fill="#ffffff"
                      />
                      <path
                        d="M5 49C22 51 36 47 50 47C64 47 78 51 95 49C94 51 91 53 87 54C75 52 63 50 50 50C37 50 25 52 13 54C9 53 6 51 5 49Z"
                        fill="#111111"
                      />
                      <path
                        d="M10 56H45L49 61H51L55 56H90V67C85 71 70 71 54 64L50 62L46 64C30 71 15 71 10 67V56Z"
                        fill="#111111"
                      />
                      <rect x="28" y="72" width="10" height="20" rx="2" fill="#111111" />
                      <rect x="45" y="72" width="10" height="24" rx="2" fill="#111111" />
                      <rect x="62" y="72" width="10" height="20" rx="2" fill="#111111" />
                    </svg>
                  )}
                  {/* Small Mobile Brand Name below logo matching original CommandoBD */}
                  <span className="lg:hidden text-[9px] font-black uppercase tracking-[0.25em] text-[#111111] mt-0.5">
                    {brandName}BD
                  </span>
                </Link>
              </div>

              {/* Right Column: Search, Cart ( 0 ), Login (Hidden on Mobile) */}
              <div className="hidden lg:flex items-center justify-end gap-6">
                {/* Search Button */}
                {settings?.header?.showSearch !== false && (
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="p-1.5 text-neutral-800 hover:text-black cursor-pointer transition-opacity"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5 stroke-[2]" />
                  </button>
                )}

                {/* Cart Button */}
                {settings?.header?.showCart !== false && (
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="inline-flex items-center gap-2 text-neutral-900 hover:opacity-80 transition-opacity cursor-pointer font-sans"
                    aria-label="Cart"
                  >
                    <ShoppingBag className="w-5 h-5 stroke-[2]" />
                    <span className="text-[15px] font-semibold">
                      Cart&nbsp;(&nbsp;{cartCount}&nbsp;)
                    </span>
                  </button>
                )}

                {/* Login Pill Button */}
                {settings?.header?.showLogin !== false && (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-5 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>

              {/* Mobile Right Spacer for symmetry */}
              <div className="w-6 lg:hidden" />
            </div>

            {/* Bottom Tier: Centered Navigation Links (Desktop Only) */}
            <nav className="hidden lg:flex items-center justify-center pt-3 mt-3 border-t border-neutral-100">
              <ul className="flex items-center justify-center gap-6 xl:gap-8 flex-wrap text-[13px] font-semibold text-neutral-800">
                {navMenuItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`py-1 transition-colors hover:text-black hover:underline underline-offset-4 ${
                        item.isHighlight
                          ? "text-[#111111] font-bold"
                          : "text-neutral-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <span className="font-bold text-base tracking-widest uppercase">
                {BRAND.name}BD
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-700"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 divide-y divide-neutral-100 text-sm">
              <div className="px-4 py-2 space-y-1">
                {navMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 font-semibold text-neutral-800 hover:text-black"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                ))}
              </div>

              <div className="px-4 py-4 space-y-2.5 text-xs font-medium text-neutral-600">
                <Link
                  href="/track/order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-black"
                >
                  Track Your Order
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-black"
                >
                  Contact Us
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-black"
                >
                  FAQs
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-black"
                >
                  Sign In / Register
                </Link>
              </div>
            </div>

            <div className="p-4 bg-neutral-900 text-white text-xs">
              <p className="font-bold">Hotline: {BRAND.phoneDisplay}</p>
              <p className="text-neutral-400 text-[11px] mt-0.5">Delivery all over Bangladesh</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
