import { apiClient } from "./client";
import type { Tenant, Branch } from "@/types";

export const tenantApi = {
  getBySlug: (slug: string) =>
    apiClient.get<Tenant>(`/tenants/${slug}`).then((r) => r.data),

  getBranches: (tenantId: string) =>
    apiClient
      .get<Branch[]>(`/tenants/${tenantId}/branches`)
      .then((r) => r.data),

  getNearestBranch: (tenantId: string, lat: number, lng: number) =>
    apiClient
      .get<Branch>(`/tenants/${tenantId}/branches/nearest`, {
        params: { lat, lng },
      })
      .then((r) => r.data),
};
