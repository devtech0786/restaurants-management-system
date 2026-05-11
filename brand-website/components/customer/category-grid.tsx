"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { MenuItem } from "@/types";

interface Category {
  id:    string;
  name:  string;
  items: MenuItem[];
}

interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
}

/* Navbar height = 64px (h-16). Category bar sits at top-16.
   Scroll offset = navbar + category bar height (~52px) + 8px breathing room. */
const SCROLL_OFFSET = 130;

export function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  const [active,     setActive]     = useState<string | null>(null);
  const [overflowL,  setOverflowL]  = useState(false);
  const [overflowR,  setOverflowR]  = useState(false);
  const [manualNav,  setManualNav]  = useState(false);

  const railRef  = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Overflow shadow detection ── */
  const checkOverflow = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setOverflowL(el.scrollLeft > 4);
    setOverflowR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    checkOverflow();
    el.addEventListener("scroll", checkOverflow, { passive: true });
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", checkOverflow); ro.disconnect(); };
  }, [checkOverflow, categories]);

  /* ── Center active pill in rail ── */
  const centerPill = useCallback((id: string | null) => {
    const el   = railRef.current;
    const pill = id ? el?.querySelector<HTMLElement>(`[data-cat="${id}"]`) : null;
    if (!el || !pill) return;
    const targetLeft = pill.offsetLeft - el.clientWidth / 2 + pill.offsetWidth / 2;
    el.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, []);

  /* ── IntersectionObserver scroll-spy ── */
  useEffect(() => {
    if (!categories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (manualNav) return;
        // pick the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
          const id = (visible[0].target as HTMLElement).dataset.catId ?? null;
          setActive(id);
          centerPill(id);
        }
      },
      { rootMargin: `-${SCROLL_OFFSET}px 0px -55% 0px`, threshold: 0 },
    );

    categories.forEach((cat) => {
      const el = document.getElementById(`cat-${cat.id}`);
      if (el) { el.dataset.catId = cat.id; observer.observe(el); }
    });

    return () => observer.disconnect();
  }, [categories, manualNav, centerPill]);

  /* ── Click handler ── */
  const handleClick = (e: React.MouseEvent, id: string | null) => {
    e.preventDefault();
    setActive(id);
    centerPill(id);

    // suppress scroll-spy briefly so the active pill doesn't flicker
    setManualNav(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setManualNav(false), 800);

    if (id === null) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const section = document.getElementById(`cat-${id}`);
    if (!section) return;
    const y = section.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  /* ── Skeleton ── */
  if (isLoading) {
    return (
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 rounded-full" style={{ width: `${60 + (i % 3) * 20}px` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">

        {/* Left fade */}
        {overflowL && (
          <div className="absolute left-4 lg:left-8 top-0 bottom-0 w-12 bg-gradient-to-r from-white/95 to-transparent z-10 pointer-events-none" />
        )}
        {/* Right fade */}
        {overflowR && (
          <div className="absolute right-4 lg:right-8 top-0 bottom-0 w-12 bg-gradient-to-l from-white/95 to-transparent z-10 pointer-events-none" />
        )}

        {/* Scrollable pill rail */}
        <div
          ref={railRef}
          className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide"
        >
          {/* All pill */}
          <button
            data-cat="all"
            onClick={(e) => handleClick(e, null)}
            className={cn(
              "shrink-0 relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap",
              active === null
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/30 scale-[1.03]"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700",
            )}
          >
            All
            {active === null && (
              <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0" />
            )}
          </button>

          {categories.map((cat, i) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                data-cat={cat.id}
                onClick={(e) => handleClick(e, cat.id)}
                className={cn(
                  "shrink-0 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/30 scale-[1.03]"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700",
                )}
              >
                {cat.name}

                {/* Item count badge */}
                <span className={cn(
                  "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold transition-all",
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-white text-gray-500",
                )}>
                  {cat.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active indicator line */}
      <div className="h-[2px] bg-gray-50">
        <div
          className="h-full bg-brand-500 transition-all duration-500 origin-left"
          style={{
            width: active === null
              ? "0%"
              : `${((categories.findIndex((c) => c.id === active) + 1) / (categories.length + 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
