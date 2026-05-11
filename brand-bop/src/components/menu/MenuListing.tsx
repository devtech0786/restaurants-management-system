"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Filter, LayoutGrid, List, UtensilsCrossed } from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import CategoryTabs from "./CategoryTabs";
import MenuItemCard from "./MenuItemCard";
import type { MenuItem, MenuCategory, MenuItemStatus } from "@/types/menu";

const STATUS_OPTIONS = [
  { value: "all",          label: "All Statuses" },
  { value: "available",    label: "Available" },
  { value: "unavailable",  label: "Unavailable" },
  { value: "out_of_stock", label: "Out of Stock" },
];

const statusBadge: Record<MenuItemStatus, { variant: "success" | "neutral" | "error"; label: string }> = {
  available:    { variant: "success", label: "Available" },
  unavailable:  { variant: "neutral", label: "Unavailable" },
  out_of_stock: { variant: "error",   label: "Out of Stock" },
};

type ViewMode = "grid" | "list";

interface MenuListingProps {
  initialItems: MenuItem[];
  categories: MenuCategory[];
}

export default function MenuListing({ initialItems, categories }: MenuListingProps) {
  const [items, setItems]           = useState<MenuItem[]>(initialItems);
  const [activeCategory, setActive] = useState("all");
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("all");
  const [view, setView]             = useState<ViewMode>("grid");
  const [deleteTarget, setDelete]   = useState<MenuItem | null>(null);
  const [deleting, setDeleting]     = useState(false);

  const catMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories],
  );

  const counts = useMemo(
    () =>
      categories.reduce<Record<string, number>>((acc, c) => {
        acc[c.id] = items.filter((i) => i.categoryId === c.id).length;
        return acc;
      }, {}),
    [items, categories],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      const matchCat    = activeCategory === "all" || item.categoryId === activeCategory;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      return matchCat && matchStatus && matchSearch;
    });
  }, [items, activeCategory, search, statusFilter]);

  const handleToggle = (item: MenuItem) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, isAvailable: !i.isAvailable, status: !i.isAvailable ? "available" : "unavailable" }
          : i,
      ),
    );
    toast("success", `${item.name} marked as ${item.isAvailable ? "unavailable" : "available"}.`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 600));
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    toast("success", `"${deleteTarget.name}" removed from menu.`);
    setDelete(null);
    setDeleting(false);
  };

  // Summary stats
  const totalAvailable = items.filter((i) => i.status === "available").length;
  const totalOutOfStock = items.filter((i) => i.status === "out_of_stock").length;
  const avgPrice =
    items.length > 0
      ? (items.reduce((sum, i) => sum + i.basePrice, 0) / items.length).toFixed(2)
      : "0.00";

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Items",   value: items.length,    color: "text-neutral-700" },
          { label: "Available",     value: totalAvailable,  color: "text-green-600"   },
          { label: "Out of Stock",  value: totalOutOfStock, color: "text-red-500"     },
          { label: "Avg. Price",    value: `$${avgPrice}`,  color: "text-brand-600"   },
        ].map((s) => (
          <Card key={s.label} padding="sm" className="text-center">
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Category tabs */}
      <div className="mb-4">
        <CategoryTabs
          categories={categories}
          activeId={activeCategory}
          onChange={(id) => { setActive(id); }}
          counts={counts}
        />
      </div>

      {/* Toolbar */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-neutral-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU…"
              aria-label="Search menu items"
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-neutral-400 flex-shrink-0" />
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
              className="w-40"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 border border-neutral-200 rounded-lg p-0.5">
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={cn("p-1.5 rounded-md transition-colors", view === "grid" ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-600")}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={cn("p-1.5 rounded-md transition-colors", view === "list" ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-600")}
            >
              <List size={14} />
            </button>
          </div>

          <Link href="/menu/new">
            <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}>
              Add Item
            </Button>
          </Link>
        </div>

        {/* Grid view */}
        {view === "grid" && (
          <div className="p-4">
            {filtered.length === 0 ? (
              <EmptyState onClear={() => { setSearch(""); setStatus("all"); setActive("all"); }} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    categoryName={catMap[item.categoryId]?.name ?? ""}
                    categoryColor={catMap[item.categoryId]?.color ?? "#71717a"}
                    onDelete={setDelete}
                    onToggleAvailability={handleToggle}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* List view */}
        {view === "list" && (
          <Table
            data={filtered}
            emptyState={<EmptyState onClear={() => { setSearch(""); setStatus("all"); setActive("all"); }} />}
            columns={[
              {
                key: "name",
                header: "Item",
                render: (item) => (
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                      <p className="text-[11px] font-mono text-neutral-400">{item.sku}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: "category",
                header: "Category",
                render: (item) => {
                  const cat = catMap[item.categoryId];
                  return cat ? (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.name}
                    </span>
                  ) : null;
                },
              },
              {
                key: "price",
                header: "Price",
                render: (item) => (
                  <span className="text-sm font-semibold text-neutral-800">
                    ${item.basePrice.toFixed(2)}
                    {item.variants.length > 0 && (
                      <span className="text-xs font-normal text-neutral-400 ml-1">+{item.variants.length} variants</span>
                    )}
                  </span>
                ),
              },
              {
                key: "prepTime",
                header: "Prep",
                render: (item) => (
                  <span className="text-sm text-neutral-600">{item.prepTime}m</span>
                ),
              },
              {
                key: "tags",
                header: "Tags",
                render: (item) => (
                  <div className="flex gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-600 capitalize">
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-400">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (item) => (
                  <Badge variant={statusBadge[item.status].variant} dot>
                    {statusBadge[item.status].label}
                  </Badge>
                ),
              },
              {
                key: "actions",
                header: "",
                className: "w-20",
                render: (item) => (
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/menu/${item.id}/edit`}
                      className="size-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs"
                      title="Edit"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDelete(item)}
                      className="size-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Card>

      {/* Delete modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDelete(null)}
        title="Remove Menu Item"
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDelete(null)} disabled={deleting}>Cancel</Button>
            <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>Remove</Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600">
          Are you sure you want to remove{" "}
          <strong className="text-neutral-900">{deleteTarget?.name}</strong> from the menu?
        </p>
      </Modal>
    </>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <div className="size-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
        <UtensilsCrossed size={24} className="text-neutral-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-neutral-600">No items found</p>
        <p className="text-xs text-neutral-400 mt-0.5">Try adjusting your search or filters.</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onClear}>Clear filters</Button>
    </div>
  );
}
