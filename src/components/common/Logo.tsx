import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";

interface LogoProps {
  className?: string;
  isWhite?: boolean;
}

export default function Logo({ className = "", isWhite = false }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 select-none group ${className}`}>
      {/* Tactical Stencil Shield / Chevron Badge */}
      <div className="relative flex items-center justify-center w-8 h-8">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 transition-transform duration-300 group-hover:scale-105"
        >
          <path
            d="M18 3L4 9V17C4 24.5 10 31.5 18 33C26 31.5 32 24.5 32 17V9L18 3Z"
            fill={isWhite ? "#ffffff" : "#000000"}
          />
          <path
            d="M18 7.5L8 12V17C8 22.5 12.5 27.5 18 29C23.5 27.5 28 22.5 28 17V12L18 7.5Z"
            fill={isWhite ? "#000000" : "#ffffff"}
          />
          <path
            d="M18 11.5L12 18H15.5L18 15.5L20.5 18H24L18 11.5Z"
            fill={isWhite ? "#ffffff" : "#000000"}
          />
          <path
            d="M18 17L13.5 22H16.5L18 20.5L19.5 22H22.5L18 17Z"
            fill={isWhite ? "#ffffff" : "#000000"}
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col tracking-tighter leading-none">
        <span
          className={`font-black text-xl md:text-2xl uppercase tracking-[0.15em] font-sans ${
            isWhite ? "text-white" : "text-black"
          }`}
          style={{ letterSpacing: "0.18em" }}
        >
          {BRAND.name}
        </span>
        <span
          className={`text-[9px] font-bold tracking-[0.35em] uppercase ${
            isWhite ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          CLOTHING BD
        </span>
      </div>
    </Link>
  );
}
