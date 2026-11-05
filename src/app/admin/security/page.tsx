"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Plus, Trash2, ShieldCheck, AlertTriangle, RefreshCw, X } from "lucide-react";
import { BlockedIP, SecurityLog } from "@/types/cms";

export default function AdminSecurityPage() {
  const [blockedIps, setBlockedIps] = useState<BlockedIP[]>([]);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [newIp, setNewIp] = useState("");
  const [newReason, setNewReason] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/security");
      const data = await res.json();
      if (data.success) {
        setBlockedIps(data.data.blockedIps);
        setLogs(data.data.logs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp || !newReason) return;
    setIsBlocking(true);
    try {
      const res = await fetch("/api/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "block", ip: newIp, reason: newReason }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setNewIp("");
        setNewReason("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblock = async (ip: string) => {
    if (!confirm(`Unblock IP address ${ip}?`)) return;
    try {
      const res = await fetch("/api/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unblock", ip }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="text-rose-400" size={26} />
            Security, Bot & Fraud Protection
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Defend storefront checkout against automated scraping bots, card testing scripts, and malicious IP addresses.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition"
        >
          <Plus size={16} />
          <span>Block Malicious IP</span>
        </button>
      </div>

      {/* Blocked IPs Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Active Blocked IP List ({blockedIps.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Blocked IP Address</th>
                <th className="py-3 px-4">Reason / Rule Triggered</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Date Added</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {blockedIps.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-rose-400">{b.ip}</td>
                  <td className="py-3 px-4 text-slate-300">{b.reason}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                      {b.isManual ? "Manual Admin" : "Auto Shield"}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleUnblock(b.ip)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Security Event Logs */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-bold text-white text-sm">Recent Storefront Traffic & Security Logs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Triggered Event</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{log.ip}</td>
                  <td className="py-3 px-4 text-white font-medium">{log.action}</td>
                  <td className="py-3 px-4 font-mono font-bold">
                    <span className={log.riskScore > 50 ? "text-rose-400" : "text-emerald-400"}>
                      {log.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === "BLOCKED"
                          ? "bg-rose-500/20 text-rose-400"
                          : log.status === "FLAGGED"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block IP Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add IP to Blocklist</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleBlockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">IPv4 / IPv6 Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 185.220.101.45"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Blocking</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automated checkout bot attack"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBlocking}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-md transition disabled:opacity-50"
                >
                  {isBlocking ? "Blocking..." : "Block IP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
