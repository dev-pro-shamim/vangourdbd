"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/common/Logo";
import { BRAND } from "@/config/brand";
import { Lock, Mail, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-neutral-100 min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center border-b border-neutral-100 bg-neutral-50 flex flex-col items-center">
          <Logo />
          <p className="text-xs text-neutral-500 mt-3 font-medium">
            Welcome to {BRAND.fullName}. Access your orders & profile.
          </p>

          {/* Tab Switcher */}
          <div className="flex w-full bg-neutral-200/70 p-1 rounded-xl mt-6">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setSubmitted(false);
              }}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                !isRegister ? "bg-white text-black shadow-sm" : "text-neutral-600 hover:text-black"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setSubmitted(false);
              }}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                isRegister ? "bg-white text-black shadow-sm" : "text-neutral-600 hover:text-black"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h3 className="font-bold text-neutral-900 text-base">
                {isRegister ? "Account Created!" : "Welcome Back!"}
              </h3>
              <p className="text-xs text-neutral-500">
                You are now signed in to {BRAND.name}.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase rounded-lg"
              >
                Go to Homepage <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {isRegister && (
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Phone Number or Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="017xxxxxxxx or you@example.com"
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-neutral-800">Password</label>
                  {!isRegister && (
                    <a href="#" className="text-neutral-500 hover:text-black text-[11px] underline">
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full p-3 pr-10 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-neutral-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-md mt-2 cursor-pointer"
              >
                {isRegister ? "Create Account" : "Sign In"}
              </button>

              <div className="text-center pt-4 text-[11px] text-neutral-500">
                By continuing, you agree to our{" "}
                <Link href="/terms/of/services" className="underline hover:text-black">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy/policy" className="underline hover:text-black">
                  Privacy Policy
                </Link>
                .
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
