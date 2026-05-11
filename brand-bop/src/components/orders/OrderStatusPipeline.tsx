import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus, OrderType, StatusEvent } from "@/types/order";

const DINE_IN_STEPS:   OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "completed"];
const TAKEAWAY_STEPS:  OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "completed"];
const DELIVERY_STEPS:  OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "completed"];

const STEP_LABELS: Partial<Record<OrderStatus, string>> = {
  pending:          "Placed",
  confirmed:        "Confirmed",
  preparing:        "Preparing",
  ready:            "Ready",
  out_for_delivery: "On the Way",
  completed:        "Completed",
};

function getSteps(type: OrderType): OrderStatus[] {
  if (type === "delivery") return DELIVERY_STEPS;
  return DINE_IN_STEPS;
}

function getStepIndex(steps: OrderStatus[], status: OrderStatus): number {
  if (status === "cancelled" || status === "refunded") return -1;
  return steps.indexOf(status);
}

interface OrderStatusPipelineProps {
  type: OrderType;
  status: OrderStatus;
  statusHistory: StatusEvent[];
  compact?: boolean;
}

export default function OrderStatusPipeline({
  type,
  status,
  statusHistory,
  compact = false,
}: OrderStatusPipelineProps) {
  const isCancelled = status === "cancelled" || status === "refunded";
  const steps       = getSteps(type);
  const currentIdx  = getStepIndex(steps, status);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
        <span className="size-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">✕</span>
        </span>
        <span className="text-sm font-medium text-red-700 capitalize">{status}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start", compact ? "gap-1" : "gap-0")}>
      {steps.map((step, idx) => {
        const isDone    = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isPending = idx > currentIdx;
        const histEntry = statusHistory.find((h) => h.status === step);
        const isLast    = idx === steps.length - 1;

        return (
          <div key={step} className={cn("flex items-center", !isLast && "flex-1")}>
            {/* Node + Label */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={cn(
                  "rounded-full flex items-center justify-center transition-all",
                  compact ? "size-5" : "size-8",
                  isDone    && "bg-green-500",
                  isCurrent && "bg-brand-600 ring-4 ring-brand-100",
                  isPending && "bg-neutral-200",
                )}
              >
                {isDone ? (
                  <Check size={compact ? 10 : 14} className="text-white" />
                ) : (
                  <span
                    className={cn(
                      "rounded-full",
                      compact ? "size-2" : "size-2.5",
                      isCurrent ? "bg-white" : "bg-neutral-400",
                    )}
                  />
                )}
              </div>

              {!compact && (
                <div className="text-center max-w-[80px]">
                  <p className={cn(
                    "text-[11px] font-medium leading-tight",
                    isDone    && "text-green-600",
                    isCurrent && "text-brand-700",
                    isPending && "text-neutral-400",
                  )}>
                    {STEP_LABELS[step] ?? step}
                  </p>
                  {histEntry && (
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {new Date(histEntry.at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-1 rounded-full transition-colors",
                  idx < currentIdx ? "bg-green-400" : "bg-neutral-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
