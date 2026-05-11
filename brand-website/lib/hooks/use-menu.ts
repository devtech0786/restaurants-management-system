"use client";

import { useQuery } from "@tanstack/react-query";
import { menuApi } from "@/lib/api/menu";

export function useMenu(tenantId?: string, branchId?: string) {
  return useQuery({
    queryKey: ["menu", tenantId, branchId],
    queryFn: () => menuApi.getCategories(tenantId!, branchId!),
    enabled: !!tenantId && !!branchId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMenuItem(itemId?: string) {
  return useQuery({
    queryKey: ["menu-item", itemId],
    queryFn: () => menuApi.getItem(itemId!),
    enabled: !!itemId,
  });
}

export function useMenuSearch(tenantId?: string, query?: string) {
  return useQuery({
    queryKey: ["menu-search", tenantId, query],
    queryFn: () => menuApi.searchItems(tenantId!, query!),
    enabled: !!tenantId && !!query && query.length > 1,
  });
}
