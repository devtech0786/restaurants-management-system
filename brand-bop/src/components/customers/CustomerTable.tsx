"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, SlidersHorizontal, Users, X, RotateCcw,
  Eye, ArrowUp, ArrowDown, ChevronsUpDown,
  ShieldOff, Shield,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import CustomerTierBadge from "./CustomerTierBadge";
import type { Customer, CustomerTier } from "@/types/customer";

const PAGE_SIZE = 10;

/* ── Filter options ──────────────────────────────────────────── */

const TIER_OPTIONS = [
  { value: "all",     label: "All Tiers"  },
  { value: "new",     label: "New"        },
  { value: "regular", label: "Regular"    },
  { value: "vip",     label: "VIP"        },
];

const STATUS_OPTIONS = [
  { value: "all",     label: "All Status" },
  { value: "active",  label: "Active"     },
  { value: "blocked", label: "Blocked"    },
];

/* ── Avatar colors ───────────────────────────────────────────── */

const AVATAR_PALETTES = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100   text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100  text-amber-700",
  "bg-rose-100   text-rose-700",
  "bg-cyan-100   text-cyan-700",
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100   text-pink-700",
];

function avatarCls(name: string) {
  return AVATAR_PALETTES[(name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_PALETTES.length];
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

/* ── Time helpers ────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function relativeTime(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const d = Math.floor(s / 86400);
  if (d < 30)    return `${d}d ago`;
  if (d < 365)   return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

/* ── Sort ────────────────────────────────────────────────────── */

type SortKey = "name" | "totalOrders" | "lifetimeValue" | "lastOrderAt" | "joinedAt";
type SortDir = "asc" | "desc";

/* ── Component ───────────────────────────────────────────────── */

interface CustomerTableProps {
  initialCustomers: Customer[];
  franchises: { id: string; name: string }[];
}

export default function CustomerTable({ initialCustomers, franchises }: CustomerTableProps) {
  const router = useRouter();

  const [customers, setCustomers]   = useState<Customer[]>(initialCustomers);
  const [search, setSearch]         = useState("");
  const [tierFilter, setTier]       = useState("all");
  const [branchFilter, setBranch]   = useState("all");
  const [statusFilter, setStatus]   = useState("all");
  const [sortKey, setSortKey]       = useState<SortKey>("lastOrderAt");
  const [sortDir, setSortDir]       = useState<SortDir>("desc");
  const [page, setPage]             = useState(1);

  const branchOptions = [
    { value: "all", label: "All Branches" },
    ...franchises.map((f) => ({
      value: f.id,
      label: f.name.split("—")[1]?.trim() ?? f.name,
    })),
  ];

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const base = customers.filter((c) => {
      const matchSearch = !q || c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) || (c.email ?? "").toLowerCase().includes(q);
      const matchTier   = tierFilter === "all"   || c.tier === tierFilter;
      const matchBranch = branchFilter === "all" || c.preferredBranchId === branchFilter;
      const matchStatus = statusFilter === "all"
        || (statusFilter === "blocked" && c.isBlocked)
        || (statusFilter === "active"  && !c.isBlocked);
      return matchSearch && matchTier && matchBranch && matchStatus;
    });

    return [...base].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name")          cmp = a.name.localeCompare(b.name);
      if (sortKey === "totalOrders")   cmp = a.totalOrders - b.totalOrders;
      if (sortKey === "lifetimeValue") cmp = a.lifetimeValue - b.lifetimeValue;
      if (sortKey === "lastOrderAt")   cmp = new Date(a.lastOrderAt ?? 0).getTime() - new Date(b.lastOrderAt ?? 0).getTime();
      if (sortKey === "joinedAt")      cmp = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [customers, search, tierFilter, branchFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const resetPage  = useCallback(() => setPage(1), []);

  const activeFilterCount = [
    tierFilter !== "all",
    branchFilter !== "all",
    statusFilter !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch(""); setTier("all"); setBranch("all"); setStatus("all"); resetPage();
  };

  const toggleBlock = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomers((prev) =>
      prev.map((c) => c.id === customer.id ? { ...c, isBlocked: !c.isBlocked } : c),
    );
    toast(customer.isBlocked ? "success" : "success",
      customer.isBlocked ? `${customer.name} unblocked.` : `${customer.name} blocked.`);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">

        {/* ── Toolbar ───────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-neutral-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search name, phone, email…"
                aria-label="Search customers"
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-brand-400 transition-all"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); resetPage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-neutral-400 hidden md:block">
                <span className="font-semibold text-neutral-700">{filtered.length}</span> customer{filtered.length !== 1 ? "s" : ""}
              </span>
              {(activeFilterCount > 0 || search) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-brand-200 bg-brand-50 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={13} className="text-neutral-400 flex-shrink-0" />
            <Select
              options={TIER_OPTIONS}
              value={tierFilter}
              onChange={(e) => { setTier(e.target.value); resetPage(); }}
              aria-label="Filter by tier"
              className={cn("w-32 text-xs h-9", tierFilter !== "all" && "border-brand-400 ring-1 ring-brand-400")}
            />
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(e) => { setStatus(e.target.value); resetPage(); }}
              aria-label="Filter by status"
              className={cn("w-32 text-xs h-9", statusFilter !== "all" && "border-brand-400 ring-1 ring-brand-400")}
            />
            <Select
              options={branchOptions}
              value={branchFilter}
              onChange={(e) => { setBranch(e.target.value); resetPage(); }}
              aria-label="Filter by branch"
              className={cn("w-44 text-xs h-9", branchFilter !== "all" && "border-brand-400 ring-1 ring-brand-400")}
            />
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────── */}
        {paginated.length === 0 ? (
          <EmptyState onClear={clearFilters} hasFilters={activeFilterCount > 0 || !!search} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70">
                  <SortableCol label="Customer"     colKey="name"          current={sortKey} dir={sortDir} onSort={toggleSort} className="pl-6 w-[240px]" />
                  <th className="px-4 py-3.5 text-left w-[160px]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Contact</span>
                  </th>
                  <th className="px-4 py-3.5 text-left w-[110px]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Tier</span>
                  </th>
                  <SortableCol label="Orders"       colKey="totalOrders"   current={sortKey} dir={sortDir} onSort={toggleSort} className="w-[100px]" />
                  <SortableCol label="Lifetime Value" colKey="lifetimeValue" current={sortKey} dir={sortDir} onSort={toggleSort} className="w-[140px]" />
                  <SortableCol label="Last Visit"   colKey="lastOrderAt"   current={sortKey} dir={sortDir} onSort={toggleSort} className="w-[130px]" />
                  <th className="px-4 py-3.5 pr-6 text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginated.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    onNavigate={() => router.push(`/customers/${customer.id}`)}
                    onToggleBlock={toggleBlock}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            className="border-t border-neutral-100"
          />
        )}
      </div>
    </>
  );
}

/* ── Sortable column header ──────────────────────────────────── */

type SortKey2 = SortKey;

function SortableCol({
  label, colKey, current, dir, onSort, className,
}: {
  label: string; colKey: SortKey2; current: SortKey2; dir: SortDir;
  onSort: (k: SortKey2) => void; className?: string;
}) {
  const active = current === colKey;
  return (
    <th className={cn("px-4 py-3.5 text-left", className)}>
      <button
        onClick={() => onSort(colKey)}
        className={cn(
          "group inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
          active ? "text-brand-600" : "text-neutral-400 hover:text-neutral-600",
        )}
      >
        {label}
        <span className={cn("transition-colors", active ? "text-brand-500" : "text-neutral-300 group-hover:text-neutral-400")}>
          {active
            ? (dir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />)
            : <ChevronsUpDown size={11} />}
        </span>
      </button>
    </th>
  );
}

/* ── Customer row ────────────────────────────────────────────── */

function CustomerRow({
  customer, onNavigate, onToggleBlock,
}: {
  customer: Customer;
  onNavigate: () => void;
  onToggleBlock: (c: Customer, e: React.MouseEvent) => void;
}) {
  return (
    <tr
      onClick={onNavigate}
      className={cn(
        "cursor-pointer transition-colors group",
        customer.isBlocked ? "bg-red-50/30 hover:bg-red-50/60" : "hover:bg-neutral-50/80",
      )}
    >
      {/* Customer */}
      <td className="pl-6 pr-4 py-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "size-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
            customer.isBlocked ? "bg-neutral-200 text-neutral-500" : avatarCls(customer.name),
          )}>
            {initials(customer.name)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-neutral-800 truncate leading-none">
                {customer.name}
              </p>
              {customer.isBlocked && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-red-700 bg-red-100 border border-red-200 flex-shrink-0">
                  Blocked
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
              {customer.email ?? customer.preferredBranch ?? "—"}
            </p>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-4 py-4">
        <p className="text-sm text-neutral-700">{customer.phone}</p>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          {customer.preferredBranch ?? "—"}
        </p>
      </td>

      {/* Tier */}
      <td className="px-4 py-4">
        <CustomerTierBadge tier={customer.tier} />
      </td>

      {/* Orders */}
      <td className="px-4 py-4">
        <p className="text-sm font-semibold text-neutral-800">{customer.totalOrders}</p>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          avg ${customer.avgOrderValue.toFixed(0)}
        </p>
      </td>

      {/* LTV */}
      <td className="px-4 py-4">
        <p className="text-sm font-bold text-neutral-900">${customer.lifetimeValue.toLocaleString()}</p>
        <p className="text-[11px] text-neutral-400 mt-0.5">lifetime</p>
      </td>

      {/* Last Visit */}
      <td className="px-4 py-4">
        <p className="text-sm text-neutral-700">
          {customer.lastOrderAt ? relativeTime(customer.lastOrderAt) : "—"}
        </p>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          {customer.lastOrderAt ? formatDate(customer.lastOrderAt) : ""}
        </p>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 pr-6">
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => onToggleBlock(customer, e)}
            title={customer.isBlocked ? "Unblock customer" : "Block customer"}
            className={cn(
              "size-8 flex items-center justify-center rounded-lg border transition-all",
              customer.isBlocked
                ? "border-green-200 text-green-600 bg-green-50 hover:bg-green-100"
                : "border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50",
            )}
          >
            {customer.isBlocked ? <Shield size={13} /> : <ShieldOff size={13} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(); }}
            title="View profile"
            className="size-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-all"
          >
            <Eye size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ── Empty state ─────────────────────────────────────────────── */

function EmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <div className="size-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
        <Users size={28} className="text-neutral-300" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-neutral-600">No customers found</p>
        <p className="text-xs text-neutral-400 mt-1">
          {hasFilters ? "Try adjusting your filters." : "Customers will appear here once they place an order."}
        </p>
      </div>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onClear} leftIcon={<RotateCcw size={13} />}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
