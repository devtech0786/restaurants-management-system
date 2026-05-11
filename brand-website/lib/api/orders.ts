import { apiClient } from "./client";
import type { Order, CartItem, DeliveryAddress, PaginatedResponse } from "@/types";

export interface CreateOrderPayload {
  tenantId: string;
  branchId: string;
  items: {
    menuItemId: string;
    quantity: number;
    variantOptionIds: string[];
    addonOptionIds: string[];
    specialInstructions?: string;
  }[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  couponCode?: string;
  notes?: string;
}

export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    apiClient.post<Order>("/orders", payload).then((r) => r.data),

  getById: (orderId: string) =>
    apiClient.get<Order>(`/orders/${orderId}`).then((r) => r.data),

  getMyOrders: (page = 1, limit = 10) =>
    apiClient
      .get<PaginatedResponse<Order>>("/orders/me", { params: { page, limit } })
      .then((r) => r.data),

  // Admin
  getAll: (params: {
    page?: number;
    limit?: number;
    status?: string;
    branchId?: string;
    search?: string;
  }) =>
    apiClient
      .get<PaginatedResponse<Order>>("/orders", { params })
      .then((r) => r.data),

  updateStatus: (orderId: string, status: string, note?: string) =>
    apiClient
      .patch<Order>(`/orders/${orderId}/status`, { status, note })
      .then((r) => r.data),

  applyCoupon: (code: string, tenantId: string, subtotal: number) =>
    apiClient
      .post("/coupons/validate", { code, tenantId, subtotal })
      .then((r) => r.data),
};
