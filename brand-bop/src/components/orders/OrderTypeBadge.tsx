import { UtensilsCrossed, ShoppingBag, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderType } from "@/types/order";

const TYPE_CONFIG: Record<
  OrderType,
  { label: string; icon: React.ElementType; className: string }
> = {
  "dine-in":  { label: "Dine-in",  icon: UtensilsCrossed, className: "bg-violet-50 text-violet-700 border-violet-200" },
  takeaway:   { label: "Takeaway", icon: ShoppingBag,      className: "bg-blue-50 text-blue-700 border-blue-200"       },
  delivery:   { label: "Delivery", icon: Truck,            className: "bg-orange-50 text-orange-700 border-orange-200" },
};

interface OrderTypeBadgeProps {
  type: OrderType;
  showIcon?: boolean;
}

export default function OrderTypeBadge({ type, showIcon = true }: OrderTypeBadgeProps) {
  const cfg = TYPE_CONFIG[type];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        cfg.className,
      )}
    >
      {showIcon && <Icon size={11} aria-hidden />}
      {cfg.label}
    </span>
  );
}
