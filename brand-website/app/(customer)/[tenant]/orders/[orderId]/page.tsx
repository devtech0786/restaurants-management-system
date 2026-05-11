"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Phone, Clock, CheckCircle2, Circle,
  Package, Bike, ChefHat, ClipboardCheck, XCircle,
  MessageSquare, Loader2, Banknote, CreditCard, Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { useOrder } from "@/lib/hooks/use-orders";
import { useRealtimeOrder } from "@/lib/hooks/use-realtime-order";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

/* ── Status config ───────────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<OrderStatus, {
  Icon: React.ElementType;
  label: string;
  description: string;
  gradient: string;
  ring: string;
  badge: string;
}> = {
  PENDING:          { Icon: ClipboardCheck, label: "Order Placed",       description: "We received your order",          gradient: "from-amber-500 to-orange-400",   ring: "ring-amber-200",   badge: "bg-amber-100 text-amber-700"   },
  CONFIRMED:        { Icon: CheckCircle2,   label: "Order Confirmed",    description: "Restaurant accepted your order",   gradient: "from-blue-500 to-indigo-500",    ring: "ring-blue-200",    badge: "bg-blue-100 text-blue-700"     },
  PREPARING:        { Icon: ChefHat,        label: "Being Prepared",     description: "Chef is cooking your meal",        gradient: "from-violet-500 to-purple-500",  ring: "ring-violet-200",  badge: "bg-violet-100 text-violet-700" },
  READY:            { Icon: Package,        label: "Ready for Pickup",   description: "Your order is packed & ready",    gradient: "from-indigo-500 to-blue-400",    ring: "ring-indigo-200",  badge: "bg-indigo-100 text-indigo-700" },
  OUT_FOR_DELIVERY: { Icon: Bike,           label: "Out for Delivery",   description: "Rider is heading your way",       gradient: "from-brand-500 to-orange-500",   ring: "ring-brand-200",   badge: "bg-brand-50 text-brand-700"    },
  DELIVERED:        { Icon: CheckCircle2,   label: "Delivered",          description: "Enjoy your meal!",                gradient: "from-emerald-500 to-green-400",  ring: "ring-emerald-200", badge: "bg-emerald-100 text-emerald-700"},
  CANCELLED:        { Icon: XCircle,        label: "Cancelled",          description: "This order was cancelled",        gradient: "from-red-500 to-rose-500",       ring: "ring-red-200",     badge: "bg-red-100 text-red-700"       },
};

const STEPS: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"];

const PAYMENT_ICONS: Record<string, React.ElementType> = {
  CASH: Banknote, CARD: CreditCard, ONLINE: Smartphone,
};

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function OrderDetailPage() {
  const params  = useParams<{ tenant: string; orderId: string }>();
  const { data: order, isLoading, isError, refetch } = useOrder(params.orderId);
  const { status: realtimeStatus } = useRealtimeOrder(params.orderId);

  const currentStatus = (realtimeStatus ?? order?.status) as OrderStatus | undefined;
  const config      = currentStatus ? STATUS_CONFIG[currentStatus] : null;
  const currentIdx  = currentStatus ? STEPS.indexOf(currentStatus) : -1;
  const isCancelled = currentStatus === "CANCELLED";
  const isDone      = currentStatus === "DELIVERED";

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto">
            <Loader2 size={28} className="text-brand-500 animate-spin" />
          </div>
          <p className="text-sm text-gray-400 font-medium">Loading your order…</p>
        </div>
      </div>
    );
  }

  /* ── Error / Not found ── */
  if (isError || !order || !currentStatus || !config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-5 max-w-sm w-full">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto">
            <XCircle size={36} className="text-red-400" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">Order not found</h2>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              {isError
                ? "We couldn't load this order. Please check your connection or sign in and try again."
                : "This order doesn't exist or may have been removed."}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {isError && (
              <button
                onClick={() => refetch()}
                className="w-full py-3 rounded-2xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600 transition-colors"
              >
                Try again
              </button>
            )}
            <Link
              href={`/${params.tenant}/orders`}
              className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={15} /> View all orders
            </Link>
            <Link
              href={`/${params.tenant}`}
              className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon  = config.Icon;
  const totalItems  = order.items.reduce((s, i) => s + i.quantity, 0);
  const PaymentIcon = PAYMENT_ICONS[order.paymentMethod] ?? Banknote;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">

      {/* ── Sticky header ── */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href={`/${params.tenant}/orders`}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">Order #{order.orderNumber}</p>
            <p className="text-[11px] text-gray-400">{formatDate(order.createdAt)}</p>
          </div>
          <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full shrink-0", config.badge)}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">

        {/* ── Hero status card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br", config.gradient)}
        >
          <div className="px-6 py-8 relative overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute right-6 top-16 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />

            <div className="relative flex items-center gap-5">
              {/* Icon */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <StatusIcon size={38} className="text-white" strokeWidth={1.5} />
                </div>
                {!isDone && !isCancelled && (
                  <motion.div
                    className="absolute -inset-1.5 rounded-2xl border-2 border-white/30"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </div>

              <div>
                <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-1">
                  {isDone ? "Completed" : isCancelled ? "Order Status" : "Live Status"}
                </p>
                <h2 className="text-white font-black text-2xl font-heading leading-tight">
                  {config.label}
                </h2>
                <p className="text-white/80 text-sm mt-1">{config.description}</p>
              </div>
            </div>

            {/* Progress bar (active orders only) */}
            {!isCancelled && !isDone && (
              <div className="relative mt-6 pt-5 border-t border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-white/70" />
                    <span className="text-white/70 text-xs font-medium">Estimated delivery</span>
                  </div>
                  <span className="text-white font-bold text-sm">25–35 min</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(8, ((currentIdx + 1) / STEPS.length) * 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <div className="flex justify-between text-white/40 text-[10px] mt-1.5">
                  <span>Order placed</span>
                  <span>Delivered</span>
                </div>
              </div>
            )}

            {/* Delivered — total paid */}
            {isDone && (
              <div className="relative mt-5 pt-5 border-t border-white/20 flex items-center justify-between">
                <span className="text-white/70 text-sm">Total paid</span>
                <span className="text-white font-black text-xl">{formatCurrency(order.total)}</span>
              </div>
            )}

            {/* Cancelled reason */}
            {isCancelled && order.statusHistory.find((e) => e.status === "CANCELLED")?.note && (
              <div className="relative mt-5 pt-5 border-t border-white/20">
                <p className="text-white/80 text-xs">
                  Reason: {order.statusHistory.find((e) => e.status === "CANCELLED")?.note}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Order Timeline ── */}
        {!isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Order Progress</h3>
              <span className="text-[11px] text-gray-400 font-medium">
                Step {Math.min(currentIdx + 1, STEPS.length)} of {STEPS.length}
              </span>
            </div>

            <div className="px-5 py-5">
              {STEPS.map((step, idx) => {
                const done     = idx < currentIdx;
                const active   = idx === currentIdx;
                const upcoming = idx > currentIdx;
                const event    = order.statusHistory.find((e) => e.status === step);
                const StepIcon = STATUS_CONFIG[step].Icon;

                return (
                  <div key={step} className="flex items-start gap-4">
                    {/* Icon + connector line */}
                    <div className="flex flex-col items-center shrink-0">
                      <motion.div
                        animate={active ? { scale: [1, 1.08, 1] } : {}}
                        transition={active ? { duration: 2, repeat: Infinity } : {}}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                          done     && "bg-emerald-500",
                          active   && cn("bg-brand-500 shadow-lg shadow-brand-500/30", STATUS_CONFIG[step].ring, "ring-4"),
                          upcoming && "bg-gray-100",
                        )}
                      >
                        {done ? (
                          <CheckCircle2 size={18} className="text-white" />
                        ) : active ? (
                          <StepIcon size={18} className="text-white" />
                        ) : (
                          <Circle size={15} className="text-gray-300" />
                        )}
                      </motion.div>

                      {idx < STEPS.length - 1 && (
                        <div className={cn(
                          "w-0.5 h-8 mt-1.5 rounded-full transition-colors duration-700",
                          done ? "bg-emerald-300" : "bg-gray-100",
                        )} />
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex-1 pb-6 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn(
                          "font-semibold text-sm transition-colors",
                          done     && "text-gray-600",
                          active   && "text-brand-600",
                          upcoming && "text-gray-300",
                        )}>
                          {STATUS_CONFIG[step].label}
                        </p>
                        {event && (
                          <span className="text-[11px] text-gray-400 shrink-0 font-medium">
                            {formatDate(event.timestamp)}
                          </span>
                        )}
                      </div>

                      <p className={cn(
                        "text-xs mt-0.5",
                        (done || active) ? "text-gray-400" : "text-gray-200",
                      )}>
                        {STATUS_CONFIG[step].description}
                      </p>

                      {active && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 flex items-center gap-1.5"
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                          </span>
                          <span className="text-xs text-brand-500 font-semibold">In progress</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Order Items + Bill ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Order Items</h3>
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
              {totalItems} item{totalItems !== 1 && "s"}
            </span>
          </div>

          {/* Items list */}
          <div className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-2xl shrink-0">
                  🍔
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                  {item.variants.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{item.variants.join(" · ")}</p>
                  )}
                  {item.addons.length > 0 && (
                    <p className="text-xs text-gray-400 truncate">+{item.addons.join(", ")}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">×{item.quantity}</p>
                </div>
                <p className="font-bold text-gray-800 text-sm shrink-0">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Bill summary */}
          <div className="px-5 py-4 bg-gray-50 space-y-2.5 text-sm border-t border-gray-100">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-medium text-gray-700">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery fee</span>
              {order.deliveryFee === 0 ? (
                <span className="text-emerald-600 font-semibold">FREE</span>
              ) : (
                <span className="font-medium text-gray-700">{formatCurrency(order.deliveryFee)}</span>
              )}
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>−{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-base pt-2.5 border-t border-gray-200">
              <span className="text-gray-900">Total</span>
              <span className="text-brand-600">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Delivery + Payment ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">Delivery Details</h3>
          </div>

          <div className="divide-y divide-gray-50">
            {/* Address */}
            <div className="flex items-start gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <MapPin size={17} className="text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium mb-0.5">Delivery address</p>
                <p className="text-sm font-semibold text-gray-800">{order.deliveryAddress.street}</p>
                <p className="text-sm text-gray-500">{order.deliveryAddress.city}</p>
                {order.deliveryAddress.notes && (
                  <p className="text-xs text-gray-400 italic mt-1">Note: {order.deliveryAddress.notes}</p>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <PaymentIcon size={17} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Payment method</p>
                <p className="text-sm font-semibold text-gray-800">
                  {order.paymentMethod === "CASH"   && "Cash on Delivery"}
                  {order.paymentMethod === "CARD"   && "Card on Delivery"}
                  {order.paymentMethod === "ONLINE" && "Online Payment"}
                </p>
                <p className={cn(
                  "text-xs font-semibold mt-0.5",
                  order.paymentStatus === "PAID"    && "text-emerald-600",
                  order.paymentStatus === "PENDING" && "text-amber-600",
                  order.paymentStatus === "FAILED"  && "text-red-500",
                )}>
                  {order.paymentStatus === "PAID"    && "Paid"}
                  {order.paymentStatus === "PENDING" && "Payment pending"}
                  {order.paymentStatus === "FAILED"  && "Payment failed"}
                  {order.paymentStatus === "REFUNDED" && "Refunded"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Help card ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <MessageSquare size={17} className="text-gray-500" />
            </div>
            <h3 className="font-bold text-gray-900">Need help?</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Having an issue with your order? We're here to help.
          </p>
          <a
            href="tel:+921111234567"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            <Phone size={16} className="text-brand-500" />
            Call Restaurant
          </a>
        </motion.div>

      </div>
    </div>
  );
}
