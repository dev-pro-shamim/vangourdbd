"use client";

import React, { useState } from "react";
import { Users, Search, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function AdminCustomersPage() {
  const { orders } = useCMS();
  const [searchQuery, setSearchQuery] = useState("");

  // Derive unique customers from orders
  const customersMap = new Map();
  orders.forEach((o) => {
    if (!customersMap.has(o.customerPhone)) {
      customersMap.set(o.customerPhone, {
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail || "Not provided",
        address: o.address,
        city: o.city,
        totalOrders: 1,
        totalSpend: o.total,
        lastOrder: o.createdAt,
      });
    } else {
      const existing = customersMap.get(o.customerPhone);
      existing.totalOrders += 1;
      existing.totalSpend += o.total;
    }
  });

  const customers = Array.from(customersMap.values()).filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-400" />
            Customer Profiles & CRM
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered customer contact information, delivery locations, and aggregate lifetime orders.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone or city..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
        <div className="text-xs text-slate-400 font-semibold">
          Total Customers: <b className="text-white">{customers.length}</b>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">City / Address</th>
              <th className="py-3 px-4">Total Orders</th>
              <th className="py-3 px-4">Lifetime Spend</th>
              <th className="py-3 px-4">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-slate-300">
            {customers.map((c, i) => (
              <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-amber-400 font-bold flex items-center justify-center text-xs">
                    {c.name.charAt(0)}
                  </div>
                  <span>{c.name}</span>
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-amber-300">{c.phone}</td>
                <td className="py-3 px-4">
                  <div>{c.city}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{c.address}</div>
                </td>
                <td className="py-3 px-4 font-mono">{c.totalOrders} order(s)</td>
                <td className="py-3 px-4 font-bold text-white">৳{c.totalSpend.toLocaleString()}</td>
                <td className="py-3 px-4 text-slate-400">
                  {new Date(c.lastOrder).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
