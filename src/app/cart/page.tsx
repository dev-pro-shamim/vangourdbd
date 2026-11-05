"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useApp();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "WELCOME10" || couponCode.toUpperCase() === "VANGUARD") {
      setDiscount(Math.round(cartTotal * 0.1));
      setCouponMessage("10% discount applied!");
    } else {
      setCouponMessage("Invalid coupon code");
    }
  };

  const shipping = cartTotal >= 2000 || cartTotal === 0 ? 0 : 70;
  const grandTotal = Math.max(0, cartTotal - discount + shipping);

  return (
    <div className="bg-white min-h-screen py-8 md:py-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-8 pb-4 border-b border-neutral-200">
          Shopping Cart ({cart.length} {cart.length === 1 ? "Item" : "Items"})
        </h1>

        {cart.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-neutral-800">Your shopping cart is empty</h2>
            <p className="text-xs text-neutral-500">
              You don't have any items in your cart yet. Explore our tactical collection!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-neutral-800"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Cart Items Table (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
                  <thead className="bg-neutral-100 text-neutral-700 font-bold uppercase border-b border-neutral-200">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Quantity</th>
                      <th className="p-4 text-right">Subtotal</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {cart.map((item, idx) => (
                      <tr key={`${item.product.id}-${item.selectedSize}-${idx}`} className="hover:bg-neutral-50">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-14 h-18 object-cover rounded bg-neutral-100 flex-shrink-0"
                          />
                          <div>
                            <Link
                              href={`/product/${item.product.slug}`}
                              className="font-bold text-neutral-900 hover:underline block text-xs sm:text-sm line-clamp-1"
                            >
                              {item.product.title}
                            </Link>
                            <span className="text-[11px] text-neutral-500 block mt-0.5">
                              Size: <strong>{item.selectedSize}</strong>
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-neutral-800">
                          ৳{item.product.price.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="inline-flex items-center border border-neutral-300 rounded overflow-hidden bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.selectedSize
                                )
                              }
                              className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 font-bold text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.selectedSize
                                )
                              }
                              className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right font-black text-black">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-black"
                >
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 pb-3 border-b border-neutral-200">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">৳{cartTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-black">
                      {shipping === 0 ? "FREE" : `৳${shipping}`}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount</span>
                      <span>-৳{discount}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-neutral-200 flex justify-between text-sm font-black text-black">
                    <span>Total</span>
                    <span>৳{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. WELCOME10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs outline-none focus:border-black"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`text-[11px] mt-1.5 font-medium ${discount > 0 ? "text-emerald-700" : "text-red-600"}`}>
                      {couponMessage}
                    </p>
                  )}
                </form>

                <Link
                  href="/checkout"
                  className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 block text-center"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
