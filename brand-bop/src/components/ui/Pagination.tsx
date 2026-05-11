"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className,
}: PaginationProps) {
  const start = totalItems && pageSize ? (page - 1) * pageSize + 1 : null;
  const end   = totalItems && pageSize ? Math.min(page * pageSize, totalItems) : null;

  const pages = buildPageRange(page, totalPages);

  return (
    <div className={cn("flex items-center justify-between gap-4 px-4 py-3", className)}>
      {totalItems != null && start != null && end != null ? (
        <p className="text-xs text-neutral-500">
          Showing <span className="font-medium text-neutral-700">{start}–{end}</span> of{" "}
          <span className="font-medium text-neutral-700">{totalItems}</span> results
        </p>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-1" role="navigation" aria-label="Pagination">
        <NavButton
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </NavButton>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-neutral-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition-colors",
                p === page
                  ? "bg-brand-600 text-white"
                  : "text-neutral-600 hover:bg-neutral-100",
              )}
            >
              {p}
            </button>
          ),
        )}

        <NavButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </NavButton>
      </div>
    </div>
  );
}

function NavButton({
  children,
  disabled,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  "aria-label": string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "size-8 flex items-center justify-center rounded-lg text-neutral-600",
        "hover:bg-neutral-100 transition-colors",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}

function buildPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [];

  pages.push(1);
  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("…");
  pages.push(total);

  return pages;
}
