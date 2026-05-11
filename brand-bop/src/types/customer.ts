export type CustomerTier = "new" | "regular" | "vip";

export interface CustomerNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  tier: CustomerTier;
  preferredBranchId?: string;
  preferredBranch?: string;
  joinedAt: string;
  lastOrderAt?: string;
  totalOrders: number;
  lifetimeValue: number;
  avgOrderValue: number;
  favoriteItems: string[];
  dietaryNotes?: string;
  isBlocked: boolean;
  internalNotes: CustomerNote[];
}
