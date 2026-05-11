"use client";

import { useQuery } from "@tanstack/react-query";
import { tenantApi } from "@/lib/api/tenant";
import { useParams } from "next/navigation";

export function useTenant() {
  const params = useParams<{ tenant: string }>();
  const slug = params?.tenant ?? "";

  return useQuery({
    queryKey: ["tenant", slug],
    queryFn: () => tenantApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBranches(tenantId?: string) {
  return useQuery({
    queryKey: ["branches", tenantId],
    queryFn: () => tenantApi.getBranches(tenantId!),
    enabled: !!tenantId,
  });
}
