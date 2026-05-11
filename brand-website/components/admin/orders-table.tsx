"use client";

import { useState } from "react";
import { Eye, ChevronDown } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { useUpdateOrderStatus } from "@/lib/hooks/use-orders";
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};

interface OrdersTableProps {
  orders: Order[];
  onView?: (order: Order) => void;
}

export function OrdersTable({ orders, onView }: OrdersTableProps) {
  const { mutate: updateStatus } = useUpdateOrderStatus();

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            {["Order", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50">
          {orders.map((order) => {
            const nextStatus = NEXT_STATUS[order.status];
            return (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  #{order.orderNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {order.deliveryAddress.street}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 && "s"}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getOrderStatusColor(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {onView && (
                      <Button size="sm" variant="ghost" onClick={() => onView(order)}>
                        <Eye size={14} />
                      </Button>
                    )}
                    {nextStatus && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateStatus({ orderId: order.id, status: nextStatus })}
                      >
                        → {getOrderStatusLabel(nextStatus)}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
