import { apiClient } from "./client";
import type { Category, MenuItem } from "@/types";

export const menuApi = {
  getCategories: (tenantId: string, branchId: string) =>
    apiClient
      .get<Category[]>(`/menu/categories`, { params: { tenantId, branchId } })
      .then((r) => r.data),

  getItem: (itemId: string) =>
    apiClient.get<MenuItem>(`/menu/items/${itemId}`).then((r) => r.data),

  searchItems: (tenantId: string, query: string) =>
    apiClient
      .get<MenuItem[]>(`/menu/search`, { params: { tenantId, q: query } })
      .then((r) => r.data),

  // Admin
  createCategory: (data: Partial<Category>) =>
    apiClient.post<Category>("/menu/categories", data).then((r) => r.data),

  updateCategory: (id: string, data: Partial<Category>) =>
    apiClient.patch<Category>(`/menu/categories/${id}`, data).then((r) => r.data),

  deleteCategory: (id: string) =>
    apiClient.delete(`/menu/categories/${id}`).then((r) => r.data),

  createItem: (data: Partial<MenuItem>) =>
    apiClient.post<MenuItem>("/menu/items", data).then((r) => r.data),

  updateItem: (id: string, data: Partial<MenuItem>) =>
    apiClient.patch<MenuItem>(`/menu/items/${id}`, data).then((r) => r.data),

  deleteItem: (id: string) =>
    apiClient.delete(`/menu/items/${id}`).then((r) => r.data),

  toggleAvailability: (id: string, isAvailable: boolean) =>
    apiClient
      .patch(`/menu/items/${id}/availability`, { isAvailable })
      .then((r) => r.data),
};
