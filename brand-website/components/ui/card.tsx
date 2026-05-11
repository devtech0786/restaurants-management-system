import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ className, padding = "md", children, ...props }: CardProps) {
  const paddings = { none: "", sm: "p-3", md: "p-5", lg: "p-6" };
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-gray-100",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
