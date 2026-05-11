"use client";

import { useState, useMemo } from "react";
import {
  Search, Plus, MoreHorizontal, Eye, Pencil, Trash2,
  MapPin, Users, LayoutGrid, Store, Filter,
} from "lucide-react";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Franchise, FranchiseStatus } from "@/types/franchise";

const PAGE_SIZE = 5;

const STATUS_OPTIONS = [
  { value: "all",       label: "All Statuses" },
  { value: "active",    label: "Active" },
  { value: "inactive",  label: "Inactive" },
  { value: "pending",   label: "Pending" },
  { value: "suspended", label: "Suspended" },
];

const COUNTRY_OPTIONS = (franchises: Franchise[]) => {
  const countries = Array.from(new Set(franchises.map((f) => f.country)));
  return [{ value: "all", label: "All Countries" }, ...countries.map((c) => ({ value: c, label: c }))];
};

const statusBadge: Record<FranchiseStatus, { variant: "success" | "warning" | "error" | "neutral" | "info"; label: string }> = {
  active:    { variant: "success", label: "Active" },
  inactive:  { variant: "neutral", label: "Inactive" },
  pending:   { variant: "warning", label: "Pending" },
  suspended: { variant: "error",   label: "Suspended" },
};

interface FranchiseTableProps {
  franchises: Franchise[];
}

type ViewMode = "table" | "grid";

export default function FranchiseTable({ franchises: initial }: FranchiseTableProps) {
  const [franchises, setFranchises] = useState<Franchise[]>(initial);
  const [search,  setSearch]   = useState("");
  const [status,  setStatus]   = useState("all");
  const [country, setCountry]  = useState("all");
  const [page,    setPage]     = useState(1);
  const [view,    setView]     = useState<ViewMode>("table");

  const [deleteTarget, setDeleteTarget]   = useState<Franchise | null>(null);
  const [viewTarget,   setViewTarget]     = useState<Franchise | null>(null);
  const [deleting,     setDeleting]       = useState(false);
  const [openMenu,     setOpenMenu]       = useState<string | null>(null);

  const filtered = useMemo(() => {
    return franchises.filter((f) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.city.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        f.ownerName.toLowerCase().includes(q);
      const matchStatus  = status === "all"  || f.status  === status;
      const matchCountry = country === "all" || f.country === country;
      return matchSearch && matchStatus && matchCountry;
    });
  }, [franchises, search, status, country]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 700));
    setFranchises((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    toast("success", `"${deleteTarget.name}" has been removed.`);
    setDeleteTarget(null);
    setDeleting(false);
    if (page > Math.ceil((filtered.length - 1) / PAGE_SIZE)) setPage((p) => Math.max(1, p - 1));
  };

  const statsCards = [
    { label: "Total",     value: franchises.length,                                       color: "text-neutral-700" },
    { label: "Active",    value: franchises.filter((f) => f.status === "active").length,  color: "text-green-600"   },
    { label: "Pending",   value: franchises.filter((f) => f.status === "pending").length, color: "text-amber-600"   },
    { label: "Inactive",  value: franchises.filter((f) => f.status !== "active" && f.status !== "pending").length, color: "text-neutral-400" },
  ];

  return (
    <>
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statsCards.map((s) => (
          <Card key={s.label} padding="sm" className="text-center">
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-neutral-100">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => handleFilter(() => setSearch(e.target.value))}
              placeholder="Search franchises…"
              aria-label="Search franchises"
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-neutral-400 flex-shrink-0" />
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => handleFilter(() => setStatus(e.target.value))}
              aria-label="Filter by status"
              className="w-36"
            />
            <Select
              options={COUNTRY_OPTIONS(initial)}
              value={country}
              onChange={(e) => handleFilter(() => setCountry(e.target.value))}
              aria-label="Filter by country"
              className="w-36"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 border border-neutral-200 rounded-lg p-0.5">
            <button
              onClick={() => setView("table")}
              aria-label="Table view"
              aria-pressed={view === "table"}
              className={cn("p-1.5 rounded-md transition-colors", view === "table" ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-600")}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={cn("p-1.5 rounded-md transition-colors", view === "grid" ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-600")}
            >
              <Store size={14} />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => toast("info", "Add Franchise flow coming soon.")}
          >
            Add Franchise
          </Button>
        </div>

        {/* Table view */}
        {view === "table" && (
          <Table
            data={paginated}
            columns={[
              {
                key: "name",
                header: "Franchise",
                render: (f) => (
                  <div>
                    <p className="font-medium text-neutral-900 text-sm">{f.name}</p>
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{f.code}</p>
                  </div>
                ),
              },
              {
                key: "location",
                header: "Location",
                render: (f) => (
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <MapPin size={12} className="text-neutral-400 flex-shrink-0" />
                    <span className="text-sm">{f.city}, {f.country}</span>
                  </div>
                ),
              },
              {
                key: "owner",
                header: "Owner",
                render: (f) => (
                  <div>
                    <p className="text-sm text-neutral-700">{f.ownerName}</p>
                    <p className="text-[11px] text-neutral-400">{f.ownerEmail}</p>
                  </div>
                ),
              },
              {
                key: "staff",
                header: "Staff",
                render: (f) => (
                  <div className="flex items-center gap-1 text-sm text-neutral-600">
                    <Users size={12} className="text-neutral-400" />
                    {f.staffCount}
                  </div>
                ),
              },
              {
                key: "revenue",
                header: "Monthly Rev.",
                render: (f) => (
                  <span className="text-sm font-medium text-neutral-800">
                    {f.monthlyRevenue > 0
                      ? `$${f.monthlyRevenue.toLocaleString()}`
                      : <span className="text-neutral-400">—</span>}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (f) => (
                  <Badge variant={statusBadge[f.status].variant} dot>
                    {statusBadge[f.status].label}
                  </Badge>
                ),
              },
              {
                key: "actions",
                header: "",
                className: "w-12",
                render: (f) => (
                  <div className="relative">
                    <button
                      aria-label={`Actions for ${f.name}`}
                      aria-haspopup="menu"
                      aria-expanded={openMenu === f.id}
                      onClick={() => setOpenMenu(openMenu === f.id ? null : f.id)}
                      className="size-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenu === f.id && (
                      <ActionMenu
                        onView={() => { setViewTarget(f); setOpenMenu(null); }}
                        onEdit={() => { toast("info", "Edit flow coming soon."); setOpenMenu(null); }}
                        onDelete={() => { setDeleteTarget(f); setOpenMenu(null); }}
                        onClose={() => setOpenMenu(null)}
                      />
                    )}
                  </div>
                ),
              },
            ]}
            emptyState={
              <div className="flex flex-col items-center gap-2">
                <Store size={32} className="text-neutral-300" />
                <p className="text-sm text-neutral-500">No franchises match your filters.</p>
                <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setStatus("all"); setCountry("all"); }}>
                  Clear filters
                </Button>
              </div>
            }
          />
        )}

        {/* Grid view */}
        {view === "grid" && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.length === 0 ? (
              <div className="col-span-full flex flex-col items-center gap-2 py-12">
                <Store size={32} className="text-neutral-300" />
                <p className="text-sm text-neutral-500">No franchises match your filters.</p>
              </div>
            ) : (
              paginated.map((f) => (
                <FranchiseCard
                  key={f.id}
                  franchise={f}
                  onView={() => setViewTarget(f)}
                  onDelete={() => setDeleteTarget(f)}
                />
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            className="border-t border-neutral-100"
          />
        )}
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove Franchise"
        description="This action cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600">
          Are you sure you want to remove{" "}
          <strong className="text-neutral-900">{deleteTarget?.name}</strong>?
          All associated data will be permanently deleted.
        </p>
      </Modal>

      {/* View detail modal */}
      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title={viewTarget?.name ?? ""}
        description={viewTarget ? `${viewTarget.city}, ${viewTarget.country}` : ""}
        size="md"
        footer={
          <Button variant="outline" size="sm" onClick={() => setViewTarget(null)}>
            Close
          </Button>
        }
      >
        {viewTarget && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: "Code",    value: viewTarget.code },
              { label: "Status",  value: <Badge variant={statusBadge[viewTarget.status].variant} dot>{statusBadge[viewTarget.status].label}</Badge> },
              { label: "Owner",   value: viewTarget.ownerName },
              { label: "Email",   value: viewTarget.ownerEmail },
              { label: "Phone",   value: viewTarget.phone },
              { label: "Address", value: viewTarget.address },
              { label: "Opened",  value: new Date(viewTarget.openedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) },
              { label: "Tables",  value: viewTarget.tableCount },
              { label: "Staff",   value: viewTarget.staffCount },
              { label: "Monthly Revenue", value: viewTarget.monthlyRevenue > 0 ? `$${viewTarget.monthlyRevenue.toLocaleString()}` : "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
                <p className="font-medium text-neutral-800">{value}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}

function FranchiseCard({
  franchise: f,
  onView,
  onDelete,
}: {
  franchise: Franchise;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="border border-neutral-200 rounded-xl p-4 bg-white hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="size-9 rounded-lg bg-brand-50 flex items-center justify-center">
          <Store size={16} className="text-brand-600" />
        </div>
        <Badge variant={statusBadge[f.status].variant} dot>{statusBadge[f.status].label}</Badge>
      </div>
      <p className="font-semibold text-sm text-neutral-900 mb-0.5">{f.name}</p>
      <p className="text-[11px] font-mono text-neutral-400 mb-3">{f.code}</p>
      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
        <MapPin size={11} />{f.city}, {f.country}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
        <Users size={11} />{f.staffCount} staff
      </div>
      <div className="flex items-center gap-2 border-t border-neutral-100 pt-3">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-brand-600 transition-colors py-1"
        >
          <Eye size={12} /> View
        </button>
        <button
          onClick={() => toast("info", "Edit flow coming soon.")}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-blue-600 transition-colors py-1"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-red-600 transition-colors py-1"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
}

function ActionMenu({
  onView,
  onEdit,
  onDelete,
  onClose,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} aria-hidden />
      <div
        role="menu"
        className="absolute right-0 top-9 z-20 w-36 bg-white rounded-xl border border-neutral-200 shadow-lg py-1 animate-fade-in"
      >
        <MenuItem icon={<Eye size={13} />} label="View Details" onClick={onView} />
        <MenuItem icon={<Pencil size={13} />} label="Edit" onClick={onEdit} />
        <div className="my-1 border-t border-neutral-100" />
        <MenuItem icon={<Trash2 size={13} />} label="Delete" onClick={onDelete} danger />
      </div>
    </>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-neutral-700 hover:bg-neutral-50",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
