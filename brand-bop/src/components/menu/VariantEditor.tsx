"use client";

import { Plus, Trash2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { MenuVariant } from "@/types/menu";

interface VariantEditorProps {
  value: MenuVariant[];
  onChange: (variants: MenuVariant[]) => void;
}

function newVariant(): MenuVariant {
  return { id: crypto.randomUUID(), name: "", price: 0 };
}

export default function VariantEditor({ value, onChange }: VariantEditorProps) {
  const update = (id: string, field: keyof MenuVariant, val: string | number) =>
    onChange(value.map((v) => (v.id === id ? { ...v, [field]: val } : v)));

  const remove = (id: string) => onChange(value.filter((v) => v.id !== id));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="form-label mb-0">Variants / Sizes</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            Add size or option variants with individual pricing.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus size={13} />}
          onClick={() => onChange([...value, newVariant()])}
        >
          Add Variant
        </Button>
      </div>

      {value.length === 0 ? (
        <div className="border border-dashed border-neutral-200 rounded-xl p-6 text-center">
          <p className="text-sm text-neutral-400">
            No variants — item uses its base price only.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {value.map((variant, i) => (
            <div key={variant.id} className="flex items-end gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="flex-1">
                <Input
                  label={i === 0 ? "Variant Name" : undefined}
                  value={variant.name}
                  onChange={(e) => update(variant.id, "name", e.target.value)}
                  placeholder="e.g. Large, With Sauce…"
                />
              </div>
              <div className="w-32">
                <Input
                  label={i === 0 ? "Price ($)" : undefined}
                  type="number"
                  min="0"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => update(variant.id, "price", parseFloat(e.target.value) || 0)}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(variant.id)}
                aria-label={`Remove variant ${variant.name}`}
                className="mb-0.5 size-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
