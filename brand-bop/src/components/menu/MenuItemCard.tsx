"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Clock, Flame, MoreHorizontal, Pencil, Trash2, Copy,
  Eye, Leaf, Wheat, Star, Sparkles, Snowflake,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { MenuItem, MenuTag, MenuItemStatus } from "@/types/menu";

const statusConfig: Record<MenuItemStatus, { variant: "success" | "neutral" | "error"; label: string }> = {
  available:    { variant: "success", label: "Available" },
  unavailable:  { variant: "neutral", label: "Unavailable" },
  out_of_stock: { variant: "error",   label: "Out of Stock" },
};

const tagIcons: Partial<Record<MenuTag, React.ElementType>> = {
  vegetarian:  Leaf,
  vegan:       Leaf,
  spicy:       Flame,
  "gluten-free": Wheat,
  popular:     Star,
  new:         Sparkles,
  seasonal:    Snowflake,
};

const tagColors: Partial<Record<MenuTag, string>> = {
  vegetarian:    "text-green-600 bg-green-50",
  vegan:         "text-emerald-600 bg-emerald-50",
  spicy:         "text-red-600 bg-red-50",
  "gluten-free": "text-amber-600 bg-amber-50",
  popular:       "text-yellow-600 bg-yellow-50",
  new:           "text-blue-600 bg-blue-50",
  seasonal:      "text-cyan-600 bg-cyan-50",
  "chef-special":"text-purple-600 bg-purple-50",
};

interface MenuItemCardProps {
  item: MenuItem;
  categoryName: string;
  categoryColor: string;
  onDelete: (item: MenuItem) => void;
  onToggleAvailability: (item: MenuItem) => void;
}

export default function MenuItemCard({
  item,
  categoryName,
  categoryColor,
  onDelete,
  onToggleAvailability,
}: MenuItemCardProps) {
  const minPrice = item.variants.length
    ? Math.min(item.basePrice, ...item.variants.map((v) => v.price))
    : item.basePrice;
  const maxPrice = item.variants.length
    ? Math.max(item.basePrice, ...item.variants.map((v) => v.price))
    : item.basePrice;
  const priceLabel =
    minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`;

  return (
    <article className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-150 flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-neutral-100 overflow-hidden flex-shrink-0">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
            <Eye size={32} />
          </div>
        )}

        {/* Category pill */}
        <span
          className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: categoryColor }}
        >
          {categoryName}
        </span>

        {/* Status badge */}
        <span className="absolute top-2.5 right-2.5">
          <Badge variant={statusConfig[item.status].variant} dot>
            {statusConfig[item.status].label}
          </Badge>
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-neutral-900 leading-snug">{item.name}</h3>
          <span className="text-sm font-bold text-brand-600 flex-shrink-0">{priceLabel}</span>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-3 flex-1">
          {item.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {item.prepTime}m
          </span>
          {item.calories && (
            <span>{item.calories} kcal</span>
          )}
          <span className="font-mono text-neutral-300">{item.sku}</span>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.map((tag) => {
              const Icon = tagIcons[tag];
              return (
                <span
                  key={tag}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize",
                    tagColors[tag] ?? "text-neutral-600 bg-neutral-100",
                  )}
                >
                  {Icon && <Icon size={9} />}
                  {tag.replace("-", " ")}
                </span>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 border-t border-neutral-100 pt-3 -mx-4 px-4">
          {/* Availability toggle */}
          <button
            onClick={() => onToggleAvailability(item)}
            title={item.isAvailable ? "Mark unavailable" : "Mark available"}
            className={cn(
              "flex-1 h-7 rounded-lg text-xs font-medium transition-colors",
              item.isAvailable
                ? "bg-green-50 text-green-700 hover:bg-green-100"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
            )}
          >
            {item.isAvailable ? "Available" : "Unavailable"}
          </button>

          <Link
            href={`/menu/${item.id}/edit`}
            className="size-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit item"
          >
            <Pencil size={13} />
          </Link>

          <button
            onClick={() => onDelete(item)}
            className="size-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete item"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}
