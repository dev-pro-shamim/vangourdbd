"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Check,
  X,
  ShieldCheck,
  ShieldAlert,
  Printer,
  FileSpreadsheet,
  Send,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Phone,
  MapPin,
  CreditCard,
  User,
  Calendar,
  Filter,
  CheckSquare,
  Square,
  Layers,
  ArrowUpDown,
  Download,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import { Order, OrderStatus, FraudCheckResult } from "@/types/cms";

type DateFilterType = "all" | "today" | "yesterday" | "last7" | "last30" | "this_month" | "custom";

export default function AdminOrdersPage() {
  const { orders, refreshData } = useCMS();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Bulk Selection State
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<OrderStatus>("Confirmed");

  // Date Filter State
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grouped">("table");

  // Courier booking modal state
  const [courierModalOpen, setCourierModalOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<"Steadfast" | "Pathao" | "RedX">("Steadfast");
  const [isBookingCourier, setIsBookingCourier] = useState(false);

  // Fraud check state
  const [fraudModalOpen, setFraudModalOpen] = useState(false);
  const [fraudReport, setFraudReport] = useState<FraudCheckResult | null>(null);
  const [checkingFraud, setCheckingFraud] = useState(false);

  // Internal note state
  const [newNoteText, setNewNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const statuses: OrderStatus[] = [
    "Pending",
    "Confirmed",
    "Processing",
    "Ready to Ship",
    "Shipped",
    "In Transit",
    "Delivered",
    "Cancelled",
    "Returned",
    "Refunded",
    "On Hold",
  ];

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  // Date Calculations
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Search
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerPhone.includes(searchQuery);

      // Status
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;

      // Date Filtering
      const orderDate = new Date(o.createdAt);
      const orderDateStr = o.createdAt ? o.createdAt.split("T")[0] : "";

      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = orderDateStr === todayStr;
      } else if (dateFilter === "yesterday") {
        matchesDate = orderDateStr === yesterdayStr;
      } else if (dateFilter === "last7") {
        matchesDate = orderDate >= sevenDaysAgo;
      } else if (dateFilter === "last30") {
        matchesDate = orderDate >= thirtyDaysAgo;
      } else if (dateFilter === "this_month") {
        matchesDate = orderDate >= startOfMonth;
      } else if (dateFilter === "custom") {
        if (startDate && orderDateStr < startDate) matchesDate = false;
        if (endDate && orderDateStr > endDate) matchesDate = false;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, dateFilter, startDate, endDate, todayStr, yesterdayStr]);

  // Grouped by Day for Order History
  const ordersByDay = useMemo(() => {
    const groups: {
      [dateKey: string]: {
        dateStr: string;
        label: string;
        orders: Order[];
        totalAmount: number;
      };
    } = {};

    filteredOrders.forEach((o) => {
      const dateKey = o.createdAt ? o.createdAt.split("T")[0] : "unknown";
      if (!groups[dateKey]) {
        let label = "Date Unknown";
        if (dateKey !== "unknown") {
          label = new Date(dateKey + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          if (dateKey === todayStr) label = `Today (${label})`;
          else if (dateKey === yesterdayStr) label = `Yesterday (${label})`;
        }

        groups[dateKey] = {
          dateStr: dateKey,
          label,
          orders: [],
          totalAmount: 0,
        };
      }
      groups[dateKey].orders.push(o);
      groups[dateKey].totalAmount += o.total;
    });

    return Object.values(groups).sort((a, b) => b.dateStr.localeCompare(a.dateStr));
  }, [filteredOrders, todayStr, yesterdayStr]);

  // Metrics for Current Filter
  const metrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingCount = filteredOrders.filter((o) => o.status === "Pending").length;
    const deliveredCount = filteredOrders.filter((o) => o.status === "Delivered").length;
    const processingCount = filteredOrders.filter((o) => o.status === "Processing" || o.status === "Ready to Ship").length;
    return { totalRevenue, pendingCount, deliveredCount, processingCount };
  }, [filteredOrders]);

  // Bulk Selection Handlers
  const isAllSelected =
    filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 1-Click Manual Status Update (Single)
  const handleUpdateStatus = async (id: string, status: OrderStatus, note?: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          note: note || `Order status manually updated to ${status}`,
          performedBy: "Admin Staff",
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        if (selectedOrder?.id === id) {
          setSelectedOrder(data.data);
        }
        showNotification(`Order ${data.data.orderNumber} status changed to "${status}"`);
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  // Bulk Status Update
  const handleBulkStatusUpdate = async () => {
    if (selectedOrderIds.length === 0) return;
    if (!confirm(`Are you sure you want to change status of ${selectedOrderIds.length} orders to "${bulkTargetStatus}"?`)) return;

    setIsBulkUpdating(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: selectedOrderIds,
          status: bulkTargetStatus,
          note: `Bulk status update to ${bulkTargetStatus}`,
          performedBy: "Admin Staff",
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        showNotification(`Successfully updated ${selectedOrderIds.length} orders to "${bulkTargetStatus}"!`);
        setSelectedOrderIds([]);
      } else {
        alert(data.error || "Failed to bulk update orders");
      }
    } catch {
      alert("Error performing bulk update");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // Bulk Export CSV
  const handleExportSelectedCSV = () => {
    const targetOrders = selectedOrderIds.length > 0
      ? filteredOrders.filter((o) => selectedOrderIds.includes(o.id))
      : filteredOrders;

    const headers = ["Order Number", "Date", "Customer Name", "Phone", "Address", "City", "Total (BDT)", "Status", "Courier", "Consignment"];
    const rows = targetOrders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleString(),
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.address}"`,
      `"${o.city}"`,
      o.total,
      o.status,
      o.courierName || "None",
      o.consignmentId || "None",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`Exported ${targetOrders.length} orders to CSV`);
  };

  // Bulk Print Invoices
  const handleBulkPrintInvoices = () => {
    const targetOrders = selectedOrderIds.length > 0
      ? filteredOrders.filter((o) => selectedOrderIds.includes(o.id))
      : filteredOrders;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print invoices");
      return;
    }

    const html = `
      <html>
        <head>
          <title>Bulk Order Invoices (${targetOrders.length})</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; color: #111; }
            .invoice-card { page-break-after: always; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; margin-bottom: 24px; max-width: 800px; margin-left: auto; margin-right: auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 16px; }
            .badge { display: inline-block; padding: 4px 8px; background: #eee; border-radius: 4px; font-weight: bold; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background: #f8fafc; }
            .total-row { font-weight: bold; font-size: 15px; }
          </style>
        </head>
        <body>
          ${targetOrders
            .map(
              (o) => `
            <div class="invoice-card">
              <div class="header">
                <div>
                  <h2 style="margin: 0;">VANGUARD BD</h2>
                  <div style="font-size: 12px; color: #64748b;">Order Invoice: <strong>${o.orderNumber}</strong></div>
                  <div style="font-size: 11px; color: #64748b;">Date: ${new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div style="text-align: right;">
                  <span class="badge">${o.status}</span>
                  <div style="font-size: 12px; margin-top: 6px;">Courier: ${o.courierName || "Unassigned"}</div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 12px; line-height: 1.6; margin-bottom: 16px;">
                <div>
                  <strong>Billed & Shipped To:</strong><br/>
                  ${o.customerName}<br/>
                  Phone: ${o.customerPhone}<br/>
                  Address: ${o.address}, ${o.city}
                </div>
                <div style="text-align: right;">
                  <strong>Payment Method:</strong> ${o.paymentMethod || "Cash on Delivery"}<br/>
                  <strong>Payment Status:</strong> ${o.paymentStatus || "Pending"}
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Size/Color</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${o.items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.title || item.name}</td>
                      <td>${item.size || "M"} / ${item.color || "Default"}</td>
                      <td>${item.quantity}</td>
                      <td>৳${item.price.toLocaleString()}</td>
                      <td>৳${(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  `
                    )
                    .join("")}
                  <tr class="total-row">
                    <td colspan="4" style="text-align: right;">Delivery Fee:</td>
                    <td>৳${(o.shippingFee || 70).toLocaleString()}</td>
                  </tr>
                  <tr class="total-row" style="background: #f1f5f9;">
                    <td colspan="4" style="text-align: right;">Grand Total:</td>
                    <td>৳${o.total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          `
            )
            .join("")}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleRunFraudCheck = async (phone: string) => {
    setCheckingFraud(true);
    setFraudModalOpen(true);
    try {
      const res = await fetch(`/api/fraud-checker?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (data.success) {
        setFraudReport(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingFraud(false);
    }
  };

  const handleBookCourier = async () => {
    if (!selectedOrder) return;
    setIsBookingCourier(true);
    try {
      const res = await fetch("/api/courier/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          courierName: selectedCourier,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        const updated = await fetch(`/api/orders/${selectedOrder.id}`).then((r) => r.json());
        if (updated.success) setSelectedOrder(updated.data);
        setCourierModalOpen(false);
        showNotification(`Consignment booked with ${selectedCourier}! Tracking: ${data.data.trackingCode}`);
      } else {
        alert(data.error || "Failed to book courier");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBookingCourier(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newNoteText.trim()) return;
    setIsAddingNote(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_note",
          text: newNoteText,
          author: "Admin Staff",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.data);
        setNewNoteText("");
        showNotification("Internal note attached to order.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Toast Notification */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-950/95 border border-emerald-500/40 text-emerald-200 px-5 py-3 rounded-2xl text-xs flex items-center gap-2.5 font-semibold shadow-2xl animate-in slide-in-from-top-2">
          <Check size={16} className="text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1e293b] p-6 rounded-3xl border border-slate-700/80 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              ERP FULFILLMENT
            </span>
            <span className="text-xs text-slate-400 font-medium">Orders & Courier Operations</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="text-amber-400" size={28} />
            Orders Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Day-by-day order history, manual inline status updates, bulk status processing, and 1-click courier dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleExportSelectedCSV()}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition border border-slate-700 cursor-pointer"
          >
            <Download size={14} className="text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleBulkPrintInvoices()}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition border border-slate-700 cursor-pointer"
          >
            <Printer size={14} className="text-amber-400" />
            <span>Print Invoices</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] border border-slate-700/80 p-4 rounded-2xl shadow-md">
          <span className="text-xs text-slate-400 font-semibold block">Total Orders</span>
          <div className="text-2xl font-black text-white mt-1">{filteredOrders.length}</div>
          <span className="text-[10px] text-slate-500">In selected filter</span>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/80 p-4 rounded-2xl shadow-md">
          <span className="text-xs text-slate-400 font-semibold block">Total Revenue</span>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
            ৳{metrics.totalRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">Gross order value</span>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/80 p-4 rounded-2xl shadow-md">
          <span className="text-xs text-slate-400 font-semibold block">Pending Orders</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{metrics.pendingCount}</div>
          <span className="text-[10px] text-amber-400/80">Needs review & confirm</span>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/80 p-4 rounded-2xl shadow-md">
          <span className="text-xs text-slate-400 font-semibold block">Completed Delivery</span>
          <div className="text-2xl font-black text-blue-400 mt-1">{metrics.deliveredCount}</div>
          <span className="text-[10px] text-blue-400/80">Delivered successfully</span>
        </div>
      </div>

      {/* Date-by-Day Filter Bar */}
      <div className="bg-[#1e293b] border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-2">
              <Calendar size={14} className="text-amber-400" />
              <span>Date Filter:</span>
            </span>
            {[
              { id: "all", label: "All Time" },
              { id: "today", label: "Today" },
              { id: "yesterday", label: "Yesterday" },
              { id: "last7", label: "Last 7 Days" },
              { id: "last30", label: "Last 30 Days" },
              { id: "this_month", label: "This Month" },
              { id: "custom", label: "Custom Range" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDateFilter(d.id as DateFilterType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  dateFilter === d.id
                    ? "bg-amber-400 text-slate-950 shadow-md font-black"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Flat Table vs Grouped by Date */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="text-xs text-slate-400 font-semibold">View:</span>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-0.5 flex items-center">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  viewMode === "table" ? "bg-amber-400 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                Flat Table
              </button>
              <button
                onClick={() => setViewMode("grouped")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  viewMode === "grouped" ? "bg-amber-400 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                Day-by-Day History
              </button>
            </div>
          </div>
        </div>

        {/* Custom Date Pickers */}
        {dateFilter === "custom" && (
          <div className="pt-3 border-t border-slate-700/60 flex flex-wrap items-center gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">From Date:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">To Date:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-xs text-amber-400 hover:underline font-semibold ml-2"
              >
                Clear Dates
              </button>
            )}
          </div>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
            statusFilter === "all"
              ? "bg-amber-400 text-slate-950 shadow-md font-black"
              : "bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white"
          }`}
        >
          All Stages ({orders.length})
        </button>
        {statuses.map((st) => {
          const count = orders.filter((o) => o.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                statusFilter === st
                  ? "bg-amber-400 text-slate-950 shadow-md font-black"
                  : "bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white"
              }`}
            >
              <span>{st}</span>
              {count > 0 && <span className="text-[10px] opacity-80">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Floating / Sticky Bulk Action Bar (Visible when 1+ orders selected) */}
      {selectedOrderIds.length > 0 && (
        <div className="sticky top-4 z-40 bg-slate-950/95 border-2 border-amber-400/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
              {selectedOrderIds.length}
            </span>
            <div>
              <div className="text-sm font-bold text-white">
                {selectedOrderIds.length} Order(s) Selected
              </div>
              <div className="text-[11px] text-slate-400">
                Apply bulk status change or generate bulk printable invoices
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Selector */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5">
              <span className="text-xs text-slate-400 font-semibold">Change to:</span>
              <select
                value={bulkTargetStatus}
                onChange={(e) => setBulkTargetStatus(e.target.value as OrderStatus)}
                className="bg-transparent text-amber-300 font-bold text-xs outline-none cursor-pointer"
              >
                {statuses.map((st) => (
                  <option key={st} value={st} className="bg-slate-900 text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleBulkStatusUpdate}
              disabled={isBulkUpdating}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>{isBulkUpdating ? "Updating..." : "Update Selected"}</span>
            </button>

            {/* Bulk Print */}
            <button
              onClick={handleBulkPrintInvoices}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer size={14} className="text-amber-400" />
              <span>Print Invoices</span>
            </button>

            {/* Bulk Export CSV */}
            <button
              onClick={handleExportSelectedCSV}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <Download size={14} className="text-emerald-400" />
              <span>Export CSV</span>
            </button>

            {/* Deselect All */}
            <button
              onClick={() => setSelectedOrderIds([])}
              className="px-3 py-2 text-slate-400 hover:text-white text-xs font-bold transition"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Search & Counter Bar */}
      <div className="bg-[#1e293b] border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search Order #, Customer Name, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Showing <strong className="text-white">{filteredOrders.length}</strong> matching orders
        </div>
      </div>

      {/* VIEW 1: Flat Table View */}
      {viewMode === "table" ? (
        <div className="bg-[#1e293b] border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/80">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-400 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Order # & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Courier</th>
                  <th className="py-3 px-4">Status (Click to Change)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o) => {
                    const isSelected = selectedOrderIds.includes(o.id);
                    return (
                      <OrderTableRow
                        key={o.id}
                        order={o}
                        isSelected={isSelected}
                        statuses={statuses}
                        onToggleSelect={() => handleToggleSelect(o.id)}
                        onUpdateStatus={handleUpdateStatus}
                        onManage={() => setSelectedOrder(o)}
                      />
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No orders found matching the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW 2: Day-by-Day Grouped View */
        <div className="space-y-6">
          {ordersByDay.length > 0 ? (
            ordersByDay.map((group) => (
              <div
                key={group.dateStr}
                className="bg-[#1e293b] border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl"
              >
                {/* Day Header Banner */}
                <div className="bg-slate-900/90 p-4 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">{group.label}</h3>
                      <span className="text-[11px] text-slate-400">
                        {group.orders.length} order(s) placed on this date
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Daily Volume
                      </span>
                      <span className="text-sm font-mono font-bold text-emerald-400">
                        ৳{group.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const idsOnDay = group.orders.map((o) => o.id);
                        const allDaySelected = idsOnDay.every((id) => selectedOrderIds.includes(id));
                        if (allDaySelected) {
                          setSelectedOrderIds((prev) => prev.filter((id) => !idsOnDay.includes(id)));
                        } else {
                          setSelectedOrderIds((prev) => Array.from(new Set([...prev, ...idsOnDay])));
                        }
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition"
                    >
                      Select Day's Orders
                    </button>
                  </div>
                </div>

                {/* Day Orders Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-800/60">
                      {group.orders.map((o) => {
                        const isSelected = selectedOrderIds.includes(o.id);
                        return (
                          <OrderTableRow
                            key={o.id}
                            order={o}
                            isSelected={isSelected}
                            statuses={statuses}
                            onToggleSelect={() => handleToggleSelect(o.id)}
                            onUpdateStatus={handleUpdateStatus}
                            onManage={() => setSelectedOrder(o)}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-[#1e293b] rounded-3xl border border-slate-700 text-slate-400">
              No orders found matching the date criteria.
            </div>
          )}
        </div>
      )}

      {/* Order Detail & Fulfillment Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-end p-0 backdrop-blur-xs">
          <div className="bg-[#0f172a] border-l border-slate-700 w-full max-w-2xl h-screen overflow-y-auto p-6 space-y-6 flex flex-col justify-between shadow-2xl custom-scrollbar animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white font-mono">{selectedOrder.orderNumber}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(`
                        <html><head><title>Invoice ${selectedOrder.orderNumber}</title></head>
                        <body style="font-family:sans-serif;padding:30px;">
                          <h2>VANGUARD BD - INVOICE</h2>
                          <p>Order: ${selectedOrder.orderNumber} | Date: ${new Date(selectedOrder.createdAt).toLocaleString()}</p>
                          <p>Customer: ${selectedOrder.customerName} (${selectedOrder.customerPhone})</p>
                          <p>Address: ${selectedOrder.address}, ${selectedOrder.city}</p>
                          <hr/>
                          <p><strong>Total: ৳${selectedOrder.total}</strong></p>
                          <script>window.print();</script>
                        </body></html>
                      `);
                      printWindow.document.close();
                    }
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  title="Print Single Invoice"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-6 flex-1 text-xs">
              {/* Manual Status Quick Updater inside Drawer */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-white block">
                  Manual Status Update:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        selectedOrder.status === st
                          ? "bg-amber-400 text-slate-950 font-black shadow"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="font-bold text-slate-300 text-xs block">Customer Information</span>
                  <div className="text-white font-bold">{selectedOrder.customerName}</div>
                  <div className="text-slate-400 flex items-center gap-1.5 font-mono">
                    <Phone size={12} /> {selectedOrder.customerPhone}
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleRunFraudCheck(selectedOrder.customerPhone)}
                      className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold flex items-center gap-1"
                    >
                      <ShieldCheck size={12} /> Run Fraud Scoring
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="font-bold text-slate-300 text-xs block">Shipping Address</span>
                  <div className="text-white font-medium">{selectedOrder.address}</div>
                  <div className="text-slate-400 font-bold">{selectedOrder.city}</div>
                  <div className="text-[11px] text-slate-500">Method: Cash On Delivery</div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
                <span className="font-bold text-slate-300 text-xs block">
                  Ordered Items ({selectedOrder.items.length})
                </span>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800/80">
                      <div>
                        <div className="font-bold text-white">{item.title || item.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Size: <strong className="text-slate-300">{item.size || "M"}</strong> | Color:{" "}
                          <strong className="text-slate-300">{item.color || "Default"}</strong>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-white font-bold">
                          {item.quantity} x ৳{item.price.toLocaleString()}
                        </div>
                        <div className="text-emerald-400 font-bold text-xs">
                          ৳{(item.quantity * item.price).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between font-bold text-sm text-white">
                  <span>Grand Total:</span>
                  <span className="font-mono text-emerald-400">৳{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Courier Dispatch Section */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <Truck size={14} className="text-blue-400" /> Courier Consignment
                  </span>
                  {selectedOrder.courierName ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Booked with {selectedOrder.courierName}
                    </span>
                  ) : (
                    <button
                      onClick={() => setCourierModalOpen(true)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow transition"
                    >
                      Book 1-Click Courier
                    </button>
                  )}
                </div>

                {selectedOrder.consignmentId && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-400">Tracking Code:</span>
                    <span className="font-bold text-amber-400">{selectedOrder.consignmentId}</span>
                  </div>
                )}
              </div>

              {/* Internal Notes */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
                <span className="font-bold text-slate-300 text-xs block">Internal Staff Notes</span>
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add operational notes or dispatch memo..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={isAddingNote || !newNoteText.trim()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    Add Note
                  </button>
                </form>

                {selectedOrder.internalNotes && selectedOrder.internalNotes.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {selectedOrder.internalNotes.map((note, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-950 text-[11px] border border-slate-800">
                        <div className="text-white">{note.text}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {note.author} • {new Date(note.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-800 shrink-0 flex items-center justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courier Booking Modal */}
      {courierModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Truck size={18} className="text-blue-400" /> Book Courier Consignment
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dispatch order <strong className="text-amber-400">{selectedOrder.orderNumber}</strong> for{" "}
              <strong>{selectedOrder.customerName}</strong> ({selectedOrder.city}). Cash on delivery amount:{" "}
              <strong className="text-emerald-400 font-mono">৳{selectedOrder.total}</strong>.
            </p>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold block">Select Courier Partner:</label>
              {(["Steadfast", "Pathao", "RedX"] as const).map((courier) => (
                <label
                  key={courier}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    selectedCourier === courier
                      ? "bg-blue-600/10 border-blue-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <span className="font-bold text-xs">{courier} Courier (API)</span>
                  <input
                    type="radio"
                    name="courier_choice"
                    checked={selectedCourier === courier}
                    onChange={() => setSelectedCourier(courier)}
                    className="accent-blue-500"
                  />
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setCourierModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleBookCourier}
                disabled={isBookingCourier}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow transition disabled:opacity-50"
              >
                {isBookingCourier ? "Creating Consignment..." : `Dispatch with ${selectedCourier}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fraud Modal */}
      {fraudModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-400" /> Phone Fraud Risk Assessment
            </h3>
            {checkingFraud ? (
              <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw size={14} className="animate-spin" /> Analyzing national delivery histories...
              </div>
            ) : fraudReport ? (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span>Risk Classification:</span>
                  <span
                    className={`font-black px-2.5 py-0.5 rounded text-xs ${
                      fraudReport.riskLevel === "low"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : fraudReport.riskLevel === "medium"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-rose-500/20 text-rose-400"
                    }`}
                  >
                    {fraudReport.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-slate-900 rounded-lg">
                    <span className="text-slate-400 text-[10px] block">Total Orders</span>
                    <span className="font-bold text-white text-sm">{fraudReport.totalOrders}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg">
                    <span className="text-emerald-400 text-[10px] block">Delivered</span>
                    <span className="font-bold text-emerald-400 text-sm">{fraudReport.deliveredOrders}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg">
                    <span className="text-rose-400 text-[10px] block">Returned</span>
                    <span className="font-bold text-rose-400 text-sm">{fraudReport.returnedOrders}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg font-bold text-center text-slate-300">
                  Delivery Success Rate:{" "}
                  <span className="text-emerald-400 font-mono">{fraudReport.successRate}%</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">No report available.</div>
            )}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setFraudModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Order Table Row with 1-Click Manual Status Dropdown
function OrderTableRow({
  order,
  isSelected,
  statuses,
  onToggleSelect,
  onUpdateStatus,
  onManage,
}: {
  order: Order;
  isSelected: boolean;
  statuses: OrderStatus[];
  onToggleSelect: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onManage: () => void;
}) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <tr
      className={`transition ${
        isSelected ? "bg-amber-400/10 hover:bg-amber-400/15" : "hover:bg-slate-800/40"
      }`}
    >
      {/* Checkbox */}
      <td className="py-3.5 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-400 focus:ring-0 cursor-pointer"
        />
      </td>

      {/* Order Number & Date */}
      <td className="py-3.5 px-4 font-mono">
        <div className="font-black text-amber-400 text-xs sm:text-sm">{order.orderNumber}</div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          {order.createdAt ? new Date(order.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) : "—"}
        </div>
      </td>

      {/* Customer */}
      <td className="py-3.5 px-4">
        <div className="font-bold text-white text-xs">{order.customerName}</div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
          <Phone size={10} className="text-slate-500" />
          {order.customerPhone}
        </div>
      </td>

      {/* Destination */}
      <td className="py-3.5 px-4 text-slate-300">
        <div className="font-semibold text-white">{order.city}</div>
        <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
          {order.address}
        </div>
      </td>

      {/* Items */}
      <td className="py-3.5 px-4">
        <span className="font-mono font-bold text-slate-200">
          {itemCount} item{itemCount !== 1 ? "s" : ""}
        </span>
      </td>

      {/* Total Amount */}
      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
        ৳{order.total.toLocaleString()}
      </td>

      {/* Courier */}
      <td className="py-3.5 px-4">
        {order.courierName ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {order.courierName}
          </span>
        ) : (
          <span className="text-[10px] text-slate-500 italic">Unassigned</span>
        )}
      </td>

      {/* Status: Manual Inline Dropdown */}
      <td className="py-3.5 px-4">
        <div className="relative inline-block">
          <select
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black outline-none cursor-pointer border transition-all ${
              order.status === "Delivered"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                : order.status === "Cancelled" || order.status === "Returned"
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
                : order.status === "Shipped" || order.status === "In Transit"
                ? "bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30"
                : order.status === "Confirmed"
                ? "bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
            }`}
          >
            {statuses.map((st) => (
              <option key={st} value={st} className="bg-slate-900 text-white font-semibold">
                {st}
              </option>
            ))}
          </select>
        </div>
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-right">
        <button
          onClick={onManage}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition active:scale-95 border border-slate-700 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Eye size={13} className="text-amber-400" />
          <span>Manage</span>
        </button>
      </td>
    </tr>
  );
}
