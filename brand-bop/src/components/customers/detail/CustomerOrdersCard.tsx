"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronRight, UtensilsCrossed, Truck } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

const PAGE_SIZE = 5;

const TYPE_META = {
  "dine-in": { Icon: UtensilsCrossed, label: "Dine-in",  cls: "text-violet-700 bg-violet-50" },
  takeaway:  { Icon: ShoppingBag,     label: "Takeaway", cls: "text-blue-700   bg-blue-50"   },
  delivery:  { Icon: Truck,           label: "Delivery", cls: "text-orange-700 bg-orange-50" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface CustomerOrdersCardProps {
  orders: Order[];
}

export default function CustomerOrdersCard({ orders }: CustomerOrdersCardProps) {
  const [page, setPage] = useState(1);
  const total     = orders.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated  = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (total === 0) {
    return (
      <Card>
        <CardHeader title="Order History" description="All past orders for this customer." />
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="size-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
            <ShoppingBag size={24} className="text-neutral-300" />
          </div>
          <p className="text-sm text-neutral-500">No orders placed yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none">
      <div className="p-6 pb-0">
        <CardHeader
          title="Order History"
          description={`${total} order${total !== 1 ? "s" : ""} placed`}
        />
      </div>

      <div className="divide-y divide-neutral-100">
        {paginated.map((order) => {
          const meta = TYPE_META[order.type];
          const TypeIcon = meta.Icon;
          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors group"
            >
              {/* Type icon */}
              <div className={cn("size-9 rounded-xl flex items-center justify-center flex-shrink-0", meta.cls)}>
                <TypeIcon size={15} />
              </div>

              {/* Order info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-neutral-900 font-mono">
                    #{order.orderNumber.split("-").slice(-1)[0]}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {fmtDate(order.placedAt)}
                  {order.franchiseName.split("—")[1]
                    ? ` · ${order.franchiseName.split("—")[1].trim()}`
                    : ""}
                </p>
              </div>

              {/* Total */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-neutral-900">${order.total.toFixed(2)}</p>
                <p className="text-[11px] text-neutral-400 capitalize mt-0.5">
                  {order.paymentStatus.replace("_", " ")}
                </p>
              </div>

              <ChevronRight size={14} className="text-neutral-300 group-hover:text-brand-500 transition-colors flex-shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-100">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-xs text-neutral-500 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-neutral-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-xs text-neutral-500 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </Card>
  );
}
