"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/types/menu";

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeId: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
}

export default function CategoryTabs({
  categories,
  activeId,
  onChange,
  counts,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const all = [
    { id: "all", name: "All Items", color: "#71717a" },
    ...categories.filter((c) => c.status === "active"),
  ];

  return (
    <div
      ref={scrollRef}
      role="tablist"
      aria-label="Menu categories"
      className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1"
    >
      {all.map((cat) => {
        const active = activeId === cat.id;
        const count  = cat.id === "all"
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : (counts[cat.id] ?? 0);

        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(cat.id)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0",
              active
                ? "text-white shadow-sm"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900",
            )}
            style={active ? { backgroundColor: cat.color } : undefined}
          >
            {cat.name}
            <span
              className={cn(
                "min-w-[20px] h-5 px-1 rounded-full text-[10px] font-semibold flex items-center justify-center",
                active ? "bg-white/25 text-white" : "bg-neutral-100 text-neutral-500",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
