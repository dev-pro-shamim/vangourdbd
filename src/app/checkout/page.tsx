"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { BRAND } from "@/config/brand";
import { CheckCircle2, ShieldCheck, Truck, ArrowLeft, ShoppingBag, Tag, X } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useApp();

  const [deliveryZone, setDeliveryZone] = useState<"inside" | "outside">("inside");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash">("cod");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    altPhone: "",
    address: "",
    district: "Dhaka",
    notes: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderData, setPlacedOrderData] = useState<any>(null);

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountType: string;
    discountValue: number;
    freeShipping: boolean;
    description?: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const baseShippingCost = deliveryZone === "inside" ? 70 : 130;
  const isFreeThreshold = cartTotal >= 3000;
  const couponFreeShipping = appliedCoupon?.freeShipping || false;
  const effectiveShipping = isFreeThreshold || couponFreeShipping ? 0 : baseShippingCost;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const grandTotal = Math.max(0, cartTotal + effectiveShipping - couponDiscount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) {
      setCouponMessage({ text: "Please enter a promo code.", isError: true });
      return;
    }

    setCouponLoading(true);
    setCouponMessage(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCodeInput.trim(),
          subtotal: cartTotal,
          customerPhone: formData.phone,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAppliedCoupon(data.data);
        setCouponMessage({
          text: data.message || `Coupon "${data.data.code}" applied!`,
          isError: false,
        });
      } else {
        setAppliedCoupon(null);
        setCouponMessage({
          text: data.error || "Invalid coupon code.",
          isError: true,
        });
      }
    } catch {
      setCouponMessage({ text: "Failed to validate coupon.", isError: true });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    setCouponMessage(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please enter customer name, phone number, and delivery address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        address: formData.address,
        city: deliveryZone === "inside" ? "Dhaka" : "Outside Dhaka",
        district: formData.district || (deliveryZone === "inside" ? "Dhaka" : "Outside Dhaka"),
        items: cart.map((c) => ({
          productId: c.product.id,
          name: c.product.name || c.product.title,
          slug: c.product.slug,
          image: c.product.images[0] || "",
          price: c.product.price,
          quantity: c.quantity,
          size: c.size,
          color: c.color,
          sku: c.product.sku || `VNG-${c.product.id}`,
        })),
        subtotal: cartTotal,
        shippingFee: effectiveShipping,
        couponCode: appliedCoupon?.code || undefined,
        couponDiscount: couponDiscount > 0 ? couponDiscount : undefined,
        total: grandTotal,
        paymentMethod:
          paymentMethod === "cod"
            ? "Cash on Delivery"
            : paymentMethod === "bkash"
            ? "bKash"
            : "Bank Transfer",
        paymentStatus: "Pending",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success) {
        setPlacedOrderData(data.data);
        setOrderId(data.data.orderNumber);
        setOrderPlaced(true);
        clearCart();
      } else {
        alert(data.error || "Failed to submit order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred while placing order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="bg-white min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-neutral-50 rounded-2xl border border-neutral-200 p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black uppercase text-neutral-900 tracking-tight">
            Order Confirmed!
          </h2>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Thank you for shopping with <strong>{BRAND.fullName}</strong>. Your order has been placed successfully and our dispatch team will call you shortly to confirm delivery.
          </p>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Order ID:</span>
              <span className="font-mono font-bold text-black">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Customer:</span>
              <span className="font-bold text-black">{formData.name || "Customer"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Phone:</span>
              <span className="font-bold text-black">{formData.phone || BRAND.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment:</span>
              <span className="font-bold text-black">
                {paymentMethod === "cod" ? "Cash on Delivery" : "bKash / Online"}
              </span>
            </div>
            <div className="flex justify-between border-t border-neutral-100 pt-2 font-black text-sm">
              <span>Amount Due:</span>
              <span>৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Link
              href={`/admin/invoices?order=${orderId}`}
              className="w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg block hover:bg-emerald-500 transition-colors"
            >
              View Official Tax Invoice
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 bg-black text-white text-xs font-black uppercase tracking-wider rounded-lg block hover:bg-neutral-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8 md:py-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-8 pb-4 border-b border-neutral-200">
          Checkout & Shipping
        </h1>

        {cart.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <p className="text-sm text-neutral-500">Your cart is empty.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase rounded-lg"
            >
              Shop Items
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Delivery Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Info */}
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 pb-3 border-b border-neutral-200">
                  1. Delivery Details
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017xxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">
                        Alternative Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="018xxxxxxxx"
                        value={formData.altPhone}
                        onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                        className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">
                      Full Street Address *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="House, Road, Area, Thana, District"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">
                      Order Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Special delivery instructions..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Zone Selection */}
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 pb-3 border-b border-neutral-200">
                  2. Select Delivery Zone
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setDeliveryZone("inside")}
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      deliveryZone === "inside"
                        ? "bg-white border-black shadow-sm ring-2 ring-black"
                        : "bg-white border-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === "inside"}
                      onChange={() => setDeliveryZone("inside")}
                      className="accent-black mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-neutral-900">Inside Dhaka (24 - 48h)</p>
                      <p className="text-neutral-500 mt-0.5">Delivery fee: ৳70</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setDeliveryZone("outside")}
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      deliveryZone === "outside"
                        ? "bg-white border-black shadow-sm ring-2 ring-black"
                        : "bg-white border-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === "outside"}
                      onChange={() => setDeliveryZone("outside")}
                      className="accent-black mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-neutral-900">Outside Dhaka (3 - 5 days)</p>
                      <p className="text-neutral-500 mt-0.5">Delivery fee: ৳130</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 pb-3 border-b border-neutral-200">
                  3. Payment Method
                </h3>

                <div className="space-y-3 text-xs">
                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "bg-white border-black shadow-sm ring-2 ring-black"
                        : "bg-white border-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-black mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-neutral-900">Cash on Delivery (COD)</p>
                      <p className="text-neutral-500 mt-0.5">Pay in cash upon delivery to your doorstep.</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod("bkash")}
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === "bkash"
                        ? "bg-white border-black shadow-sm ring-2 ring-black"
                        : "bg-white border-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "bkash"}
                      onChange={() => setPaymentMethod("bkash")}
                      className="accent-black mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-neutral-900">bKash / Online Payment</p>
                      <p className="text-neutral-500 mt-0.5">Instant secure payment via bKash, Nagad or Rocket.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4 sticky top-28">
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 pb-3 border-b border-neutral-200">
                  Order Summary ({cart.length})
                </h3>

                {/* Items preview */}
                <div className="divide-y divide-neutral-200 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-10 h-12 object-cover rounded bg-neutral-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-neutral-900 truncate max-w-[180px]">
                            {item.product.title}
                          </p>
                          <p className="text-neutral-500">
                            Size: {item.selectedSize} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-black">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-3 border-t border-neutral-200">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                      <Tag size={13} className="text-neutral-900" />
                      <span>Have a Promo Code?</span>
                    </label>

                    {appliedCoupon ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-emerald-700 uppercase px-2 py-0.5 bg-emerald-100 rounded">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-emerald-700 font-semibold">
                            {appliedCoupon.freeShipping
                              ? "Free Shipping Unlocked!"
                              : `-৳${appliedCoupon.discountAmount} Applied`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="w-6 h-6 rounded-full bg-emerald-200 hover:bg-emerald-300 text-emerald-800 flex items-center justify-center transition"
                          title="Remove coupon"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. SAVE20, VANGUARD100"
                          value={couponCodeInput}
                          onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                          className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono font-bold uppercase placeholder-neutral-400 focus:outline-none focus:border-black"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCodeInput.trim()}
                          className="px-4 py-2 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                        >
                          {couponLoading ? "Checking..." : "Apply"}
                        </button>
                      </div>
                    )}

                    {couponMessage && (
                      <p
                        className={`text-[11px] font-semibold mt-1 ${
                          couponMessage.isError ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {couponMessage.text}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">৳{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping ({deliveryZone === "inside" ? "Dhaka" : "Outside"})</span>
                    <span className="font-bold text-black">
                      {effectiveShipping === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        `৳${effectiveShipping}`
                      )}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount ({appliedCoupon?.code})</span>
                      <span>-৳{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-black text-black">
                    <span>Total Amount</span>
                    <span className="text-base">৳{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Processing Order & Reserving Stock..." : "Confirm & Place Order"}
                </button>

                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Guaranteed safe checkout & privacy</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
