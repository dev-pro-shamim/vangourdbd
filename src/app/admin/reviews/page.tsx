"use client";

import React, { useState, useEffect } from "react";
import { Star, Check, X, MessageSquare, ThumbsUp, ShieldCheck } from "lucide-react";
import { ReviewItem } from "@/types/cms";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: "Approved" | "Rejected") => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = reviews.filter((r) => filter === "All" || r.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Star className="text-amber-400" size={26} />
          Customer Product Reviews
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Moderate verified buyer reviews, approve public testimonials, and reply to customer feedback.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {(["All", "Pending", "Approved", "Rejected"] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === st
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {st} ({st === "All" ? reviews.length : reviews.filter((r) => r.status === st).length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((rev) => (
          <div key={rev.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{rev.customerName}</h3>
                  {rev.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={12} /> Verified Buyer
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Product: <strong className="text-slate-300">{rev.productName}</strong> ({rev.productId})
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < rev.rating ? "fill-amber-400" : "text-slate-700"}
                    />
                  ))}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rev.status === "Approved"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : rev.status === "Rejected"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {rev.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              "{rev.reviewText}"
            </p>

            {rev.adminReply && (
              <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-2">
                <MessageSquare size={14} className="shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400">Store Reply:</strong> {rev.adminReply}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              <span>Submitted: {new Date(rev.createdAt).toLocaleDateString()}</span>
              {rev.status === "Pending" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(rev.id, "Approved")}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                  >
                    <Check size={13} /> Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(rev.id, "Rejected")}
                    className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs"
                  >
                    <X size={13} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
