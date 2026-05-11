"use client";

import { useState } from "react";
import {
  Plus, Pencil, Trash2, GripVertical,
  ChevronUp, ChevronDown, Tag,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ColorPicker from "@/components/ui/ColorPicker";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/types/menu";

const CATEGORY_COLORS = [
  "#f97316", "#8b5cf6", "#ef4444", "#eab308",
  "#22c55e", "#ec4899", "#06b6d4", "#a855f7",
  "#f43f5e", "#14b8a6",
];

const BLANK_CATEGORY: Omit<MenuCategory, "id" | "displayOrder"> = {
  name:        "",
  description: "",
  color:       "#f97316",
  status:      "active",
  itemCount:   0,
};

type EditState = Omit<MenuCategory, "id" | "displayOrder">;
type Errors    = Partial<Record<string, string>>;

function validateCat(data: EditState): Errors {
  const e: Errors = {};
  if (!data.name.trim()) e.name = "Category name is required.";
  return e;
}

interface CategoryManagerProps {
  initialCategories: MenuCategory[];
}

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories);
  const [modalOpen, setModalOpen]   = useState(false);
  const [deleteTarget, setDelete]   = useState<MenuCategory | null>(null);
  const [editTarget, setEditTarget] = useState<MenuCategory | null>(null);
  const [form, setForm]             = useState<EditState>(BLANK_CATEGORY);
  const [errors, setErrors]         = useState<Errors>({});
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const openAdd = () => {
    setEditTarget(null);
    setForm(BLANK_CATEGORY);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (cat: MenuCategory) => {
    setEditTarget(cat);
    setForm({
      name: cat.name, description: cat.description,
      color: cat.color, status: cat.status, itemCount: cat.itemCount,
    });
    setErrors({});
    setModalOpen(true);
  };

  const updateForm = <K extends keyof EditState>(key: K, value: EditState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = async () => {
    const errs = validateCat(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    if (editTarget) {
      setCategories((prev) =>
        prev.map((c) => c.id === editTarget.id ? { ...c, ...form } : c),
      );
      toast("success", "Category updated.");
    } else {
      const newCat: MenuCategory = {
        id: `cat-${Date.now()}`,
        displayOrder: categories.length + 1,
        ...form,
      };
      setCategories((prev) => [...prev, newCat]);
      toast("success", "Category created.");
    }

    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if ((deleteTarget.itemCount ?? 0) > 0) {
      toast("error", `Cannot delete "${deleteTarget.name}" — it has ${deleteTarget.itemCount} items. Reassign them first.`);
      setDelete(null);
      return;
    }
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 600));
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    toast("success", `"${deleteTarget.name}" deleted.`);
    setDelete(null);
    setDeleting(false);
  };

  const move = (id: string, dir: "up" | "down") => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (dir === "up" && idx === 0) return prev;
      if (dir === "down" && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next.map((c, i) => ({ ...c, displayOrder: i + 1 }));
    });
  };

  const toggleStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c,
      ),
    );
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Categories"
          description={`${categories.length} categories · ${categories.filter((c) => c.status === "active").length} active`}
          action={
            <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={openAdd}>
              Add Category
            </Button>
          }
        />

        <div className="space-y-2">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                cat.status === "active"
                  ? "border-neutral-200 bg-white"
                  : "border-dashed border-neutral-200 bg-neutral-50",
              )}
            >
              {/* Drag handle visual */}
              <div className="text-neutral-300 cursor-grab flex-shrink-0" aria-hidden>
                <GripVertical size={16} />
              </div>

              {/* Color dot */}
              <span
                className="size-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-medium", cat.status === "inactive" && "text-neutral-400")}>
                    {cat.name}
                  </span>
                  {cat.status === "inactive" && (
                    <Badge variant="neutral">Inactive</Badge>
                  )}
                </div>
                {cat.description && (
                  <p className="text-xs text-neutral-400 truncate mt-0.5">{cat.description}</p>
                )}
              </div>

              {/* Item count */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 flex-shrink-0">
                <Tag size={11} />
                <span>{cat.itemCount ?? 0} items</span>
              </div>

              {/* Order controls */}
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  onClick={() => move(cat.id, "up")}
                  disabled={idx === 0}
                  aria-label="Move up"
                  className="size-5 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronUp size={12} />
                </button>
                <button
                  onClick={() => move(cat.id, "down")}
                  disabled={idx === categories.length - 1}
                  aria-label="Move down"
                  className="size-5 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronDown size={12} />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleStatus(cat.id)}
                  className={cn(
                    "h-7 px-2.5 rounded-lg text-xs font-medium transition-colors",
                    cat.status === "active"
                      ? "text-green-700 bg-green-50 hover:bg-green-100"
                      : "text-neutral-500 bg-neutral-100 hover:bg-neutral-200",
                  )}
                >
                  {cat.status === "active" ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => openEdit(cat)}
                  aria-label={`Edit ${cat.name}`}
                  className="size-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDelete(cat)}
                  aria-label={`Delete ${cat.name}`}
                  className="size-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Category" : "Add Category"}
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
              {editTarget ? "Save Changes" : "Create"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
            error={errors.name}
            placeholder="e.g. Starters"
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
            placeholder="Brief description shown in menus…"
            rows={2}
          />
          <div>
            <ColorPicker
              label="Color"
              value={form.color}
              onChange={(v) => updateForm("color", v)}
              helperText="Used in tabs and category badges."
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateForm("color", c)}
                  aria-label={`Pick color ${c}`}
                  className={cn(
                    "size-6 rounded-md border-2 transition-transform hover:scale-110",
                    form.color === c ? "border-neutral-900 scale-110" : "border-transparent",
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDelete(null)}
        title="Delete Category"
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600">
          Delete <strong className="text-neutral-900">{deleteTarget?.name}</strong>?{" "}
          {(deleteTarget?.itemCount ?? 0) > 0 ? (
            <span className="text-red-600 font-medium">
              This category has {deleteTarget?.itemCount} items — reassign them before deleting.
            </span>
          ) : (
            "This cannot be undone."
          )}
        </p>
      </Modal>
    </>
  );
}
