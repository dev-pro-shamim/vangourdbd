"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@vanguardbd.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check if already logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vanguard_admin_auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          router.replace("/admin");
        }
      }
    } catch {
      // ignore
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/rbac/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid email or password. Please try again.");
      }

      // Store auth session
      const authData = {
        token: data.token,
        user: data.user,
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem("vanguard_admin_auth", JSON.stringify(authData));
      document.cookie = `vanguard_admin_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

      setSuccessMessage(`Welcome back, ${data.user?.name || "Admin"}! Redirecting...`);

      setTimeout(() => {
        window.location.href = "/admin";
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to log in. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: "super" | "orders" | "inventory") => {
    if (role === "super") {
      setEmail("admin@vanguardbd.com");
      setPassword("admin123");
    } else if (role === "orders") {
      setEmail("orders@vanguardbd.com");
      setPassword("admin123");
    } else {
      setEmail("warehouse@vanguardbd.com");
      setPassword("admin123");
    }
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-[#070a12] flex items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Card */}
        <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/20 mb-2">
              <ShieldCheck size={28} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                Vanguard BD <span className="text-amber-400">Admin</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Enterprise E-Commerce & CMS Management Portal
              </p>
            </div>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vanguardbd.com"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              One-Click Credentials (Auto Fill)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("super")}
                className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-amber-400 transition text-center"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("orders")}
                className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-slate-300 transition text-center"
              >
                Orders
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("inventory")}
                className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-slate-300 transition text-center"
              >
                Inventory
              </button>
            </div>
          </div>

          {/* Footer Back Link */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs text-slate-500 hover:text-slate-300 transition font-medium"
            >
              ← Return to Main Storefront
            </a>
          </div>
        </div>

        {/* Security watermark */}
        <p className="text-[11px] text-slate-600 text-center mt-6 font-mono">
          Vanguard BD Enterprise Security • 256-Bit SSL Encrypted
        </p>
      </div>
    </div>
  );
}
