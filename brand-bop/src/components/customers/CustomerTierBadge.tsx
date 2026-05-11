import { Crown, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerTier } from "@/types/customer";

const TIER_CONFIG: Record<CustomerTier, {
  label: string;
  cls:   string;
  Icon:  React.ElementType;
}> = {
  new:     { label: "New",     cls: "text-blue-700   bg-blue-50   border-blue-200",   Icon: Sparkles },
  regular: { label: "Regular", cls: "text-violet-700 bg-violet-50 border-violet-200", Icon: Star     },
  vip:     { label: "VIP",     cls: "text-amber-700  bg-amber-50  border-amber-200",  Icon: Crown    },
};

interface CustomerTierBadgeProps {
  tier:  CustomerTier;
  size?: "sm" | "md";
}

export default function CustomerTierBadge({ tier, size = "sm" }: CustomerTierBadgeProps) {
  const { label, cls, Icon } = TIER_CONFIG[tier];
  return (
    <span className={cn(
      "inline-flex items-center gap-1 font-semibold rounded-full border",
      cls,
      size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
    )}>
      <Icon size={size === "sm" ? 9 : 11} />
      {label}
    </span>
  );
}

export { TIER_CONFIG };
