"use client";

import React, { useState, useEffect } from "react";
import {
  Boxes,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Search,
  Plus,
  RefreshCw,
  Building2,
  FileSpreadsheet,
  X,
  History,
  DollarSign,
} from "lucide-react";
import { ProductItem, StockTransaction, Supplier } from "@/types/cms";

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [overview, setOverview] = useState({
    totalSkus: 0,
    totalQuantity: 0,
    totalCostValue: 0,
    totalRetailValue: 0,
    potentialProfit: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"stock" | "transactions" | "suppliers">("stock");

  // Adjustment Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [adjustType, setAdjustType] = useState<"PURCHASE" | "SALE" | "ADJUSTMENT" | "RETURN" | "DAMAGE">("ADJUSTMENT");
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustRef, setAdjustRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Supplier Modal
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supName, setSupName] = useState("");
  const [supContact, setSupContact] = useState("");
  const [supPhone, setSupPhone] = useState("");
  const [supEmail, setSupEmail] = useState("");
  const [supAddress, setSupAddress] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, prodRes, supRes] = await Promise.all([
        fetch("/api/inventory"),
        fetch("/api/products"),
        fetch("/api/inventory/suppliers"),
      ]);
      const invData = await invRes.json();
      const prodData = await prodRes.json();
      const supData = await supRes.json();

      if (invData.success) {
        setOverview(invData.data.overview);
        setTransactions(invData.data.transactions);
      }
      if (prodData.success) {
        setProducts(prodData.data);
      }
      if (supData.success) {
        setSuppliers(supData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !adjustQty || !adjustReason) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          type: adjustType,
          quantityDelta: adjustQty,
          reason: adjustReason,
          referenceId: adjustRef,
          performedBy: "Admin User",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdjustModalOpen(false);
        setAdjustReason("");
        setAdjustRef("");
        fetchData();
      } else {
        alert(data.error || "Failed to adjust stock");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supPhone) return;
    try {
      const res = await fetch("/api/inventory/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: supName,
          contactPerson: supContact,
          phone: supPhone,
          email: supEmail,
          address: supAddress,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSupplierModalOpen(false);
        setSupName("");
        setSupContact("");
        setSupPhone("");
        setSupEmail("");
        setSupAddress("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Boxes className="text-amber-400" size={26} />
            Inventory & Warehouse Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time stock control, valuation, automated reservations, and transaction audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchData()}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Sync</span>
          </button>
          <a
            href="/api/reports?type=inventory&format=csv"
            download
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
          >
            <FileSpreadsheet size={14} className="text-emerald-400" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Quantity In Stock</div>
          <div className="text-2xl font-extrabold text-white mt-1.5">{overview.totalQuantity.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across {overview.totalSkus} distinct SKUs</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Inventory Cost Value</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1.5">৳{overview.totalCostValue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">Purchase basis value</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Retail Sales Potential</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1.5">৳{overview.totalRetailValue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400/80 font-medium mt-1">Profit margin: ৳{overview.potentialProfit.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Stock Alerts</div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xl font-bold text-amber-400 flex items-center gap-1">
              <AlertTriangle size={16} /> {overview.lowStockProducts} Low
            </span>
            <span className="text-xl font-bold text-rose-400">
              {overview.outOfStockProducts} Out
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Immediate action required</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("stock")}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === "stock"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Boxes size={15} />
          <span>Stock Overview ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === "transactions"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <History size={15} />
          <span>Audit Movements ({transactions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("suppliers")}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === "suppliers"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Building2 size={15} />
          <span>Suppliers ({suppliers.length})</span>
        </button>
      </div>

      {/* TAB 1: Stock Overview */}
      {activeTab === "stock" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search SKU, Product Name, Category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="text-xs text-slate-400">
              Showing <span className="text-white font-bold">{filteredProducts.length}</span> items
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">SKU / Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Cost Basis</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Reserved</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const isLow = p.stockQuantity <= (p.lowStockThreshold || 5) && p.stockQuantity > 0;
                  const isOut = p.stockQuantity <= 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || "https://commandobd.com/uploads/all/2024/09/24/slider-1.jpg"}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-white line-clamp-1">{p.name}</div>
                            <div className="text-[11px] font-mono text-amber-400/90">{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{p.category}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">৳{p.costPrice || Math.round(p.price * 0.55)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">৳{p.price}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white text-sm">{p.stockQuantity}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{p.reservedStock || 0}</td>
                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setAdjustModalOpen(true);
                          }}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition active:scale-95 shadow-sm"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Audit Transactions */}
      {activeTab === "transactions" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">SKU / Product</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4">Quantity Delta</th>
                  <th className="py-3 px-4">New Stock Level</th>
                  <th className="py-3 px-4">Reason / Reference</th>
                  <th className="py-3 px-4">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(t.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{t.productName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{t.sku}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.type === "PURCHASE" || t.type === "RETURN" || t.type === "RELEASE"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : t.type === "SALE" || t.type === "DAMAGE"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={t.quantityDelta >= 0 ? "text-emerald-400" : "text-rose-400"}>
                        {t.quantityDelta > 0 ? `+${t.quantityDelta}` : t.quantityDelta}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">{t.newStockLevel}</td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{t.reason}</div>
                      {t.referenceId && <div className="text-[10px] text-slate-400 font-mono">Ref: {t.referenceId}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{t.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Suppliers */}
      {activeTab === "suppliers" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setSupplierModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition"
            >
              <Plus size={15} />
              <span>Add New Supplier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suppliers.map((s) => (
              <div key={s.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{s.name}</h3>
                  <Building2 className="text-amber-400" size={18} />
                </div>
                <div className="text-xs space-y-1 text-slate-300">
                  <p><strong className="text-slate-400">Contact:</strong> {s.contactPerson}</p>
                  <p><strong className="text-slate-400">Phone:</strong> {s.phone}</p>
                  <p><strong className="text-slate-400">Email:</strong> {s.email || "N/A"}</p>
                  <p><strong className="text-slate-400">Address:</strong> {s.address}</p>
                </div>
                {s.notes && (
                  <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {s.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Adjust Warehouse Stock</h3>
                <p className="text-xs text-slate-400">{selectedProduct.name} ({selectedProduct.sku})</p>
              </div>
              <button onClick={() => setAdjustModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Adjustment Type</label>
                <select
                  value={adjustType}
                  onChange={(e: any) => setAdjustType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="PURCHASE">Purchase / Factory Intake (+)</option>
                  <option value="RETURN">Customer Return (+)</option>
                  <option value="ADJUSTMENT">Manual Inventory Count Adjustment (±)</option>
                  <option value="DAMAGE">Damaged / Defect Stock (-)</option>
                  <option value="SALE">Manual Off-line Sale (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quantity ({selectedProduct.stockQuantity} currently available)
                </label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Received shipment batch PO-2026-92"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reference ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. PO-88219 or RCV-102"
                  value={adjustRef}
                  onChange={(e) => setAdjustRef(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Commit Stock Change"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Modal */}
      {supplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Register New Supplier</h3>
              <button onClick={() => setSupplierModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSupplier} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Factory Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meghna Textile Mills Ltd."
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Rafiqul"
                  value={supContact}
                  onChange={(e) => setSupContact(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="017xxxxxxxx"
                  value={supPhone}
                  onChange={(e) => setSupPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="supplier@factory.com"
                  value={supEmail}
                  onChange={(e) => setSupEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Gazipur, Dhaka, Bangladesh"
                  value={supAddress}
                  onChange={(e) => setSupAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSupplierModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg shadow-md"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
