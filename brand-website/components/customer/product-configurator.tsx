"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, Check, ShoppingCart, Clock, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatCurrency, calcItemPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { Textarea } from "@/components/ui/input";
import type { MenuItem, VariantOption, AddonOption } from "@/types";

interface ConfiguratorProps {
  item:     MenuItem;
  isOpen:   boolean;
  onClose:  () => void;
  onAdded?: (name: string) => void;
}

/* ── lock body scroll while open ─────────────────────────────────────────── */
function useLockBody(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}

/* ── Quantity stepper ────────────────────────────────────────────────────── */
function Stepper({ qty, onChange }: { qty: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-0 bg-gray-100 rounded-2xl p-1">
      <button
        onClick={() => onChange(Math.max(1, qty - 1))}
        disabled={qty <= 1}
        className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center
          text-gray-600 hover:text-gray-900 disabled:opacity-30 transition-all"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span className="w-10 text-center font-black text-sm text-gray-900">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center
          text-white shadow-sm hover:bg-brand-600 transition-all active:scale-95"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export function ProductConfigurator({ item, isOpen, onClose, onAdded }: ConfiguratorProps) {
  const addItem = useCartStore((s) => s.addItem);

  const [qty,          setQty]          = useState(1);
  const [variants,     setVariants]     = useState<Record<string, VariantOption>>({});
  const [addons,       setAddons]       = useState<AddonOption[]>([]);
  const [instructions, setInstructions] = useState("");
  const [added,        setAdded]        = useState(false);

  useLockBody(isOpen);

  const unit  = calcItemPrice(item.price, variants, addons);
  const total = unit * qty;

  const selectVariant = (vid: string, opt: VariantOption) =>
    setVariants((p) => ({ ...p, [vid]: opt }));

  const toggleAddon = (opt: AddonOption) =>
    setAddons((p) =>
      p.find((a) => a.id === opt.id) ? p.filter((a) => a.id !== opt.id) : [...p, opt],
    );

  const handleAdd = () => {
    if (added) return;
    addItem(item, qty, variants, addons, instructions);
    setAdded(true);
    onAdded?.(item.name);
    setTimeout(() => {
      onClose();
      setQty(1); setVariants({}); setAddons([]); setInstructions(""); setAdded(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal — centered */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="pointer-events-auto w-full max-w-lg bg-white rounded-3xl shadow-2xl
                flex flex-col overflow-hidden"
              style={{ maxHeight: "88vh" }}
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >

              {/* ── Hero image ── */}
              <div className="relative flex-shrink-0 h-56 bg-gray-900 overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-orange-400
                    flex items-center justify-center text-8xl select-none">
                    🍔
                  </div>
                )}

                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {item.tags?.includes("bestseller") && (
                    <span className="flex items-center gap-1 bg-brand-500 text-white text-[10px]
                      font-bold px-2.5 py-1 rounded-full shadow-lg">
                      <Flame size={9} /> Bestseller
                    </span>
                  )}
                  {item.preparationTime && (
                    <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white
                      text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      <Clock size={9} /> {item.preparationTime} min
                    </span>
                  )}
                </div>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm
                    rounded-full flex items-center justify-center text-white
                    hover:bg-black/60 transition-colors"
                >
                  <X size={16} />
                </button>

                {/* Item name + price overlay */}
                <div className="absolute bottom-4 left-5 right-5">
                  <h2 className="text-white font-black text-xl font-heading leading-tight drop-shadow-md">
                    {item.name}
                  </h2>
                  <p className="text-white/90 font-bold text-base mt-0.5">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>

              {/* ── Scrollable body ── */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="px-5 py-5 space-y-6">

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Variants */}
                  {item.variants.map((v) => (
                    <div key={v.id}>
                      <SectionLabel title={v.name} />
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {v.options.map((opt) => {
                          const sel = variants[v.id]?.id === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => selectVariant(v.id, opt)}
                              className={cn(
                                "relative flex flex-col items-center justify-center py-3 px-2 rounded-2xl",
                                "border-2 text-center transition-all duration-150",
                                sel
                                  ? "border-brand-500 bg-brand-50 shadow-sm shadow-brand-500/20"
                                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
                              )}
                            >
                              {sel && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-500
                                  rounded-full flex items-center justify-center">
                                  <Check size={9} className="text-white" strokeWidth={3} />
                                </span>
                              )}
                              <span className={cn(
                                "text-sm font-bold leading-tight",
                                sel ? "text-brand-700" : "text-gray-800",
                              )}>
                                {opt.label}
                              </span>
                              {opt.priceModifier > 0 && (
                                <span className={cn(
                                  "text-[10px] font-semibold mt-0.5",
                                  sel ? "text-brand-500" : "text-gray-400",
                                )}>
                                  +{formatCurrency(opt.priceModifier)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Addons */}
                  {item.addons.map((addon) => (
                    <div key={addon.id}>
                      <SectionLabel
                        title={addon.name}
                        badge={addon.isRequired ? "Required" : "Optional"}
                        badgeColor={addon.isRequired ? "red" : "gray"}
                      />
                      <div className="mt-3 space-y-2">
                        {addon.options.map((opt) => {
                          const sel = addons.some((a) => a.id === opt.id);
                          return (
                            <button
                              key={opt.id}
                              onClick={() => toggleAddon(opt)}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-3.5",
                                "rounded-2xl border-2 text-left transition-all duration-150",
                                sel
                                  ? "border-brand-500 bg-brand-50"
                                  : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50",
                              )}
                            >
                              <div className="flex items-center gap-3">
                                {/* Custom checkbox */}
                                <div className={cn(
                                  "w-5 h-5 rounded-md border-2 flex items-center justify-center",
                                  "flex-shrink-0 transition-all",
                                  sel
                                    ? "bg-brand-500 border-brand-500"
                                    : "border-gray-300 bg-white",
                                )}>
                                  {sel && <Check size={11} className="text-white" strokeWidth={3} />}
                                </div>
                                <span className={cn(
                                  "text-sm font-medium",
                                  sel ? "text-brand-800" : "text-gray-700",
                                )}>
                                  {opt.label}
                                </span>
                              </div>
                              {opt.price > 0 && (
                                <span className={cn(
                                  "text-xs font-bold flex-shrink-0",
                                  sel ? "text-brand-600" : "text-gray-400",
                                )}>
                                  +{formatCurrency(opt.price)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Special instructions */}
                  <div>
                    <SectionLabel title="Special Instructions" badge="Optional" badgeColor="gray" />
                    <div className="mt-3">
                      <Textarea
                        placeholder="e.g. No onions, extra sauce on the side…"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Sticky footer CTA ── */}
              <div className="flex-shrink-0 px-5 pb-6 pt-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-4">
                  <Stepper qty={qty} onChange={setQty} />

                  <button
                    onClick={handleAdd}
                    disabled={added}
                    className={cn(
                      "flex-1 flex items-center justify-between px-5 py-3.5 rounded-2xl",
                      "font-bold text-sm text-white transition-all duration-300 shadow-lg",
                      added
                        ? "bg-emerald-500 shadow-emerald-500/30 scale-[0.98]"
                        : "bg-brand-500 hover:bg-brand-600 shadow-brand-500/30 active:scale-[0.98]",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {added ? (
                        <>
                          <Check size={16} strokeWidth={3} />
                          Added!
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          Add to Cart
                        </>
                      )}
                    </span>
                    <span className="font-black text-base">{formatCurrency(total)}</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Section label ───────────────────────────────────────────────────────── */
function SectionLabel({
  title,
  badge,
  badgeColor = "gray",
}: {
  title:       string;
  badge?:      string;
  badgeColor?: "red" | "gray";
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-4 rounded-full bg-brand-500 flex-shrink-0" />
      <span className="text-sm font-black text-gray-900 uppercase tracking-wide">{title}</span>
      {badge && (
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full",
          badgeColor === "red"
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-500",
        )}>
          {badge}
        </span>
      )}
    </div>
  );
}
