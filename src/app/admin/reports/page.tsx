"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  Users,
} from "lucide-react";

export default function AdminReportsPage() {
  const [salesReport, setSalesReport] = useState<any>(null);
  const [inventoryReport, setInventoryReport] = useState<any>(null);
  const [courierReport, setCourierReport] = useState<any>(null);

  useEffect(() => {
    fetch("/api/reports?type=sales")
      .then((r) => r.json())
      .then((d) => d.success && setSalesReport(d.data));

    fetch("/api/reports?type=inventory")
      .then((r) => r.json())
      .then((d) => d.success && setInventoryReport(d.data));

    fetch("/api/reports?type=courier")
      .then((r) => r.json())
      .then((d) => d.success && setCourierReport(d.data));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="text-amber-400" size={26} />
            Enterprise Reports & Analytics
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Financial analytics, stock valuation, courier delivery performance, and instant CSV data export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/reports?type=sales&format=csv"
            download
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
          >
            <Download size={14} className="text-emerald-400" />
            <span>Download Sales CSV</span>
          </a>
          <a
            href="/api/reports?type=inventory&format=csv"
            download
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
          >
            <Download size={14} className="text-amber-400" />
            <span>Download Inventory CSV</span>
          </a>
        </div>
      </div>

      {/* Sales Overview Cards */}
      {salesReport && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" /> Revenue & Sales Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Gross Revenue</div>
              <div className="text-2xl font-black text-white mt-1">৳{salesReport.grossRevenue?.toLocaleString()}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Cash on Delivery (COD)</div>
              <div className="text-2xl font-black text-amber-400 mt-1">৳{salesReport.codRevenue?.toLocaleString()}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Digital Prepaid</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">৳{salesReport.onlineRevenue?.toLocaleString()}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Orders</div>
              <div className="text-2xl font-black text-blue-400 mt-1 font-mono">{salesReport.totalOrdersCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory & Logistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inventoryReport && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Package size={16} className="text-amber-400" /> Warehouse Inventory Summary
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">Total Products</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">{inventoryReport.totalProducts}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">Total Units In Stock</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">{inventoryReport.totalUnits}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-amber-400">Low Stock SKUs</div>
                <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">{inventoryReport.lowStock}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-rose-400">Out of Stock SKUs</div>
                <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">{inventoryReport.outOfStock}</div>
              </div>
            </div>
          </div>
        )}

        {courierReport && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Truck size={16} className="text-blue-400" /> Courier Logistics Dispatch
            </h3>
            <div className="grid grid-cols-3 gap-3 text-xs text-center">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">Steadfast</div>
                <div className="text-lg font-bold text-orange-400 font-mono mt-0.5">{courierReport.steadfastBookings}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">Pathao</div>
                <div className="text-lg font-bold text-red-400 font-mono mt-0.5">{courierReport.pathaoBookings}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">RedX</div>
                <div className="text-lg font-bold text-blue-400 font-mono mt-0.5">{courierReport.redxBookings}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
