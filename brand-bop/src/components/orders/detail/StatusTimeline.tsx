"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { ORDER_STATUS_CONFIG } from "@/components/orders/OrderStatusBadge";
import { cn } from "@/lib/utils";
import type { StatusEvent } from "@/types/order";

interface StatusTimelineProps {
  events: StatusEvent[];
}

function durationBetween(a: string, b: string): string {
  const ms   = new Date(b).getTime() - new Date(a).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 1)  return "< 1 min";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function StatusTimeline({ events }: StatusTimelineProps) {
  const [expanded, setExpanded] = useState(true);

  const sorted  = [...events].sort(
    (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
  );

  const totalDuration =
    sorted.length >= 2
      ? durationBetween(sorted[0].at, sorted[sorted.length - 1].at)
      : null;

  return (
    <Card padding="none">
      {/* Header toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors rounded-xl text-left"
      >
        <div>
          <p className="text-sm font-semibold text-neutral-900">Status Timeline</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            {sorted.length} event{sorted.length !== 1 ? "s" : ""}
            {totalDuration && ` · total time ${totalDuration}`}
          </p>
        </div>
        {expanded
          ? <ChevronUp size={16} className="text-neutral-400" />
          : <ChevronDown size={16} className="text-neutral-400" />}
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          <div className="relative">
            {/* Vertical guide line */}
            <div className="absolute left-[18px] top-3 bottom-3 w-0.5 bg-neutral-100 rounded-full" aria-hidden />

            <div className="space-y-0">
              {sorted.map((event, i) => {
                const cfg      = ORDER_STATUS_CONFIG[event.status];
                const isLast   = i === sorted.length - 1;
                const nextAt   = sorted[i + 1]?.at;
                const duration = nextAt ? durationBetween(event.at, nextAt) : null;

                return (
                  <div key={i} className="relative flex items-start gap-4">
                    {/* Node */}
                    <div
                      className={cn(
                        "relative z-10 size-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm",
                        cfg.bg,
                      )}
                      aria-hidden
                    >
                      <span className={cn("size-2.5 rounded-full", cfg.dot)} />
                    </div>

                    {/* Content */}
                    <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                      <div className="flex items-start justify-between gap-2 pt-1.5">
                        <div>
                          <span className={cn("text-sm font-semibold", cfg.text)}>
                            {cfg.label}
                          </span>
                          {event.by && (
                            <span className="text-xs text-neutral-400 ml-2">by {event.by}</span>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-medium text-neutral-600">
                            {new Date(event.at).toLocaleTimeString("en-US", {
                              hour:   "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            {new Date(event.at).toLocaleDateString("en-US", {
                              month: "short",
                              day:   "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {event.note && (
                        <p className="mt-1.5 text-xs text-neutral-500 italic bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
                          "{event.note}"
                        </p>
                      )}

                      {duration && !isLast && (
                        <div className="flex items-center gap-1 mt-3 text-[10px] text-neutral-400">
                          <Clock size={9} />
                          <span>{duration} until next step</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
