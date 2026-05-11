"use client";

import Link from "next/link";
import { ArrowLeft, Printer, AlertCircle, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderTypeBadge from "@/components/orders/OrderTypeBadge";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

const ADVANCE_LABEL: Partial<Record<OrderStatus, string>> = {
  pending:          "Confirm Order",
  confirmed:        "Send to Kitchen",
  preparing:        "Mark as Ready",
  ready:            "Out for Delivery",
  out_for_delivery: "Mark as Delivered",
};

interface OrderActionBarProps {
  order: Order;
  advancing: boolean;
  onAdvance: () => void;
  onCancel: () => void;
  onPrintReceipt: () => void;
  onPrintKitchen: () => void;
}

export default function OrderActionBar({
  order,
  advancing,
  onAdvance,
  onCancel,
  onPrintReceipt,
  onPrintKitchen,
}: OrderActionBarProps) {
  const isFinal   = ["completed", "cancelled", "refunded"].includes(order.status);
  const advLabel  = ADVANCE_LABEL[order.status];

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Left — breadcrumb + order info */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/orders"
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={14} />
            Orders
          </Link>
          <ChevronRight size={14} className="text-neutral-300 flex-shrink-0" />
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-sm font-semibold text-neutral-900 font-mono truncate">
              {order.orderNumber}
            </span>
            {order.isPriority && (
              <span
                title="Priority order"
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full flex-shrink-0"
              >
                <AlertCircle size={10} />
                Priority
              </span>
            )}
            <span className="hidden sm:block flex-shrink-0">
              <OrderTypeBadge type={order.type} />
            </span>
            <span className="hidden md:block flex-shrink-0">
              <OrderStatusBadge status={order.status} />
            </span>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Print dropdown */}
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Printer size={13} />}
              onClick={onPrintReceipt}
            >
              Receipt
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onPrintKitchen}
              className="hidden md:inline-flex"
            >
              Kitchen Ticket
            </Button>
          </div>

          {!isFinal && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-red-600 hover:bg-red-50"
            >
              Cancel
            </Button>
          )}

          {!isFinal && advLabel && (
            <Button
              variant="primary"
              size="sm"
              loading={advancing}
              onClick={onAdvance}
              rightIcon={<ChevronRight size={14} />}
            >
              {advLabel}
            </Button>
          )}

          {order.status === "completed" && (
            <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
              Order Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
