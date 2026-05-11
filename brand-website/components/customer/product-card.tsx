"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Clock, Flame } from "lucide-react";
import type { MenuItem } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { DIETARY_TAGS } from "@/lib/constants/dietary";
import { ProductConfigurator } from "./product-configurator";

interface ProductCardProps {
  item:      MenuItem;
  allItems?: MenuItem[];
  compact?:  boolean;
}

/* ─── Root ───────────────────────────────────────────────────────────────── */
export function ProductCard({ item, allItems = [], compact = false }: ProductCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);

  const dietary = item.tags?.filter((t) => DIETARY_TAGS[t]) ?? [];
  const open    = () => item.isAvailable && setDetailOpen(true);

  return (
    <>
      <Card item={item} dietary={dietary} compact={compact} onOpen={open} />

      <ProductConfigurator
        item={item}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onAdded={() => setDetailOpen(false)}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Single card — image on top, content below (KFC / Chowking style)          */
function Card({
  item,
  dietary,
  compact,
  onOpen,
}: {
  item:    MenuItem;
  dietary: string[];
  compact: boolean;
  onOpen:  () => void;
}) {
  const na = !item.isAvailable;

  return (
    <div
      onClick={onOpen}
      className={cn(
        "group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden cursor-pointer select-none flex flex-col",
        "shadow-[0_2px_10px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)]",
        "border border-gray-100 dark:border-gray-800",
        "hover:shadow-[0_12px_36px_rgba(0,0,0,0.13)] dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)] hover:-translate-y-1",
        "transition-all duration-300",
        na && "opacity-60 pointer-events-none",
      )}
    >
      {/* ══ IMAGE ══════════════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0"
        style={{ height: compact ? 160 : 190 }}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-[1.06] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500
            to-orange-500 flex items-center justify-center text-6xl">
            🍗
          </div>
        )}

        {/* ── Top-left: Bestseller badge ── */}
        {item.isFeatured && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-brand-600
            px-2.5 py-1 rounded-full shadow-md">
            <Flame size={10} className="text-white" />
            <span className="text-[10px] font-black text-white uppercase tracking-wide">
              Bestseller
            </span>
          </div>
        )}

        {/* ── Top-right: Prep time badge ── */}
        {item.preparationTime && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/55
            backdrop-blur-sm px-2 py-1 rounded-full">
            <Clock size={9} className="text-white/80" />
            <span className="text-[10px] font-semibold text-white">
              {item.preparationTime}m
            </span>
          </div>
        )}

        {/* ── Bottom gradient fade ── */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t
          from-black/30 to-transparent pointer-events-none" />

        {/* ── Sold out overlay ── */}
        {na && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="text-sm font-black text-white uppercase tracking-[0.12em]
              border border-white/50 px-4 py-1.5 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ══ CONTENT ════════════════════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 px-3.5 pt-3 pb-3.5">

        {/* Name */}
        <h3 className={cn(
          "font-black text-gray-900 dark:text-white leading-snug mb-1",
          compact ? "text-[13px] line-clamp-2" : "text-[14px] line-clamp-2",
        )}>
          {item.name}
        </h3>

        {/* Description — only on non-compact */}
        {!compact && item.description && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed mb-2">
            {item.description}
          </p>
        )}

        {/* Dietary chips */}
        {dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {dietary.slice(0, compact ? 1 : 3).map((t) => (
              <span
                key={t}
                className={cn(
                  "font-bold rounded-full",
                  compact ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5",
                  DIETARY_TAGS[t].color,
                )}
              >
                {DIETARY_TAGS[t].emoji} {DIETARY_TAGS[t].label}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Divider ── */}
        <div className="h-px bg-gray-100 dark:bg-gray-800 my-2.5" />

        {/* ── Price + Add button ── */}
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            "font-black text-brand-600 leading-none",
            compact ? "text-[15px]" : "text-base",
          )}>
            {formatCurrency(item.price)}
          </span>

          {na ? (
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-500 px-2.5 py-1.5 rounded-lg">
              Unavailable
            </span>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(); }}
              className={cn(
                "flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white",
                "font-black rounded-xl transition-all active:scale-95 shadow-sm",
                "hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]",
                compact
                  ? "text-[11px] px-3 py-2"
                  : "text-[11px] px-3.5 py-2.5",
              )}
            >
              <Plus size={13} strokeWidth={2.5} />
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
