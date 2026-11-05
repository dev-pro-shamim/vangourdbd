"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Phone,
  RefreshCw,
  History,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { FraudCheckResult } from "@/types/cms";

export default function AdminFraudCheckerPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<FraudCheckResult | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/fraud-checker?phone=${encodeURIComponent(phoneNumber)}`);
      const data = await res.json();
      if (data.success) {
        setReport(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="text-amber-400" size={26} />
          Customer Phone Fraud & Risk Analyzer
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Evaluate customer delivery success ratios, past parcel cancellation rates, and automated return risk scores.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              required
              placeholder="Enter Bangladesh Mobile Number (e.g. 01711002233)..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !phoneNumber}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 shrink-0"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
            <span>Analyze Customer</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] text-slate-400">
          <span>Quick test numbers:</span>
          {["01711002233 (VIP)", "01819556677 (Active)", "01300000000 (Blocked Bot)"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPhoneNumber(num.split(" ")[0])}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] transition"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Results Display */}
      {report && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl animate-in fade-in">
          {/* Top Risk Indicator */}
          <div
            className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
              report.riskScore === "High Risk"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                : report.riskScore === "Medium Risk"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}
          >
            <div className="flex items-center gap-3.5">
              {report.riskScore === "High Risk" ? (
                <XCircle size={36} className="shrink-0" />
              ) : report.riskScore === "Medium Risk" ? (
                <AlertTriangle size={36} className="shrink-0" />
              ) : (
                <CheckCircle2 size={36} className="shrink-0" />
              )}
              <div>
                <div className="text-xs uppercase font-extrabold tracking-wider opacity-80">Fraud Risk Classification</div>
                <div className="text-2xl font-black">{report.riskScore}</div>
                <div className="text-xs opacity-90 mt-0.5 font-mono">Mobile: {report.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-current/20 pt-3 sm:pt-0 sm:pl-6">
              <div>
                <div className="text-[11px] opacity-80">Delivery Rate</div>
                <div className="text-2xl font-mono font-black">{report.deliverySuccessRate}%</div>
              </div>
              <div>
                <div className="text-[11px] opacity-80">Cancel / Return</div>
                <div className="text-2xl font-mono font-black">{report.cancellationRate}%</div>
              </div>
            </div>
          </div>

          {/* Metrics Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Total Store Orders</div>
              <div className="text-xl font-bold text-white mt-1 font-mono">{report.totalOrders}</div>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-emerald-400">Delivered Orders</div>
              <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{report.deliveredOrders}</div>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-amber-400">Cancelled Pre-Dispatch</div>
              <div className="text-xl font-bold text-amber-400 mt-1 font-mono">{report.cancelledOrders}</div>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-rose-400">Doorstep Returns</div>
              <div className="text-xl font-bold text-rose-400 mt-1 font-mono">{report.returnedOrders}</div>
            </div>
          </div>

          {/* Analysis Reasons */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">Evaluation Audit Reasons</h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {report.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Courier Cross-Network Signals */}
          {report.externalCourierReport && (
            <div className="bg-blue-950/20 border border-blue-900/40 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-blue-400 font-bold">
                <span>National Courier Aggregated History (Steadfast / Pathao / RedX Network)</span>
                <span className="text-[10px] font-mono">Simulated Multi-Courier API</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-slate-300">
                <div>Total Parcels: <strong>{report.externalCourierReport.totalParcels}</strong></div>
                <div>Successful: <strong className="text-emerald-400">{report.externalCourierReport.successParcels}</strong></div>
                <div>Returned: <strong className="text-rose-400">{report.externalCourierReport.cancelledParcels}</strong></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
