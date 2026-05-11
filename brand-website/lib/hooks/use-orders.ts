"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi, type CreateOrderPayload } from "@/lib/api/orders";
import { useCartStore } from "@/lib/store/cart";
import toast from "react-hot-toast";

export function useOrder(orderId?: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersApi.getById(orderId!),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      const done = status === "DELIVERED" || status === "CANCELLED";
      return done ? false : 10000;
    },
  });
}

export function useMyOrders(page = 1) {
  return useQuery({
    queryKey: ["my-orders", page],
    queryFn: () => ordersApi.getMyOrders(page),
  });
}

export function useCreateOrder() {
  const clearCart = useCartStore((s) => s.clearCart);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.create(payload),
    onSuccess: (order) => {
      clearCart();
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success(`Order #${order.orderNumber} placed!`);
    },
    onError: () => toast.error("Failed to place order. Please try again."),
  });
}

export function useAdminOrders(params: {
  page?: number;
  status?: string;
  branchId?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => ordersApi.getAll(params),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status, note }: { orderId: string; status: string; note?: string }) =>
      ordersApi.updateStatus(orderId, status, note),
    onSuccess: (_, { orderId }) => {
      qc.invalidateQueries({ queryKey: ["order", orderId] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
  });
}
