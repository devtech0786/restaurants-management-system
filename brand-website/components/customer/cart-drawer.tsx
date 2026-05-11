"use client";

import { ShoppingBag, Trash2, Plus, Minus, X, ArrowRight, Sparkles, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { useTenant } from "@/lib/hooks/use-tenant";
import { formatCurrency } from "@/lib/utils";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/config";

export function CartDrawer() {
  const { cart, isOpen, closeCart, removeItem, updateQuantity, clearCart, subtotal } =
    useCartStore();
  const { data: tenant } = useTenant();

  const sub         = subtotal();
  const deliveryFee = sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total       = sub + deliveryFee;
  const totalItems  = cart?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const progress    = Math.min((sub / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const savings     = FREE_DELIVERY_THRESHOLD - sub;
  const freeDelivery = deliveryFee === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">

          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* ── Drawer ── */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md h-full flex flex-col shadow-2xl"
          >

            {/* ── Header ── */}
            <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center justify-between">

                {/* Left: icon + title */}
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center
                      justify-center shadow-brand">
                      <ShoppingBag size={22} className="text-white" />
                    </div>
                    {/* Item count badge */}
                    {totalItems > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white
                          border-2 border-brand-500 flex items-center justify-center"
                      >
                        <span className="text-[9px] font-black text-brand-600">{totalItems}</span>
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900 text-xl font-heading leading-none">
                      Your Cart
                    </h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {totalItems > 0
                        ? `${totalItems} item${totalItems !== 1 ? "s" : ""} ready to order`
                        : "Nothing added yet"}
                    </p>
                  </div>
                </div>

                {/* Right: clear + close */}
                <div className="flex items-center gap-2">
                  {totalItems > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-red-400 hover:text-red-600 font-semibold
                        transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50 border
                        border-red-100 hover:border-red-200"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={closeCart}
                    className="w-9 h-9 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center
                      justify-center transition-colors"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Free delivery progress bar */}
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    {!freeDelivery ? (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border
                        border-orange-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center justify-between mb-2.5">
                          <p className="text-xs font-semibold text-gray-600">
                            Add{" "}
                            <span className="text-brand-600 font-black text-sm">
                              {formatCurrency(savings)}
                            </span>{" "}
                            more for free delivery
                          </p>
                          <span className="text-base">🛵</span>
                        </div>
                        <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-brand-500 to-orange-400
                              rounded-full"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border
                        border-green-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-xl bg-green-100 flex items-center
                          justify-center shrink-0">
                          <Sparkles size={14} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-green-700">
                            Free delivery unlocked! 🎉
                          </p>
                          <p className="text-[10px] text-green-500 font-medium mt-0.5">
                            You're saving {formatCurrency(DELIVERY_FEE)} on delivery
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Items list ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 overscroll-contain
              bg-gray-50">

              {!cart?.items.length ? (

                /* ── Empty state ── */
                <div className="flex flex-col items-center justify-center h-full text-center
                  space-y-5 py-10">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-3xl bg-white border border-gray-100
                      shadow-sm flex items-center justify-center">
                      <ShoppingCart size={52} className="text-gray-200" />
                    </div>
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-white
                        border border-gray-100 shadow-md flex items-center justify-center text-xl"
                    >
                      🍔
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      className="absolute -bottom-3 -left-3 w-9 h-9 rounded-2xl bg-white
                        border border-gray-100 shadow-md flex items-center justify-center text-lg"
                    >
                      🍟
                    </motion.div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-black text-gray-900 text-xl font-heading">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-[210px] mx-auto">
                      Discover delicious items and add them to your cart
                    </p>
                  </div>

                  <button
                    onClick={closeCart}
                    className="px-7 py-3 rounded-2xl gradient-brand text-white text-sm
                      font-bold shadow-brand hover:opacity-90 transition-opacity"
                  >
                    Browse Menu
                  </button>
                </div>

              ) : (
                <AnimatePresence initial={false}>
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.22 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm
                        overflow-hidden"
                    >
                      {/* Accent strip + content */}
                      <div className="flex">

                        {/* Left brand accent bar */}
                        <div className="w-1 shrink-0 bg-gradient-to-b from-brand-400
                          to-brand-600 rounded-l-2xl" />

                        <div className="flex gap-4 p-4 flex-1 min-w-0">

                          {/* ── Image ── */}
                          {item.menuItem.imageUrl ? (
                            <Image
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 rounded-2xl object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br
                              from-brand-50 via-orange-50 to-amber-50 flex items-center
                              justify-center text-3xl shrink-0 border border-orange-100/60">
                              🍔
                            </div>
                          )}

                          {/* ── Details ── */}
                          <div className="flex-1 min-w-0">

                            {/* Name + delete */}
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-bold text-[15px] text-gray-900 leading-snug">
                                {item.menuItem.name}
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="w-8 h-8 rounded-xl flex items-center justify-center
                                  shrink-0 bg-red-50 text-red-400 hover:bg-red-100
                                  hover:text-red-600 transition-all active:scale-90 mt-0.5"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            {/* Variant + addon chips */}
                            {(Object.values(item.selectedVariants).length > 0 ||
                              item.selectedAddons.length > 0) && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {Object.values(item.selectedVariants).map((v) => (
                                  <span
                                    key={v.id}
                                    className="text-[10px] bg-gray-100 text-gray-500 px-2
                                      py-0.5 rounded-full font-semibold"
                                  >
                                    {v.label}
                                  </span>
                                ))}
                                {item.selectedAddons.map((a) => (
                                  <span
                                    key={a.id}
                                    className="text-[10px] bg-brand-50 text-brand-600 px-2
                                      py-0.5 rounded-full font-semibold"
                                  >
                                    +{a.label}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Price + stepper */}
                            <div className="flex items-end justify-between mt-3">
                              <div>
                                <p className="font-black text-brand-600 text-base leading-none">
                                  {formatCurrency(item.unitPrice * item.quantity)}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-[10px] text-gray-400 font-medium mt-1">
                                    {formatCurrency(item.unitPrice)} × {item.quantity}
                                  </p>
                                )}
                              </div>

                              {/* Stepper */}
                              <div className="flex items-center bg-gray-100 rounded-2xl p-1
                                gap-1.5">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center
                                    justify-center hover:shadow-md transition-all active:scale-90"
                                >
                                  <Minus size={11} strokeWidth={2.5} />
                                </button>
                                <span className="text-sm font-black w-6 text-center
                                  text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 rounded-xl gradient-brand text-white shadow-sm
                                    flex items-center justify-center hover:opacity-90
                                    transition-all active:scale-90"
                                >
                                  <Plus size={11} strokeWidth={2.5} />
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* ── Footer ── */}
            <AnimatePresence>
              {!!cart?.items.length && (
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  className="bg-white border-t border-gray-100 px-5 pt-4 pb-6 shrink-0 space-y-4"
                >
                  {/* Bill summary */}
                  <div className="bg-gray-50 rounded-2xl px-4 py-3.5 space-y-2.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal ({totalItems} item{totalItems !== 1 && "s"})</span>
                      <span className="font-semibold text-gray-700">
                        {formatCurrency(sub)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery fee</span>
                      {freeDelivery ? (
                        <span className="text-green-600 font-bold">FREE</span>
                      ) : (
                        <span className="font-semibold text-gray-700">
                          {formatCurrency(deliveryFee)}
                        </span>
                      )}
                    </div>
                    {freeDelivery && (
                      <div className="flex justify-between text-green-600 text-xs font-semibold">
                        <span>🎉 Delivery savings</span>
                        <span>−{formatCurrency(DELIVERY_FEE)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-black text-base
                      pt-2.5 border-t border-dashed border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-brand-600 text-xl">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-2.5">
                    <Link
                      href={`/${tenant?.slug}/cart`}
                      onClick={closeCart}
                      className="flex items-center justify-between w-full px-5 py-4 rounded-2xl
                        gradient-brand text-white font-bold text-sm shadow-brand
                        hover:opacity-95 transition-opacity active:scale-[0.98]"
                    >
                      <span className="text-base">Proceed to Checkout</span>
                      <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5
                        rounded-xl">
                        <span className="font-black">{formatCurrency(total)}</span>
                        <ArrowRight size={15} />
                      </div>
                    </Link>

                    <button
                      onClick={closeCart}
                      className="w-full py-3 rounded-2xl border border-gray-200 text-gray-500
                        font-semibold text-sm hover:bg-gray-50 hover:border-gray-300
                        transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
