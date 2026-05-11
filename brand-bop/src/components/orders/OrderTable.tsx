"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, SlidersHorizontal, ShoppingBag, X,
  Zap, UtensilsCrossed, Truck, Clock, AlertTriangle,
  RotateCcw, Eye, ArrowUp, ArrowDown, ChevronsUpDown,
  ChevronRight,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import OrderStatusBadge, { ORDER_STATUS_CONFIG, PaymentStatusBadge } from "./OrderStatusBadge";
import DateRangePicker, { type DateRange, getDateBounds } from "./DateRangePicker";
import type { Order, OrderStatus } from "@/types/order";

const PAGE_SIZE = 8;

/* ── Status tab config ───────────────────────────────────────── */

const STATUS_TABS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all",              label: "All Orders"  },
  { value: "pending",          label: "Pending"     },
  { value: "confirmed",        label: "Confirmed"   },
  { value: "preparing",        label: "Preparing"   },
  { value: "ready",            label: "Ready"       },
  { value: "out_for_delivery", label: "On the Way"  },
  { value: "completed",        label: "Completed"   },
  { value: "cancelled",        label: "Cancelled"   },
];

/* Tailwind class lookups — required because Tailwind can't generate classes from runtime strings */
const TAB_ACTIVE_CLS: Record<string, string> = {
  all:              "bg-neutral-900 text-white border-neutral-900",
  pending:          "bg-amber-500  text-white border-amber-500",
  confirmed:        "bg-blue-500   text-white border-blue-500",
  preparing:        "bg-violet-500 text-white border-violet-500",
  ready:            "bg-cyan-500   text-white border-cyan-500",
  out_for_delivery: "bg-orange-500 text-white border-orange-500",
  completed:        "bg-green-500  text-white border-green-500",
  cancelled:        "bg-red-500    text-white border-red-500",
};

const ROW_BORDER_CLS: Record<OrderStatus, string> = {
  pending:          "border-l-amber-400",
  confirmed:        "border-l-blue-400",
  preparing:        "border-l-violet-400",
  ready:            "border-l-cyan-400",
  out_for_delivery: "border-l-orange-400",
  completed:        "border-l-green-400",
  cancelled:        "border-l-neutral-200",
  refunded:         "border-l-neutral-200",
};

const ADVANCE_BTN_CLS: Partial<Record<OrderStatus, string>> = {
  pending:          "bg-amber-500  hover:bg-amber-600  text-white",
  confirmed:        "bg-blue-500   hover:bg-blue-600   text-white",
  preparing:        "bg-violet-500 hover:bg-violet-600 text-white",
  ready:            "bg-cyan-500   hover:bg-cyan-600   text-white",
  out_for_delivery: "bg-orange-500 hover:bg-orange-600 text-white",
};

/* ── Filter options ──────────────────────────────────────────── */

const TYPE_OPTIONS = [
  { value: "all",      label: "All Types" },
  { value: "dine-in",  label: "Dine-in"  },
  { value: "takeaway", label: "Takeaway"  },
  { value: "delivery", label: "Delivery"  },
];

const PAYMENT_OPTIONS = [
  { value: "all",            label: "All Payments" },
  { value: "paid",           label: "Paid"         },
  { value: "unpaid",         label: "Unpaid"       },
  { value: "partially_paid", label: "Partial"      },
  { value: "refunded",       label: "Refunded"     },
];

/* ── Action maps ─────────────────────────────────────────────── */

const ADVANCE_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:          "confirmed",
  confirmed:        "preparing",
  preparing:        "ready",
  ready:            "out_for_delivery",
  out_for_delivery: "completed",
};

const ADVANCE_LABEL: Partial<Record<OrderStatus, string>> = {
  pending:          "Confirm",
  confirmed:        "To Kitchen",
  preparing:        "Mark Ready",
  ready:            "Dispatch",
  out_for_delivery: "Delivered",
};

/* ── Type display ────────────────────────────────────────────── */

const TYPE_META: Record<string, { Icon: React.ElementType; label: string; cls: string }> = {
  "dine-in": { Icon: UtensilsCrossed, label: "Dine-in",  cls: "text-violet-700 bg-violet-50 border-violet-200" },
  takeaway:  { Icon: ShoppingBag,     label: "Takeaway", cls: "text-blue-700   bg-blue-50   border-blue-200"   },
  delivery:  { Icon: Truck,           label: "Delivery", cls: "text-orange-700 bg-orange-50 border-orange-200" },
};

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

/* ── Urgency ─────────────────────────────────────────────────── */

const URGENCY_MINS: Partial<Record<OrderStatus, number>> = {
  pending: 5, confirmed: 3, preparing: 25, ready: 10,
};

function isUrgent(o: Order): boolean {
  const t = URGENCY_MINS[o.status];
  return !!t && (Date.now() - new Date(o.updatedAt).getTime()) / 60000 > t;
}

/* ── Time helpers ────────────────────────────────────────────── */

function relativeTime(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

/* ── Sort ────────────────────────────────────────────────────── */

type SortKey = "placedAt" | "customer" | "total";
type SortDir = "asc" | "desc";

/* ── Main component ──────────────────────────────────────────── */

interface OrderTableProps {
  initialOrders: Order[];
  franchises:    { id: string; name: string }[];
}

export default function OrderTable({ initialOrders, franchises }: OrderTableProps) {
  const router = useRouter();

  const [orders, setOrders]         = useState<Order[]>(initialOrders);
  const [activeTab, setTab]         = useState<OrderStatus | "all">("all");
  const [search, setSearch]         = useState("");
  const [typeFilter, setType]       = useState("all");
  const [payFilter, setPay]         = useState("all");
  const [branchFilter, setBranch]   = useState("all");
  const [dateRange, setDateRange]   = useState<DateRange>("week");
  const [sortKey, setSortKey]       = useState<SortKey>("placedAt");
  const [sortDir, setSortDir]       = useState<SortDir>("desc");
  const [page, setPage]             = useState(1);
  const [cancelTarget, setCancel]   = useState<Order | null>(null);
  const [cancelReason, setReason]   = useState("");
  const [cancelling, setCancelling] = useState(false);

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
    const bounds = getDateBounds(dateRange);
    const q = search.toLowerCase();

    const base = orders.filter((o) => {
      const placed = new Date(o.placedAt);
      return (
        placed >= bounds.from && placed <= bounds.to &&
        (activeTab === "all" || o.status === activeTab) &&
        (typeFilter === "all" || o.type === typeFilter) &&
        (payFilter === "all"  || o.paymentStatus === payFilter) &&
        (branchFilter === "all" || o.franchiseId === branchFilter) &&
        (!q || o.orderNumber.toLowerCase().includes(q) ||
              o.customer.name.toLowerCase().includes(q) ||
              o.customer.phone.includes(q))
      );
    });

    return [...base].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "placedAt") cmp = new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime();
      if (sortKey === "customer") cmp = a.customer.name.localeCompare(b.customer.name);
      if (sortKey === "total")    cmp = a.total - b.total;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [orders, activeTab, typeFilter, payFilter, branchFilter, dateRange, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const resetPage  = useCallback(() => setPage(1), []);

  const activeFilterCount = [
    typeFilter !== "all",
    payFilter !== "all",
    branchFilter !== "all",
    dateRange !== "week",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch(""); setType("all"); setPay("all");
    setBranch("all"); setDateRange("week"); setTab("all"); resetPage();
  };

  const advanceOrder = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = ADVANCE_STATUS[order.status];
    if (!next) return;
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o, status: next, updatedAt: now,
              completedAt: next === "completed" ? now : o.completedAt,
              statusHistory: [...o.statusHistory, { status: next, at: now, by: "Admin" }],
            }
          : o,
      ),
    );
    toast("success", `${order.orderNumber} → ${ORDER_STATUS_CONFIG[next].label}`);
  };

  const openCancel = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    setCancel(order);
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    await new Promise((r) => setTimeout(r, 600));
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === cancelTarget.id
          ? {
              ...o, status: "cancelled", updatedAt: now,
              cancellationReason: cancelReason,
              statusHistory: [...o.statusHistory, {
                status: "cancelled", at: now, by: "Admin",
                note: cancelReason || undefined,
              }],
            }
          : o,
      ),
    );
    toast("success", `Order ${cancelTarget.orderNumber} cancelled.`);
    setCancel(null); setReason(""); setCancelling(false);
  };

  const tabCount = (s: OrderStatus | "all") =>
    s === "all" ? filtered.length : filtered.filter((o) => o.status === s).length;

  const urgentCount = filtered.filter(
    (o) => !["completed", "cancelled", "refunded"].includes(o.status) && isUrgent(o),
  ).length;

  return (
    <>
      {/* ── Status tabs ───────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-6 scrollbar-thin">
        {STATUS_TABS.map((tab) => {
          const active = activeTab === tab.value;
          const count  = tabCount(tab.value);
          const cfg    = tab.value !== "all" ? ORDER_STATUS_CONFIG[tab.value] : null;

          return (
            <button
              key={tab.value}
              onClick={() => { setTab(tab.value); resetPage(); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border",
                "whitespace-nowrap transition-all duration-150 flex-shrink-0",
                active
                  ? TAB_ACTIVE_CLS[tab.value]
                  : "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50",
              )}
            >
              {!active && cfg && (
                <span className={cn("size-1.5 rounded-full flex-shrink-0", cfg.dot)} />
              )}
              {tab.label}
              <span className={cn(
                "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full",
                "text-[10px] font-bold tabular-nums",
                active ? "bg-white/25" : "bg-neutral-100 text-neutral-500",
              )}>
                {count}
              </span>
            </button>
          );
        })}

        {urgentCount > 0 && (
          <div className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            <AlertTriangle size={12} />
            {urgentCount} need attention
          </div>
        )}
      </div>

      {/* ── Main card ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">

        {/* ── Toolbar ───────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-neutral-100 space-y-3">

          {/* Row 1: search + summary */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search order, customer, phone…"
                aria-label="Search orders"
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-brand-400 transition-all"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); resetPage(); }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-neutral-400 hidden md:block">
                <span className="font-semibold text-neutral-700">{filtered.length}</span> order{filtered.length !== 1 ? "s" : ""}
              </span>
              {(activeFilterCount > 0 || search) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-brand-200 bg-brand-50 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors flex-shrink-0"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Row 2: filters */}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={13} className="text-neutral-400 flex-shrink-0" />
            <Select
              options={TYPE_OPTIONS}
              value={typeFilter}
              onChange={(e) => { setType(e.target.value); resetPage(); }}
              aria-label="Filter by type"
              className={cn("w-36 text-xs h-9", typeFilter !== "all" && "border-brand-400 ring-1 ring-brand-400")}
            />
            <Select
              options={PAYMENT_OPTIONS}
              value={payFilter}
              onChange={(e) => { setPay(e.target.value); resetPage(); }}
              aria-label="Filter by payment"
              className={cn("w-36 text-xs h-9", payFilter !== "all" && "border-brand-400 ring-1 ring-brand-400")}
            />
            <Select
              options={branchOptions}
              value={branchFilter}
              onChange={(e) => { setBranch(e.target.value); resetPage(); }}
              aria-label="Filter by branch"
              className={cn("w-44 text-xs h-9", branchFilter !== "all" && "border-brand-400 ring-1 ring-brand-400")}
            />
            <DateRangePicker
              value={dateRange}
              onChange={(r) => { setDateRange(r); resetPage(); }}
            />
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────── */}
        {paginated.length === 0 ? (
          <EmptyState
            onClear={clearFilters}
            hasFilters={activeFilterCount > 0 || !!search || activeTab !== "all"}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">

              {/* Header */}
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70">
                  <SortableCol
                    label="Order"
                    colKey="placedAt"
                    current={sortKey}
                    dir={sortDir}
                    onSort={toggleSort}
                    className="pl-6 w-[220px]"
                  />
                  <SortableCol
                    label="Customer"
                    colKey="customer"
                    current={sortKey}
                    dir={sortDir}
                    onSort={toggleSort}
                    className="w-[200px]"
                  />
                  <th className="px-4 py-3.5 text-left w-[150px]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Type
                    </span>
                  </th>
                  <th className="px-4 py-3.5 text-left w-[160px]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Status
                    </span>
                  </th>
                  <SortableCol
                    label="Total"
                    colKey="total"
                    current={sortKey}
                    dir={sortDir}
                    onSort={toggleSort}
                    className="w-[150px]"
                  />
                  <th className="px-4 py-3.5 pr-6 text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-neutral-100">
                {paginated.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onNavigate={() => router.push(`/orders/${order.id}`)}
                    onAdvance={advanceOrder}
                    onCancel={openCancel}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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

      {/* ── Cancel modal ──────────────────────────────────────── */}
      <Modal
        open={!!cancelTarget}
        onClose={() => { setCancel(null); setReason(""); }}
        title="Cancel Order"
        description={`${cancelTarget?.orderNumber} · ${cancelTarget?.customer.name}`}
        size="sm"
        footer={
          <>
            <Button
              variant="outline" size="sm"
              onClick={() => { setCancel(null); setReason(""); }}
              disabled={cancelling}
            >
              Keep Order
            </Button>
            <Button variant="danger" size="sm" loading={cancelling} onClick={handleCancel}>
              Yes, Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-neutral-600">
            This will notify the kitchen and stop preparation immediately.
          </p>
          <div>
            <label className="form-label">
              Reason <span className="text-neutral-400">(optional)</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer changed their mind, item unavailable…"
              rows={3}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ── Sortable column header ──────────────────────────────────── */

interface SortableColProps {
  label:     string;
  colKey:    SortKey;
  current:   SortKey;
  dir:       SortDir;
  onSort:    (k: SortKey) => void;
  className?: string;
}

function SortableCol({ label, colKey, current, dir, onSort, className }: SortableColProps) {
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

/* ── Order row ───────────────────────────────────────────────── */

interface OrderRowProps {
  order:      Order;
  onNavigate: () => void;
  onAdvance:  (o: Order, e: React.MouseEvent) => void;
  onCancel:   (o: Order, e: React.MouseEvent) => void;
}

function OrderRow({ order, onNavigate, onAdvance, onCancel }: OrderRowProps) {
  const cfg      = ORDER_STATUS_CONFIG[order.status];
  const isFinal  = ["completed", "cancelled", "refunded"].includes(order.status);
  const advLabel = ADVANCE_LABEL[order.status];
  const advClass = ADVANCE_BTN_CLS[order.status];
  const urgent   = !isFinal && isUrgent(order);
  const typeMeta = TYPE_META[order.type];
  const TypeIcon = typeMeta.Icon;
  const branch   = order.franchiseName.split("—")[1]?.trim() ?? order.franchiseName;

  return (
    <tr
      onClick={onNavigate}
      className={cn(
        "cursor-pointer transition-colors duration-100 group",
        urgent
          ? "bg-red-50/30 hover:bg-red-50/70"
          : order.isPriority
          ? "bg-amber-50/30 hover:bg-amber-50/60"
          : "hover:bg-neutral-50/80",
      )}
    >
      {/* ── Order cell (with status left-border) ── */}
      <td className={cn("pl-3 pr-4 py-4 border-l-[3px]", ROW_BORDER_CLS[order.status])}>
        <div className="flex items-center gap-3">
          {/* Status icon */}
          <div className={cn("size-9 rounded-xl flex items-center justify-center flex-shrink-0", cfg.bg)}>
            <span className={cn("size-2 rounded-full", cfg.dot)} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-neutral-900 font-mono tracking-tight">
                #{order.orderNumber.split("-").slice(-1)[0]}
              </span>
              {order.isPriority && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-black text-amber-700 bg-amber-100 border border-amber-200 uppercase tracking-wide flex-shrink-0">
                  <Zap size={8} />
                  Priority
                </span>
              )}
            </div>
            <p className={cn(
              "text-[11px] mt-0.5 flex items-center gap-1",
              urgent ? "text-red-600 font-semibold" : "text-neutral-400",
            )}>
              {urgent && <Clock size={9} />}
              {relativeTime(order.placedAt)}
            </p>
          </div>
        </div>
      </td>

      {/* ── Customer ── */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "size-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold",
            avatarCls(order.customer.name),
          )}>
            {initials(order.customer.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-800 truncate leading-none">
              {order.customer.name}
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">{order.customer.phone}</p>
          </div>
        </div>
      </td>

      {/* ── Type ── */}
      <td className="px-4 py-4">
        <span className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border",
          typeMeta.cls,
        )}>
          <TypeIcon size={11} />
          {typeMeta.label}
        </span>
        <p className="text-[11px] text-neutral-400 mt-1 truncate max-w-[120px]">
          {order.tableNumber ? `Table ${order.tableNumber}` : branch}
        </p>
      </td>

      {/* ── Status ── */}
      <td className="px-4 py-4">
        <OrderStatusBadge status={order.status} />
        {urgent && (
          <p className="flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-red-600">
            <AlertTriangle size={9} />
            Needs attention
          </p>
        )}
      </td>

      {/* ── Total ── */}
      <td className="px-4 py-4">
        <p className="text-sm font-bold text-neutral-900 leading-none">${order.total.toFixed(2)}</p>
        <div className="mt-1.5">
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </td>

      {/* ── Actions ── */}
      <td className="px-4 py-4 pr-6">
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Advance: slides in on row hover */}
          {!isFinal && advLabel && advClass && (
            <button
              onClick={(e) => onAdvance(order, e)}
              title={advLabel}
              className={cn(
                "flex items-center gap-1 px-3 h-7 rounded-lg text-[11px] font-semibold transition-all duration-150",
                "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
                advClass,
              )}
            >
              {advLabel}
              <ChevronRight size={11} />
            </button>
          )}

          {/* View — always visible */}
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(); }}
            title="View details"
            className="size-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-all"
          >
            <Eye size={14} />
          </button>

          {/* Cancel — always visible */}
          {!isFinal && (
            <button
              onClick={(e) => onCancel(order, e)}
              title="Cancel order"
              className="size-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
            >
              <X size={13} />
            </button>
          )}
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
        <ShoppingBag size={28} className="text-neutral-300" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-neutral-600">No orders found</p>
        <p className="text-xs text-neutral-400 mt-1">
          {hasFilters
            ? "Try adjusting your filters or date range."
            : "Orders will appear here once placed."}
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
