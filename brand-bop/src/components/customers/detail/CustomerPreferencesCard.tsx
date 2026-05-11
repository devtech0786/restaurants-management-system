"use client";

import { useState } from "react";
import { Heart, Save, X, Plus, Leaf } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import type { Customer } from "@/types/customer";

interface CustomerPreferencesCardProps {
  customer:     Customer;
  onSave:       (data: { favoriteItems: string[]; dietaryNotes: string }) => void;
}

export default function CustomerPreferencesCard({ customer, onSave }: CustomerPreferencesCardProps) {
  const [editing, setEditing]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [favorites, setFavorites]     = useState<string[]>(customer.favoriteItems);
  const [dietary, setDietary]         = useState(customer.dietaryNotes ?? "");
  const [newItem, setNewItem]         = useState("");

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed || favorites.includes(trimmed)) return;
    setFavorites((prev) => [...prev, trimmed]);
    setNewItem("");
  };

  const removeItem = (item: string) => setFavorites((prev) => prev.filter((f) => f !== item));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave({ favoriteItems: favorites, dietaryNotes: dietary });
    setSaving(false);
    setEditing(false);
    toast("success", "Preferences saved.");
  };

  const handleCancel = () => {
    setFavorites(customer.favoriteItems);
    setDietary(customer.dietaryNotes ?? "");
    setNewItem("");
    setEditing(false);
  };

  return (
    <Card>
      <CardHeader
        title="Preferences"
        action={
          !editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Edit
            </button>
          ) : undefined
        }
      />

      {/* Favorite items */}
      <div className="mb-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2.5">
          <Heart size={11} className="text-rose-400" />
          Favourite Items
        </p>

        {favorites.length === 0 && !editing && (
          <p className="text-xs text-neutral-400 italic">None recorded.</p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {favorites.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium"
            >
              {item}
              {editing && (
                <button
                  onClick={() => removeItem(item)}
                  className="text-neutral-400 hover:text-red-500 transition-colors ml-0.5"
                >
                  <X size={10} />
                </button>
              )}
            </span>
          ))}
        </div>

        {editing && (
          <div className="flex gap-2 mt-2.5">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              placeholder="Add item…"
              className="flex-1 h-8 px-3 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all bg-neutral-50 focus:bg-white"
            />
            <button
              onClick={addItem}
              disabled={!newItem.trim()}
              className="size-8 flex items-center justify-center rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Dietary notes */}
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2.5">
          <Leaf size={11} className="text-emerald-500" />
          Dietary Notes
        </p>

        {!editing ? (
          <p className="text-sm text-neutral-700 leading-relaxed">
            {customer.dietaryNotes || <span className="text-neutral-400 italic">None recorded.</span>}
          </p>
        ) : (
          <textarea
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder="e.g. Vegetarian, nut allergy, halal only…"
            rows={3}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
        )}
      </div>

      {/* Save/cancel */}
      {editing && (
        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-neutral-100">
          <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={saving}
            leftIcon={<Save size={12} />}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      )}
    </Card>
  );
}
