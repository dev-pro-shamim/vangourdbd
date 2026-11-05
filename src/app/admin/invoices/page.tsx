"use client";

import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Printer, Search, Download, Check, X, ShieldCheck } from "lucide-react";
import { Invoice } from "@/types/cms";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setInvoices(d.data);
      });
  }, []);

  const filtered = invoices.filter(
    (i) =>
      i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.customerName.toLowerCase().includes(search.toLowerCase()) ||
      i.customerPhone.includes(search)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="text-emerald-400" size={26} />
            Invoices & Billing History
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Official tax invoices automatically generated upon order creation. Ready for thermal and standard A4 printing.
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search Invoice #, Order #, Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div className="text-xs text-slate-400">
            Total Invoices: <span className="text-white font-bold">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{inv.orderNumber}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(inv.date).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{inv.customerName}</div>
                    <div className="text-[11px] font-mono text-slate-400">{inv.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">৳{inv.total}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {inv.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition inline-flex items-center gap-1.5"
                    >
                      <Printer size={13} />
                      <span>View & Print</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white text-neutral-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl flex flex-col justify-between custom-scrollbar print:p-0 print:shadow-none print:max-h-none print:w-full">
            <div className="space-y-6">
              {/* Invoice Top Branding */}
              <div className="flex items-start justify-between border-b pb-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                    {selectedInvoice.storeBranding?.name || "VANGUARD BD"}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    {selectedInvoice.storeBranding?.address || "House 24, Road 11, Banani, Dhaka, Bangladesh"}
                  </p>
                  <p className="text-xs text-neutral-500">Phone: {selectedInvoice.storeBranding?.phone}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-neutral-900">{selectedInvoice.invoiceNumber}</div>
                  <div className="text-xs text-neutral-500 mt-1">Order Ref: {selectedInvoice.orderNumber}</div>
                  <div className="text-xs text-neutral-500">Date: {new Date(selectedInvoice.date).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Customer & Address */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div>
                  <strong className="text-neutral-400 uppercase text-[10px] block mb-1">Billed To:</strong>
                  <div className="font-bold text-neutral-900 text-sm">{selectedInvoice.customerName}</div>
                  <div className="text-neutral-600 mt-0.5">{selectedInvoice.customerPhone}</div>
                </div>
                <div>
                  <strong className="text-neutral-400 uppercase text-[10px] block mb-1">Shipping Address:</strong>
                  <div className="text-neutral-700">{selectedInvoice.customerAddress}</div>
                  <div className="text-neutral-500 mt-1 font-mono">Payment: {selectedInvoice.paymentMethod}</div>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left text-xs border border-neutral-200 rounded-lg overflow-hidden">
                <thead className="bg-neutral-100 text-neutral-600 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-neutral-900">{item.name}</div>
                        <div className="text-[10px] text-neutral-500">
                          Size: {item.size || "STD"} | Color: {item.color || "STD"}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">৳{item.price}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">৳{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Financial Calculation */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal:</span>
                    <span>৳{selectedInvoice.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery Fee:</span>
                    <span>৳{selectedInvoice.shippingFee}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-neutral-900 border-t pt-2">
                    <span>Total Payable:</span>
                    <span>৳{selectedInvoice.total}</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-[11px] text-neutral-400 border-t pt-4">
                Thank you for your purchase from VANGUARD BD. For returns or support, contact {selectedInvoice.storeBranding?.phone}.
              </div>
            </div>

            {/* Print & Close Buttons (Hidden during actual print) */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t mt-6 print:hidden">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-lg shadow-md"
              >
                <Printer size={15} />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
