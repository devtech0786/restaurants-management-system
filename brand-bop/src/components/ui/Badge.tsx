import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-50  text-green-700  border-green-200",
  warning: "bg-amber-50  text-amber-700  border-amber-200",
  error:   "bg-red-50    text-red-700    border-red-200",
  info:    "bg-blue-50   text-blue-700   border-blue-200",
  neutral: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

const dotStyles: Record<BadgeVariant, string> = {
  success: "bg-green-500",
  warning: "bg-amber-500",
  error:   "bg-red-500",
  info:    "bg-blue-500",
  neutral: "bg-neutral-400",
};

export default function Badge({
  variant = "neutral",
  children,
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden
          className={cn("size-1.5 rounded-full flex-shrink-0", dotStyles[variant])}
        />
      )}
      {children}
    </span>
  );
}
