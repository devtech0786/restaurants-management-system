"use client";

import { Flame, Leaf, Wheat, Star, Sparkles, Snowflake, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuTag, Allergen } from "@/types/menu";

/* ─── Tag Selector ──────────────────────────────────────────── */

const ALL_TAGS: { value: MenuTag; label: string; icon: React.ElementType; color: string }[] = [
  { value: "popular",      label: "Popular",      icon: Star,      color: "text-yellow-600 bg-yellow-50 border-yellow-200 data-[active]:bg-yellow-500 data-[active]:text-white data-[active]:border-yellow-500" },
  { value: "new",          label: "New",          icon: Sparkles,  color: "text-blue-600 bg-blue-50 border-blue-200 data-[active]:bg-blue-500 data-[active]:text-white data-[active]:border-blue-500" },
  { value: "chef-special", label: "Chef Special", icon: ChefHat,   color: "text-purple-600 bg-purple-50 border-purple-200 data-[active]:bg-purple-500 data-[active]:text-white data-[active]:border-purple-500" },
  { value: "vegetarian",   label: "Vegetarian",   icon: Leaf,      color: "text-green-600 bg-green-50 border-green-200 data-[active]:bg-green-600 data-[active]:text-white data-[active]:border-green-600" },
  { value: "vegan",        label: "Vegan",        icon: Leaf,      color: "text-emerald-600 bg-emerald-50 border-emerald-200 data-[active]:bg-emerald-600 data-[active]:text-white data-[active]:border-emerald-600" },
  { value: "gluten-free",  label: "Gluten-Free",  icon: Wheat,     color: "text-amber-600 bg-amber-50 border-amber-200 data-[active]:bg-amber-500 data-[active]:text-white data-[active]:border-amber-500" },
  { value: "spicy",        label: "Spicy",        icon: Flame,     color: "text-red-600 bg-red-50 border-red-200 data-[active]:bg-red-500 data-[active]:text-white data-[active]:border-red-500" },
  { value: "seasonal",     label: "Seasonal",     icon: Snowflake, color: "text-cyan-600 bg-cyan-50 border-cyan-200 data-[active]:bg-cyan-500 data-[active]:text-white data-[active]:border-cyan-500" },
];

interface TagSelectorProps {
  label?: string;
  value: MenuTag[];
  onChange: (tags: MenuTag[]) => void;
}

export function TagSelector({ label = "Tags", value, onChange }: TagSelectorProps) {
  const toggle = (tag: MenuTag) =>
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);

  return (
    <div>
      <p className="form-label">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Select tags">
        {ALL_TAGS.map((t) => {
          const active = value.includes(t.value);
          return (
            <button
              key={t.value}
              type="button"
              data-active={active ? "" : undefined}
              aria-pressed={active}
              onClick={() => toggle(t.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                t.color,
              )}
            >
              <t.icon size={11} />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Allergen Selector ─────────────────────────────────────── */

const ALL_ALLERGENS: { value: Allergen; label: string; emoji: string }[] = [
  { value: "gluten",    label: "Gluten",    emoji: "🌾" },
  { value: "dairy",     label: "Dairy",     emoji: "🥛" },
  { value: "egg",       label: "Egg",       emoji: "🥚" },
  { value: "nuts",      label: "Nuts",      emoji: "🥜" },
  { value: "fish",      label: "Fish",      emoji: "🐟" },
  { value: "shellfish", label: "Shellfish", emoji: "🦐" },
  { value: "soy",       label: "Soy",       emoji: "🫘" },
  { value: "sesame",    label: "Sesame",    emoji: "🌿" },
];

interface AllergenSelectorProps {
  label?: string;
  value: Allergen[];
  onChange: (allergens: Allergen[]) => void;
}

export function AllergenSelector({ label = "Allergens", value, onChange }: AllergenSelectorProps) {
  const toggle = (a: Allergen) =>
    onChange(value.includes(a) ? value.filter((x) => x !== a) : [...value, a]);

  return (
    <div>
      <p className="form-label">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Select allergens">
        {ALL_ALLERGENS.map((a) => {
          const active = value.includes(a.value);
          return (
            <button
              key={a.value}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(a.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                active
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-red-300 hover:text-red-600",
              )}
            >
              <span aria-hidden>{a.emoji}</span>
              {a.label}
            </button>
          );
        })}
      </div>
      {value.length > 0 && (
        <p className="mt-1.5 text-xs text-neutral-500">
          Contains: {value.join(", ")}
        </p>
      )}
    </div>
  );
}
