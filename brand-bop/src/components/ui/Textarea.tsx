"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {props.required && <span className="text-red-500 ml-0.5" aria-hidden>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={cn(
            "w-full rounded-lg border bg-white px-3 py-2 text-sm text-neutral-900",
            "placeholder:text-neutral-400 resize-none",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50",
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-neutral-200 hover:border-neutral-300",
            className,
          )}
          rows={props.rows ?? 3}
          {...props}
        />
        {error && (
          <p role="alert" className="mt-1.5 text-xs text-red-600">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;
