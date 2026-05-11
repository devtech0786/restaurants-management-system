export type FranchiseStatus = "active" | "inactive" | "pending" | "suspended";

export interface Franchise {
  id: string;
  name: string;
  code: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: FranchiseStatus;
  openedAt: string;
  monthlyRevenue: number;
  tableCount: number;
  staffCount: number;
}

export interface FranchiseFilters {
  search: string;
  status: FranchiseStatus | "all";
  country: string;
}
