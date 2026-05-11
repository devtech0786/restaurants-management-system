"use client";

import { CheckCircle, Circle, Clock } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { getOrderStatusLabel, formatDate } from "@/lib/utils";
import { useRealtimeOrder } from "@/lib/hooks/use-realtime-order";
import { cn } from "@/lib/utils";

const STATUS_STEPS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

interface OrderTrackerProps {
  order: Order;
}

export function OrderTracker({ order }: OrderTrackerProps) {
  const { status: realtimeStatus } = useRealtimeOrder(order.id);
  const currentStatus = realtimeStatus ?? order.status;

  if (currentStatus === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          ✕
        </div>
        <div>
          <p className="font-semibold text-red-700">Order Cancelled</p>
          <p className="text-xs text-red-500">
            {order.statusHistory.find((e) => e.status === "CANCELLED")?.note}
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="space-y-1">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const upcoming = idx > currentIdx;
        const event = order.statusHistory.find((e) => e.status === step);

        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  done && "bg-green-500",
                  active && "bg-brand-500 ring-4 ring-brand-100",
                  upcoming && "bg-gray-100"
                )}
              >
                {done ? (
                  <CheckCircle size={16} className="text-white" />
                ) : active ? (
                  <Clock size={14} className="text-white animate-pulse" />
                ) : (
                  <Circle size={14} className="text-gray-300" />
                )}
              </div>
              {idx < STATUS_STEPS.length - 1 && (
                <div className={cn("w-0.5 h-6 mt-1", done ? "bg-green-300" : "bg-gray-100")} />
              )}
            </div>
            <div className="pb-4">
              <p
                className={cn(
                  "text-sm font-medium",
                  active && "text-brand-600",
                  upcoming && "text-gray-400"
                )}
              >
                {getOrderStatusLabel(step)}
              </p>
              {event && (
                <p className="text-xs text-gray-400">{formatDate(event.timestamp)}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
