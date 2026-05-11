"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  className?: string;
}

export default function ColorPicker({
  label,
  value,
  onChange,
  helperText,
  className,
}: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("w-full", className)}>
      {label && <span className="form-label block">{label}</span>}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-3 h-9 px-3 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white transition-colors w-full focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={`Pick ${label ?? "color"}`}
      >
        <span
          className="size-5 rounded-md border border-neutral-200 flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm font-mono text-neutral-700 uppercase">{value}</span>
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
      </button>
      {helperText && <p className="mt-1.5 text-xs text-neutral-500">{helperText}</p>}
    </div>
  );
}
