"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { DIETARY_TAGS } from "@/lib/constants/dietary";
import { ItemDetailModal } from "./item-detail-modal";

interface MenuItemCardProps {
  item:     MenuItem;
  compact?: boolean;
}

export function MenuItemCard({ item, compact = false }: MenuItemCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);

  const dietary = item.tags?.filter((t) => DIETARY_TAGS[t]) ?? [];
  const open    = () => item.isAvailable && setDetailOpen(true);

  // ── Compact card (used in horizontal featured scroll) ──────────────────
  if (compact) {
    return (
      <>
        <div
          onClick={open}
          className={`flex flex-col bg-white rounded-2xl border border-gray-100 shadow-card cursor-pointer hover:shadow-md transition-all active:scale-[0.99] overflow-hidden ${
            !item.isAvailable && "opacity-50 pointer-events-none"
          }`}
        >
          <div className="relative">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.name} width={176} height={128} className="w-full h-32 object-cover" />
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-4xl">🍔</div>
            )}
            {item.isFeatured && (
              <span className="absolute top-2 left-2 text-[10px] font-bold bg-accent-500 text-gray-900 px-1.5 py-0.5 rounded-full">
                🔥 Popular
              </span>
            )}
            <div className="absolute bottom-2 right-2 w-7 h-7 gradient-brand rounded-full flex items-center justify-center shadow-brand">
              <Plus size={13} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="p-3">
            <p className="font-semibold text-xs leading-snug line-clamp-2">{item.name}</p>
            <p className="text-sm font-bold text-brand-600 mt-1">{formatCurrency(item.price)}</p>
          </div>
        </div>
        <ItemDetailModal item={item} isOpen={detailOpen} onClose={() => setDetailOpen(false)} onAdded={() => setDetailOpen(false)} />
      </>
    );
  }

  // ── Default horizontal card ──────────────────────────────────────────────
  return (
    <>
      <div
        onClick={open}
        className={`flex gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-card cursor-pointer hover:shadow-md transition-all active:scale-[0.99] ${
          !item.isAvailable && "opacity-50 pointer-events-none"
        }`}
      >
        {/* Text */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-2 mb-1">
              <h3 className="font-semibold text-sm text-gray-900 leading-snug">{item.name}</h3>
              {item.isFeatured && (
                <span className="shrink-0 text-xs font-bold bg-accent-500 text-gray-900 px-1.5 py-0.5 rounded-full">
                  🔥 Popular
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.description}</p>
            )}
          </div>

          {/* Price + dietary tags */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-brand-600">{formatCurrency(item.price)}</span>
            {dietary.map((tag) => {
              const d = DIETARY_TAGS[tag];
              return (
                <span key={tag} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${d.color}`}>
                  {d.emoji} {d.label}
                </span>
              );
            })}
            {!item.isAvailable && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                Unavailable
              </span>
            )}
          </div>
        </div>

        {/* Image + add btn */}
        <div className="relative shrink-0">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl">
              🍔
            </div>
          )}
          {item.isAvailable && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 gradient-brand rounded-full flex items-center justify-center shadow-brand">
              <Plus size={15} className="text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>

      <ItemDetailModal
        item={item}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onAdded={() => setDetailOpen(false)}
      />
    </>
  );
}
