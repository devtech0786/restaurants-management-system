"use client";

import Link from "next/link";
import { Package, RotateCcw, ChevronRight } from "lucide-react";
import { useMyOrders } from "@/lib/hooks/use-orders";
import { useTenant } from "@/lib/hooks/use-tenant";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Order } from "@/types";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { data: tenant } = useTenant();
  const { data, isLoading } = useMyOrders();
  const router = useRouter();

  const handleReorder = (order: Order) => {
    toast(`Visit the menu to reorder: ${order.items.map((i) => i.name).join(", ")}`, { icon: "🛒" });
    router.push(`/${tenant?.slug}`);
  };

  return (
    <div className="px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold font-heading">My Orders</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-20" />
            </Card>
          ))}
        </div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Your past orders will appear here"
          action={{ label: "Browse menu", onClick: () => router.push(`/${tenant?.slug}`) }}
        />
      ) : (
        <div className="space-y-3">
          {data.data.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              {/* Status bar */}
              <div className={`px-4 py-2 text-xs font-semibold flex items-center justify-between ${getOrderStatusColor(order.status)}`}>
                <span>{getOrderStatusLabel(order.status)}</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>

              {/* Order info */}
              <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-base text-gray-900">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.items.map((i) => i.name).join(", ")}
                    </p>
                  </div>
                  <p className="font-bold text-brand-600 text-base shrink-0">
                    {formatCurrency(order.total)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  {/* Reorder button */}
                  {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold hover:bg-brand-100 transition-colors"
                    >
                      <RotateCcw size={12} /> Reorder
                    </button>
                  )}

                  {/* Track button for active orders */}
                  {!["DELIVERED","CANCELLED"].includes(order.status) && (
                    <Link
                      href={`/${tenant?.slug}/orders/${order.id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full gradient-brand text-white text-xs font-semibold"
                    >
                      Track order <ChevronRight size={12} />
                    </Link>
                  )}

                  <Link
                    href={`/${tenant?.slug}/orders/${order.id}`}
                    className="ml-auto text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
                  >
                    Details <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
