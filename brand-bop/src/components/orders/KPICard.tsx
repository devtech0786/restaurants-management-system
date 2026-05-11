import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  label:       string;
  value:       string | number;
  icon:        React.ElementType;
  iconBg:      string;
  iconColor:   string;
  trend?:      number;
  trendLabel?: string;
  className?:  string;
}

export default function KPICard({
  label, value, icon: Icon, iconBg, iconColor, trend, trendLabel, className,
}: KPICardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <div className={cn(
      "relative bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 overflow-hidden",
      className,
    )}>
      {/* Decorative circle */}
      <div className="absolute -top-6 -right-6 size-24 rounded-full bg-neutral-50 pointer-events-none" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest leading-none">
            {label}
          </p>
          <p className="text-3xl font-black text-neutral-900 mt-2 leading-none tabular-nums">
            {value}
          </p>

          {trend !== undefined && (
            <div className={cn(
              "inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-lg text-xs font-semibold",
              isPositive ? "bg-green-50 text-green-700"
                : isNegative ? "bg-red-50 text-red-600"
                : "bg-neutral-100 text-neutral-500",
            )}>
              {isPositive && <TrendingUp  size={11} />}
              {isNegative && <TrendingDown size={11} />}
              <span>{isPositive ? "+" : ""}{trend}%</span>
              {trendLabel && (
                <span className="text-[10px] opacity-70">{trendLabel}</span>
              )}
            </div>
          )}
        </div>

        <div className={cn(
          "size-12 rounded-2xl flex items-center justify-center flex-shrink-0",
          iconBg,
        )}>
          <Icon size={22} className={iconColor} />
        </div>
      </div>
    </div>
  );
}
