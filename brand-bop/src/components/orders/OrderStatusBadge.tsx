import { cn } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/types/order";

/* ─── Order Status ─────────────────────────────────────────── */

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  dot: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending:          { label: "Pending",          bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500"  },
  confirmed:        { label: "Confirmed",        bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"   },
  preparing:        { label: "Preparing",        bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  ready:            { label: "Ready",            bg: "bg-cyan-50",   text: "text-cyan-700",   dot: "bg-cyan-500"   },
  out_for_delivery: { label: "Out for Delivery", bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  completed:        { label: "Completed",        bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  cancelled:        { label: "Cancelled",        bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500"    },
  refunded:         { label: "Refunded",         bg: "bg-neutral-100", text: "text-neutral-600", dot: "bg-neutral-400" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export default function OrderStatusBadge({ status, size = "sm" }: OrderStatusBadgeProps) {
  const cfg = ORDER_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border",
        cfg.bg, cfg.text,
        size === "sm" ? "px-2 py-0.5 text-xs border-transparent" : "px-3 py-1 text-sm border-transparent",
      )}
    >
      <span className={cn("rounded-full flex-shrink-0", cfg.dot, size === "sm" ? "size-1.5" : "size-2")} aria-hidden />
      {cfg.label}
    </span>
  );
}

/* ─── Payment Status ───────────────────────────────────────── */

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  paid:          { label: "Paid",          className: "bg-green-50 text-green-700 border-green-200" },
  unpaid:        { label: "Unpaid",        className: "bg-red-50 text-red-700 border-red-200"       },
  refunded:      { label: "Refunded",      className: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  partially_paid:{ label: "Partial",       className: "bg-amber-50 text-amber-700 border-amber-200" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", cfg.className)}>
      {cfg.label}
    </span>
  );
}
