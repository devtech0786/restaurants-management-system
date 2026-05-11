"use client";

import { useState } from "react";
import { AlertCircle, ChefHat, Eye } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { OrderItem } from "@/types/order";

interface OrderItemsCardProps {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export default function OrderItemsCard({
  items,
  subtotal,
  discount,
  deliveryFee,
  tax,
  total,
}: OrderItemsCardProps) {
  const [kitchenView, setKitchenView] = useState(false);

  const hasNotes = items.some((i) => i.specialNote);

  return (
    <Card>
      <CardHeader
        title="Order Items"
        description={`${items.length} item${items.length !== 1 ? "s" : ""} · ${items.reduce((s, i) => s + i.quantity, 0)} total qty`}
        action={
          hasNotes && (
            <button
              onClick={() => setKitchenView((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                kitchenView
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-300",
              )}
            >
              {kitchenView ? <Eye size={12} /> : <ChefHat size={12} />}
              {kitchenView ? "Normal View" : "Kitchen View"}
            </button>
          )
        }
      />

      {/* Kitchen view banner */}
      {kitchenView && (
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
          <ChefHat size={14} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs font-medium text-amber-700">
            Kitchen view — special instructions highlighted. Prices hidden.
          </p>
        </div>
      )}

      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border transition-colors",
              kitchenView ? "p-4" : "p-3",
              item.specialNote
                ? "border-amber-200 bg-amber-50/60"
                : "border-neutral-100 bg-neutral-50",
            )}
          >
            {/* Image — hide in kitchen view */}
            {!kitchenView && item.imageUrl && (
              <div className="size-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.menuItemName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Qty badge in kitchen view */}
            {kitchenView && (
              <div className="size-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg">
                {item.quantity}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={cn("font-semibold text-neutral-900", kitchenView ? "text-base" : "text-sm")}>
                    {item.menuItemName}
                  </p>
                  {item.variantName && (
                    <p className={cn("text-neutral-500 mt-0.5", kitchenView ? "text-sm" : "text-xs")}>
                      {item.variantName}
                    </p>
                  )}
                  {!kitchenView && (
                    <p className="text-[11px] text-neutral-400 mt-0.5">{item.categoryName}</p>
                  )}
                </div>

                {!kitchenView && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-neutral-900">${item.totalPrice.toFixed(2)}</p>
                    <p className="text-[11px] text-neutral-400">
                      ${item.unitPrice.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                )}
              </div>

              {item.specialNote && (
                <div className={cn("mt-2 flex items-start gap-1.5 rounded-lg px-3 py-2", kitchenView ? "bg-amber-100 border border-amber-300" : "bg-amber-50 border border-amber-200")}>
                  <AlertCircle size={kitchenView ? 14 : 11} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className={cn("text-amber-800 font-medium", kitchenView ? "text-sm" : "text-xs")}>
                    {item.specialNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Totals — hidden in kitchen view */}
      {!kitchenView && (
        <div className="mt-5 pt-5 border-t border-neutral-100 space-y-2.5">
          <TotalRow label="Subtotal"    value={subtotal} />
          {discount > 0      && <TotalRow label="Discount"    value={-discount}   green />}
          {deliveryFee > 0   && <TotalRow label="Delivery Fee" value={deliveryFee} />}
          <TotalRow label="Tax (10%)"   value={tax} muted />
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
            <span className="text-sm font-bold text-neutral-900">Grand Total</span>
            <span className="text-xl font-bold text-neutral-900">${total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </Card>
  );
}

function TotalRow({
  label, value, green = false, muted = false,
}: {
  label: string; value: number; green?: boolean; muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={cn("text-neutral-500", muted && "text-neutral-400")}>{label}</span>
      <span className={cn("font-medium", green ? "text-green-600" : "text-neutral-700")}>
        {value < 0 ? "-" : ""}${Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}
