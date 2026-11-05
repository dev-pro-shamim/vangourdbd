"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Copy,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Percent,
  Truck,
  Users,
  Clock,
  History,
  X,
  Save,
  AlertCircle,
  Check,
} from "lucide-react";
import { Coupon, DiscountType } from "@/types/cms";
import { useCMS } from "@/context/CMSContext";

export default function AdminCouponsPage() {
  const { products, categories } = useCMS();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCouponUsages, setSelectedCouponUsages] = useState<Coupon | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data || []);
      }
    } catch {
      showToast("Failed to fetch coupons.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenCreate = () => {
    const fresh: Coupon = {
      id: "",
      code: `SAVE${Math.floor(10 + Math.random() * 90)}`,
      description: "Seasonal promotional discount",
      discountType: "percentage",
      discountValue: 15,
      minOrderAmount: 1000,
      maxDiscountAmount: 500,
      usageLimit: 500,
      usageLimitPerCustomer: 1,
      usedCount: 0,
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      applicableProducts: [],
      applicableCategories: [],
      excludedProducts: [],
      excludedCategories: [],
      customerEligibility: "all",
      isFirstOrderOnly: false,
      freeShipping: false,
      status: "active",
      usages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIsNew(true);
    setEditingCoupon(fresh);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    if (!editingCoupon.code.trim()) {
      showToast("Coupon code is required.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const url = isNew ? "/api/coupons" : `/api/coupons/${editingCoupon.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCoupon),
      });

      const data = await res.json();
      if (data.success) {
        showToast(isNew ? `Coupon "${editingCoupon.code}" created!` : `Coupon "${editingCoupon.code}" updated!`);
        setEditingCoupon(null);
        await fetchCoupons();
      } else {
        showToast(data.error || "Failed to save coupon.", "error");
      }
    } catch {
      showToast("An error occurred while saving coupon.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCoupon = async (coupon: Coupon) => {
    if (!confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return;

    try {
      const res = await fetch(`/api/coupons/${coupon.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Coupon "${coupon.code}" deleted.`);
        await fetchCoupons();
      } else {
        showToast(data.error || "Failed to delete coupon.", "error");
      }
    } catch {
      showToast("Error deleting coupon.", "error");
    }
  };

  const handleDuplicate = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon.id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast(`Coupon duplicated as "${data.data.code}"!`);
        await fetchCoupons();
      } else {
        showToast(data.error || "Failed to duplicate coupon.", "error");
      }
    } catch {
      showToast("Error duplicating coupon.", "error");
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    const nextStatus = coupon.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/coupons/${coupon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Coupon "${coupon.code}" marked as ${nextStatus}.`);
        await fetchCoupons();
      }
    } catch {
      showToast("Failed to update coupon status.", "error");
    }
  };

  // Filtered List
  const filteredCoupons = coupons.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (typeFilter !== "all" && c.discountType !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // KPI Calculations
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.status === "active").length;
  const totalUsedCount = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);
  const totalDiscountsGranted = coupons.reduce((sum, c) => {
    const usageSum = c.usages?.reduce((uSum, u) => uSum + (u.discountAmount || 0), 0) || 0;
    return sum + usageSum;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          {notification.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Tag className="text-amber-400" size={26} />
            Coupon & Discount Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Create promotional coupon codes, percentage & flat discounts, free shipping rules, and track customer usage.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition flex items-center gap-2 shrink-0"
        >
          <Plus size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Coupons</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">{totalCoupons}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Configured promo campaigns</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Active Coupons</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{activeCoupons}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Live on storefront checkout</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Times Redeemed</div>
          <div className="text-2xl font-black text-amber-400 mt-1 font-mono">{totalUsedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Total successful redemptions</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Total Discount Given</div>
          <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">৳{totalDiscountsGranted.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Saved by customers</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search coupon code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (৳)</option>
            <option value="free_shipping">Free Shipping</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Type & Value</th>
                <th className="py-3 px-4">Min Order</th>
                <th className="py-3 px-4">Usage Limit</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Tag size={32} className="mx-auto mb-2 text-slate-600 opacity-60" />
                    <p className="font-semibold text-sm text-slate-400">No coupons found.</p>
                    <p className="text-xs text-slate-500 mt-1">Create your first promo code to boost sales.</p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                    {/* Code & Description */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono font-black text-xs tracking-wider">
                          {c.code}
                        </span>
                        {c.isFirstOrderOnly && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            1st Order
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{c.description}</div>
                    </td>

                    {/* Type & Value */}
                    <td className="py-3 px-4 font-semibold">
                      {c.discountType === "percentage" && (
                        <div className="text-white flex items-center gap-1">
                          <Percent size={13} className="text-amber-400" />
                          <span>{c.discountValue}% OFF</span>
                          {c.maxDiscountAmount && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              (Max ৳{c.maxDiscountAmount})
                            </span>
                          )}
                        </div>
                      )}
                      {c.discountType === "fixed" && (
                        <div className="text-white flex items-center gap-1">
                          <DollarSign size={13} className="text-emerald-400" />
                          <span>৳{c.discountValue} Flat OFF</span>
                        </div>
                      )}
                      {c.discountType === "free_shipping" && (
                        <div className="text-cyan-400 flex items-center gap-1">
                          <Truck size={13} />
                          <span>100% Free Delivery</span>
                        </div>
                      )}
                    </td>

                    {/* Min Order */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-300">
                      {c.minOrderAmount > 0 ? `৳${c.minOrderAmount.toLocaleString()}` : "No Min"}
                    </td>

                    {/* Usage Limit */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-white">{c.usedCount}</span>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-400">{c.usageLimit}</span>
                      </div>
                      <div className="w-20 bg-slate-900 rounded-full h-1 mt-1 overflow-hidden">
                        <div
                          className="bg-amber-400 h-1 rounded-full"
                          style={{
                            width: `${Math.min(100, ((c.usedCount || 0) / (c.usageLimit || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </td>

                    {/* Expiry Date */}
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {c.expiryDate ? (
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-500" />
                          <span>{c.expiryDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">No Expiry</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition flex items-center gap-1 ${
                          c.status === "active"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {c.status === "active" ? (
                          <>
                            <CheckCircle size={11} /> Active
                          </>
                        ) : (
                          <>
                            <XCircle size={11} /> Inactive
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCouponUsages(c)}
                          title="View Usage History"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                        >
                          <History size={13} />
                        </button>

                        <button
                          onClick={() => handleDuplicate(c)}
                          title="Duplicate Coupon"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                        >
                          <Copy size={13} />
                        </button>

                        <button
                          onClick={() => {
                            setIsNew(false);
                            setEditingCoupon(c);
                          }}
                          title="Edit Coupon"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                        >
                          <Edit size={13} />
                        </button>

                        <button
                          onClick={() => handleDeleteCoupon(c)}
                          title="Delete Coupon"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  {isNew ? "Create Promotional Coupon" : `Edit Coupon: ${editingCoupon.code}`}
                </h3>
              </div>
              <button
                onClick={() => setEditingCoupon(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Row 1: Code & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Coupon Code <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCoupon.code}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase().replace(/\s+/g, "") })
                    }
                    placeholder="e.g. SAVE20"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold uppercase focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Customer types this at checkout.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={editingCoupon.status}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, status: e.target.value as "active" | "inactive" })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="active">Active (Available for checkout)</option>
                    <option value="inactive">Inactive (Disabled)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={editingCoupon.description}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                  placeholder="e.g. 20% discount on orders above ৳1,000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Row 2: Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={editingCoupon.discountType}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, discountType: e.target.value as DiscountType })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Amount Discount (৳ BDT)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Discount Value {editingCoupon.discountType === "percentage" ? "(%)" : "(৳ BDT)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingCoupon.discountValue}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, discountValue: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Row 3: Minimum Order & Max Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Minimum Order Amount (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCoupon.minOrderAmount}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, minOrderAmount: Number(e.target.value) })
                    }
                    placeholder="0 = No minimum"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Subtotal must reach this value.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Maximum Discount Amount (৳) <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingCoupon.maxDiscountAmount || ""}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        maxDiscountAmount: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Leave empty for unlimited cap"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Capped maximum discount for percentage coupons.</p>
                </div>
              </div>

              {/* Row 4: Usage Limits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={editingCoupon.usageLimit}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, usageLimit: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Max redemptions across all customers.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Usage Limit Per Customer</label>
                  <input
                    type="number"
                    min="1"
                    value={editingCoupon.usageLimitPerCustomer}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, usageLimitPerCustomer: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Times a single customer phone can redeem.</p>
                </div>
              </div>

              {/* Row 5: Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editingCoupon.startDate || ""}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, startDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={editingCoupon.expiryDate || ""}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, expiryDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Toggles: Eligibility & Free Shipping */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCoupon.isFirstOrderOnly}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, isFirstOrderOnly: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700"
                  />
                  <span>First Order Only (Valid only for brand new customers)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCoupon.freeShipping}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, freeShipping: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700"
                  />
                  <span>Include Free Shipping (Waive delivery fees along with discount)</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save size={15} />
                  <span>{isSaving ? "Saving..." : "Save Coupon"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Usage History Modal */}
      {selectedCouponUsages && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Usage History: {selectedCouponUsages.code}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Total {selectedCouponUsages.usages?.length || 0} customer orders redeemed
                </p>
              </div>
              <button
                onClick={() => setSelectedCouponUsages(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
              {!selectedCouponUsages.usages || selectedCouponUsages.usages.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No redemptions recorded for this coupon yet.
                </div>
              ) : (
                selectedCouponUsages.usages.map((u, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white font-mono">{u.orderId}</div>
                      <div className="text-[11px] text-slate-400">
                        {u.customerPhone || "Guest checkout"} • {new Date(u.usedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400 font-mono">
                        -৳{u.discountAmount.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-500">discount</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
