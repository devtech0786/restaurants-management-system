import { apiClient } from "./client";
import type { DashboardStats, Branch } from "@/types";

export const adminApi = {
  getStats: (branchId?: string) =>
    apiClient
      .get<DashboardStats>("/admin/stats", { params: { branchId } })
      .then((r) => r.data),

  createBranch: (data: Partial<Branch>) =>
    apiClient.post<Branch>("/admin/branches", data).then((r) => r.data),

  updateBranch: (id: string, data: Partial<Branch>) =>
    apiClient.patch<Branch>(`/admin/branches/${id}`, data).then((r) => r.data),

  deleteBranch: (id: string) =>
    apiClient.delete(`/admin/branches/${id}`).then((r) => r.data),

  updateBranding: (data: {
    primaryColor?: string;
    logoUrl?: string;
    coverUrl?: string;
    description?: string;
  }) => apiClient.patch("/admin/branding", data).then((r) => r.data),

  uploadAsset: (file: File, type: "logo" | "cover" | "menu-item") => {
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);
    return apiClient
      .post<{ url: string }>("/admin/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};
