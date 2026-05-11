"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, ChevronLeft, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { useTenant } from "@/lib/hooks/use-tenant";
import { useAuthStore } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/config";

export default function CartPage() {
  const params = useParams<{ tenant: string }>();
  const router = useRouter();
  const { data: tenant } = useTenant();
  const { cart, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const { user, openModal } = useAuthStore();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const sub = subtotal();
  const deliveryFee = sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const discount = couponApplied ? Math.round(sub * 0.1) : 0;
  const total = sub + deliveryFee - discount;
  const savings = FREE_DELIVERY_THRESHOLD - sub;
  const totalItems = cart?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "FASTFO10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setCouponApplied(false);
    }
  };

  const handleCheckout = () => {
    if (!user) { openModal(); return; }
    router.push(`/${params.tenant}/checkout`);
  };

  if (!cart?.items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/${params.tenant}`} className="p-1.5 rounded-full hover:bg-gray-100">
            <ChevronLeft size={22} />
          </Link>
          <h1 className="text-xl font-bold font-heading">Your Cart</h1>
        </div>
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add something delicious from the menu"
          action={{ label: "Browse menu", onClick: () => router.push(`/${params.tenant}`) }}
        />
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Page header */}
      <div className="sticky top-14 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-12 flex items-center gap-3">
          <Link href={`/${params.tenant}`} className="p-1.5 rounded-full hover:bg-gray-100">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-bold text-lg font-heading">Your Cart</h1>
          <span className="text-xs text-gray-400 font-medium">({totalItems} item{totalItems !== 1 && "s"})</span>
          <button onClick={clearCart} className="ml-auto text-xs text-red-400 hover:text-red-600 font-medium">
            Clear all
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        {/* ── Desktop 2-column layout ── */}
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8 lg:items-start">

          {/* ── LEFT: Cart items ── */}
          <div className="space-y-4">

            {/* Free delivery progress */}
            {sub < FREE_DELIVERY_THRESHOLD ? (
              <div className="bg-accent-500/10 border border-accent-500/30 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-800 mb-2">
                  🎉 Add <span className="text-brand-600 font-bold">{formatCurrency(savings)}</span> more for free delivery!
                </p>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-500 rounded-full transition-all"
                    style={{ width: `${Math.min((sub / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-sm font-semibold text-green-700">
                🎉 You've unlocked free delivery!
              </div>
            )}

            {/* Items list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-50">
                <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <ShoppingCart size={15} className="text-brand-500" />
                  Order Items
                </p>
              </div>

              <div className="divide-y divide-gray-50">
                <AnimatePresence>
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 p-4 lg:p-5"
                    >
                      {item.menuItem.imageUrl ? (
                        <Image
                          src={item.menuItem.imageUrl}
                          alt={item.menuItem.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
                          🍔
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm lg:text-base leading-snug">{item.menuItem.name}</p>
                        {Object.values(item.selectedVariants).length > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {Object.values(item.selectedVariants).map((v) => v.label).join(" · ")}
                          </p>
                        )}
                        {item.selectedAddons.length > 0 && (
                          <p className="text-xs text-gray-400">
                            +{item.selectedAddons.map((a) => a.label).join(", ")}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <p className="text-xs text-gray-400 italic mt-0.5">"{item.specialInstructions}"</p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <p className="font-bold text-brand-600 text-sm lg:text-base">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2.5 py-1.5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-5 h-5 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md transition-shadow"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-5 h-5 rounded-full gradient-brand text-white shadow flex items-center justify-center hover:opacity-90 transition-opacity"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Add more items link */}
            <Link
              href={`/${params.tenant}`}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-400 hover:border-brand-300 hover:text-brand-500 transition-colors"
            >
              + Add more items
            </Link>
          </div>

          {/* ── RIGHT: Sticky bill summary ── */}
          <div className="mt-4 lg:mt-0 lg:sticky lg:top-28 space-y-4">

            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Tag size={15} className="text-brand-500" /> Coupon Code
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Try FASTFO10"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setCouponError(""); setCouponApplied(false); }}
                  error={couponError}
                  className="flex-1"
                />
                <Button variant="secondary" onClick={applyCoupon}>Apply</Button>
              </div>
              {couponApplied && (
                <p className="text-xs text-green-600 font-medium mt-1.5">✓ 10% discount applied!</p>
              )}
            </div>

            {/* Bill summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <p className="font-bold text-base mb-4">Bill Summary</p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({totalItems} item{totalItems !== 1 && "s"})</span>
                  <span className="font-medium text-gray-700">{formatCurrency(sub)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span className="font-medium text-gray-700">{formatCurrency(deliveryFee)}</span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount (FASTFO10)</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-brand-600 text-lg">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button fullWidth size="lg" onClick={handleCheckout} className="shadow-brand mt-5">
                {user ? "Proceed to Checkout" : "Sign in to Checkout"}
                <ArrowRight size={18} />
              </Button>

              <p className="text-[11px] text-center text-gray-400 mt-3">
                Taxes & fees included where applicable
              </p>
            </div>

            {/* Trust signals */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-around text-center">
              {[
                { emoji: "🛵", label: "Fast delivery" },
                { emoji: "🔒", label: "Secure payment" },
                { emoji: "↩️", label: "Easy returns" },
              ].map(({ emoji, label }) => (
                <div key={label}>
                  <p className="text-xl mb-1">{emoji}</p>
                  <p className="text-[11px] font-medium text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
