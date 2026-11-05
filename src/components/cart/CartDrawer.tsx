"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal } = useApp();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2000;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const progressPercent = Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-black" />
            <h3 className="font-bold text-base text-neutral-900 uppercase tracking-wide">
              Shopping Cart ({cart.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-600 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="p-3 bg-amber-50/80 border-b border-amber-100 text-xs">
          {amountToFreeShipping > 0 ? (
            <p className="text-amber-900 font-medium">
              Add <span className="font-bold text-black">৳{amountToFreeShipping}</span> more to unlock <span className="font-bold text-emerald-700">FREE SHIPPING</span>!
            </p>
          ) : (
            <p className="text-emerald-800 font-bold flex items-center gap-1.5">
              🎉 Congratulations! You have unlocked Free Shipping!
            </p>
          )}
          <div className="w-full h-1.5 bg-amber-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-neutral-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-800 text-base">Your cart is empty!</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Explore our tactical wear and add your favorite styles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedSize}-${idx}`} className="py-3 flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-16 h-20 object-cover rounded bg-neutral-100 flex-shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Size: <span className="font-semibold text-black">{item.selectedSize}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                      className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-300 rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)
                        }
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)
                        }
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-sm text-black">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-neutral-600">Subtotal</span>
              <span className="font-black text-lg text-black">৳{cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Shipping & taxes calculated at checkout.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 text-center border border-black text-black hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                View Cart
              </Link>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 text-center bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                Checkout <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
