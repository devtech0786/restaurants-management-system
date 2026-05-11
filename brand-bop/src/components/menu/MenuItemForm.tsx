"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Card, CardHeader, Divider } from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";
import { TagSelector, AllergenSelector } from "./TagSelector";
import VariantEditor from "./VariantEditor";
import ImageUploadGrid from "./ImageUploadGrid";
import type { MenuItem, MenuCategory, MenuItemDraft, MenuTag, Allergen, MenuItemStatus } from "@/types/menu";

const STATUS_OPTIONS: { value: MenuItemStatus; label: string }[] = [
  { value: "available",    label: "Available" },
  { value: "unavailable",  label: "Unavailable" },
  { value: "out_of_stock", label: "Out of Stock" },
];

const DEFAULT_DRAFT: MenuItemDraft = {
  categoryId:  "",
  sku:         "",
  name:        "",
  description: "",
  basePrice:   0,
  variants:    [],
  imageUrl:    "",
  gallery:     [],
  status:      "available",
  tags:        [],
  allergens:   [],
  prepTime:    15,
  calories:    undefined,
  isAvailable: true,
};

type Errors = Partial<Record<string, string>>;

function validate(draft: MenuItemDraft): Errors {
  const e: Errors = {};
  if (!draft.name.trim())       e.name       = "Item name is required.";
  if (!draft.categoryId)        e.categoryId = "Please select a category.";
  if (draft.basePrice <= 0)     e.basePrice  = "Base price must be greater than 0.";
  if (!draft.sku.trim())        e.sku        = "SKU is required.";
  if (draft.prepTime < 1)       e.prepTime   = "Prep time must be at least 1 minute.";
  return e;
}

interface MenuItemFormProps {
  categories: MenuCategory[];
  initialData?: MenuItem;
  mode: "create" | "edit";
}

export default function MenuItemForm({ categories, initialData, mode }: MenuItemFormProps) {
  const router  = useRouter();
  const isEdit  = mode === "edit";

  const [form, setForm]       = useState<MenuItemDraft>(
    initialData
      ? { ...initialData }
      : { ...DEFAULT_DRAFT },
  );
  const [errors, setErrors]   = useState<Errors>({});
  const [saving, setSaving]   = useState(false);

  const update = useCallback(
    <K extends keyof MenuItemDraft>(key: K, value: MenuItemDraft[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast("error", "Please fix the highlighted errors.");
      return;
    }
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      toast("success", isEdit ? "Menu item updated." : "Menu item created successfully.");
      router.push("/menu");
    } catch {
      toast("error", "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const catOptions = categories
    .filter((c) => c.status === "active")
    .map((c) => ({ value: c.id, label: c.name }));

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        {/* Images */}
        <Card>
          <CardHeader title="Images" description="Upload the primary photo and optional gallery images." />
          <ImageUploadGrid
            primary={form.imageUrl}
            gallery={form.gallery}
            onPrimaryChange={(url) => update("imageUrl", url)}
            onGalleryChange={(urls) => update("gallery", urls)}
          />
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader title="Basic Information" description="Core details visible to staff and customers." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Input
                label="Item Name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                error={errors.name}
                placeholder="e.g. Crispy Calamari"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the dish — ingredients, preparation style, flavour notes…"
                rows={3}
              />
            </div>
            <Select
              label="Category"
              options={catOptions}
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              error={errors.categoryId}
              placeholder="Select a category"
              required
            />
            <Input
              label="SKU / Item Code"
              value={form.sku}
              onChange={(e) => update("sku", e.target.value.toUpperCase())}
              error={errors.sku}
              placeholder="e.g. FH-S001"
              required
              helperText="Unique identifier for POS and inventory systems."
            />
          </div>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader
            title="Pricing & Availability"
            description="Set the base price, variants, and current availability status."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Input
              label="Base Price ($)"
              type="number"
              min="0"
              step="0.01"
              value={form.basePrice}
              onChange={(e) => update("basePrice", parseFloat(e.target.value) || 0)}
              error={errors.basePrice}
              required
              helperText="Used when no variant is selected."
            />
            <Input
              label="Prep Time (min)"
              type="number"
              min="1"
              value={form.prepTime}
              onChange={(e) => update("prepTime", parseInt(e.target.value) || 0)}
              error={errors.prepTime}
              required
            />
            <Input
              label="Calories (kcal)"
              type="number"
              min="0"
              value={form.calories ?? ""}
              onChange={(e) =>
                update("calories", e.target.value ? parseInt(e.target.value) : undefined)
              }
              placeholder="Optional"
            />
          </div>

          <Divider />

          <Select
            label="Availability Status"
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={(e) => update("status", e.target.value as MenuItemStatus)}
            helperText="Controls whether this item appears as orderable on the menu."
          />

          <Divider />

          <VariantEditor
            value={form.variants}
            onChange={(v) => update("variants", v)}
          />
        </Card>

        {/* Tags & Allergens */}
        <Card>
          <CardHeader
            title="Tags & Allergens"
            description="Help guests make informed choices. Allergens are displayed prominently on menus."
          />
          <div className="space-y-6">
            <TagSelector
              value={form.tags as MenuTag[]}
              onChange={(tags) => update("tags", tags)}
            />
            <AllergenSelector
              value={form.allergens as Allergen[]}
              onChange={(allergens) => update("allergens", allergens)}
            />
          </div>
        </Card>

        {/* Form actions */}
        <div className="flex items-center justify-between pt-2 pb-6">
          <Button
            type="button"
            variant="ghost"
            size="md"
            leftIcon={<ArrowLeft size={15} />}
            onClick={() => router.back()}
          >
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => router.push("/menu")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
              leftIcon={<Save size={15} />}
            >
              {isEdit ? "Save Changes" : "Create Item"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
