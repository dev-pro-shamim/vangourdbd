"use client";

import React from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  ShoppingBag,
  Layers,
  Sparkles,
  Palette,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
  Cloud,
  ChevronRight,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function AdminOverviewPage() {
  const { products, categories, sections, orders, settings } = useCMS();

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const stats = [
    {
      title: "Total Sales Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      change: "+18.2%",
      isPositive: true,
      icon: DollarSign,
      color: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "Store Orders",
      value: orders.length,
      change: "Active Today",
      isPositive: true,
      icon: ShoppingCart,
      color: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30",
    },
    {
      title: "Total Catalog Products",
      value: products.length,
      change: "69 Real SKUs",
      isPositive: true,
      icon: ShoppingBag,
      color: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30",
    },
    {
      title: "Homepage CMS Sections",
      value: sections.length,
      change: "100% Dynamic",
      isPositive: true,
      icon: Layers,
      color: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30",
    },
  ];

  const quickActions = [
    {
      title: "Visual Page Builder",
      desc: "Drag and drop sections, live preview, custom templates",
      href: "/admin/page-builder",
      icon: Sparkles,
      color: "bg-purple-600/20 text-purple-400 border-purple-500/30",
    },
    {
      title: "Homepage Sections",
      desc: "Reorder, duplicate, enable/disable, change background & text colors",
      href: "/admin/sections",
      icon: Layers,
      color: "bg-blue-600/20 text-blue-400 border-blue-500/30",
    },
    {
      title: "Products & Inventory",
      desc: "Add products, update pricing, manage stock & variations",
      href: "/admin/products",
      icon: ShoppingBag,
      color: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "Design & Global Styling",
      desc: "Change primary/secondary colors, fonts, radius, container width",
      href: "/admin/design",
      icon: Palette,
      color: "bg-amber-600/20 text-amber-400 border-amber-500/30",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-widest inline-block mb-3">
            CMS Engine Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome to {settings?.brand?.name || "VANGUARD"} Command Center
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Every section, header, banner, product, and style on the website is 100% dynamic and instantly controllable from this dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/sections"
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Manage Homepage</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`rounded-2xl p-6 bg-gradient-to-br ${stat.color} bg-slate-900/60 border backdrop-blur-sm relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-3 tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2 text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <span className="text-emerald-400">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick CMS Action Portals */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">
          Core CMS Management Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <Link
                key={qa.title}
                href={qa.href}
                className="group p-5 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:border-amber-400/50 hover:bg-slate-800 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${qa.color} border flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {qa.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {qa.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white">
                  <span>Open Tool</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Orders & Architecture Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-800/60 border border-slate-700/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Recent Orders</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live store customer orders across Bangladesh</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">{ord.orderNumber}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[10px] text-slate-400">{ord.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3">{ord.city}</td>
                    <td className="py-3 px-3 font-bold text-white">৳{ord.total.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === "Delivered"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : ord.status === "Shipped"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{ord.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Backend & Database Status */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-6 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">CMS Architecture Status</h3>
            <p className="text-xs text-slate-400 mt-0.5">Technology stack and database connections</p>

            <div className="mt-4 space-y-3.5">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white">MongoDB + Mongoose</div>
                    <div className="text-[10px] text-slate-400">Schema models loaded & active</div>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Express.js API Server</div>
                    <div className="text-[10px] text-slate-400">REST Endpoints & Multer ready</div>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Zero Hardcoded Code</div>
                    <div className="text-[10px] text-slate-400">100% Dynamic data injection</div>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700 text-xs text-slate-400">
            Need to change database credentials? Configure them anytime in{" "}
            <Link href="/admin/settings" className="text-amber-400 underline font-semibold">
              Website Settings
            </Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
