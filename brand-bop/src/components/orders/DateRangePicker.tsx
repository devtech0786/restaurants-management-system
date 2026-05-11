"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DateRange = "today" | "yesterday" | "week" | "month" | "custom";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange, from?: string, to?: string) => void;
  className?: string;
}

const PRESETS: { value: DateRange; label: string }[] = [
  { value: "today",     label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week",      label: "This Week" },
  { value: "month",     label: "This Month" },
  { value: "custom",    label: "Custom Range" },
];

export function getDateBounds(range: DateRange): { from: Date; to: Date } {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case "today":
      return { from: today, to: now };
    case "yesterday": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { from: y, to: new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59) };
    }
    case "week": {
      const w = new Date(today);
      w.setDate(w.getDate() - w.getDay());
      return { from: w, to: now };
    }
    case "month": {
      const m = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: m, to: now };
    }
    default:
      return { from: today, to: now };
  }
}

export default function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen]       = useState(false);
  const [customFrom, setFrom] = useState("");
  const [customTo,   setTo]   = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = PRESETS.find((p) => p.value === value)?.label ?? "Select Range";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 h-9 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-700 hover:border-neutral-300 transition-colors"
      >
        <CalendarDays size={14} className="text-neutral-400" />
        <span>{label}</span>
        <ChevronDown size={13} className={cn("text-neutral-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-11 z-30 w-56 bg-white rounded-xl border border-neutral-200 shadow-lg py-1.5 animate-fade-in"
        >
          {PRESETS.filter((p) => p.value !== "custom").map((preset) => (
            <button
              key={preset.value}
              role="option"
              aria-selected={value === preset.value}
              onClick={() => { onChange(preset.value); setOpen(false); }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm transition-colors",
                value === preset.value
                  ? "bg-brand-50 text-brand-700 font-medium"
                  : "text-neutral-700 hover:bg-neutral-50",
              )}
            >
              {preset.label}
            </button>
          ))}

          <div className="border-t border-neutral-100 my-1.5 px-4 pt-2 pb-1">
            <p className="text-xs text-neutral-500 font-medium mb-2">Custom Range</p>
            <div className="space-y-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full h-8 px-2 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="From"
              />
              <input
                type="date"
                value={customTo}
                onChange={(e) => setTo(e.target.value)}
                className="w-full h-8 px-2 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="To"
              />
              <button
                onClick={() => {
                  if (customFrom && customTo) {
                    onChange("custom", customFrom, customTo);
                    setOpen(false);
                  }
                }}
                disabled={!customFrom || !customTo}
                className="w-full h-8 rounded-lg bg-brand-600 text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
