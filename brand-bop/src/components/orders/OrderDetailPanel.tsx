"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Printer, MapPin, Phone, Mail, User,
  Utensils, CreditCard, Clock, Store, AlertCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Card, CardHeader, Divider } from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import OrderStatusBadge, { PaymentStatusBadge, ORDER_STATUS_CONFIG } from "./OrderStatusBadge";
import OrderTypeBadge from "./OrderTypeBadge";
import OrderStatusPipeline from "./OrderStatusPipeline";
import type { Order, OrderStatus } from "@/types/order";

const ADVANCE_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:          "confirmed",
  confirmed:        "preparing",
  preparing:        "ready",
  ready:            "out_for_delivery",
  out_for_delivery: "completed",
};

const ADVANCE_LABEL: Partial<Record<OrderStatus, string>> = {
  pending:          "Confirm Order",
  confirmed:        "Send to Kitchen",
  preparing:        "Mark as Ready",
  ready:            "Out for Delivery",
  out_for_delivery: "Mark as Delivered",
};

interface OrderDetailPanelProps {
  initialOrder: Order;
}

export default function OrderDetailPanel({ initialOrder }: OrderDetailPanelProps) {
  const router = useRouter();
  const [order, setOrder]       = useState<Order>(initialOrder);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setReason]   = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [advancing, setAdvancing]   = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const isFinal     = order.status === "completed" || order.status === "cancelled" || order.status === "refunded";
  const nextStatus  = ADVANCE_STATUS[order.status];
  const advLabel    = ADVANCE_LABEL[order.status];

  const handleAdvance = async () => {
    if (!nextStatus) return;
    setAdvancing(true);
    await new Promise((r) => setTimeout(r, 700));
    const now = new Date().toISOString();
    setOrder((prev) => ({
      ...prev,
      status: nextStatus,
      updatedAt: now,
      completedAt: nextStatus === "completed" ? now : prev.completedAt,
      statusHistory: [...prev.statusHistory, { status: nextStatus, at: now, by: "Admin" }],
    }));
    toast("success", `Order updated to: ${ORDER_STATUS_CONFIG[nextStatus].label}`);
    setAdvancing(false);
  };

  const handleCancel = async () => {
    setCancelling(true);
    await new Promise((r) => setTimeout(r, 700));
    const now = new Date().toISOString();
    setOrder((prev) => ({
      ...prev,
      status: "cancelled",
      updatedAt: now,
      cancellationReason: cancelReason,
      statusHistory: [...prev.statusHistory, { status: "cancelled", at: now, by: "Admin", note: cancelReason }],
    }));
    toast("success", "Order cancelled.");
    setCancelOpen(false);
    setReason("");
    setCancelling(false);
  };

  const paymentMethodLabel: Record<string, string> = {
    cash: "Cash", card: "Card", online: "Online Payment", split: "Split Payment",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => router.back()}>
          Back to Orders
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer size={14} />}
            onClick={() => { toast("info", "Print receipt — coming soon."); }}
          >
            Print Receipt
          </Button>
          {!isFinal && nextStatus && advLabel && (
            <Button variant="primary" size="sm" loading={advancing} onClick={handleAdvance}>
              {advLabel}
            </Button>
          )}
          {!isFinal && (
            <Button variant="danger" size="sm" onClick={() => setCancelOpen(true)}>
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Header card */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-lg font-semibold text-neutral-900 font-mono">{order.orderNumber}</h1>
              {order.isPriority && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <AlertCircle size={11} />
                  Priority
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <OrderTypeBadge type={order.type} />
              <OrderStatusBadge status={order.status} size="md" />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>
          <div className="text-right text-sm text-neutral-500">
            <p>Placed: {new Date(order.placedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
            {order.estimatedReadyAt && (
              <p className="flex items-center gap-1 justify-end mt-0.5 text-brand-600 font-medium">
                <Clock size={12} />
                Ready by {new Date(order.estimatedReadyAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
            {order.completedAt && (
              <p className="mt-0.5 text-green-600">Completed: {new Date(order.completedAt).toLocaleString("en-US", { timeStyle: "short" })}</p>
            )}
          </div>
        </div>

        {/* Status pipeline */}
        {!isFinal || order.status === "completed" ? (
          <OrderStatusPipeline
            type={order.type}
            status={order.status}
            statusHistory={order.statusHistory}
          />
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle size={16} className="text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-700">Order Cancelled</p>
              {order.cancellationReason && (
                <p className="text-xs text-red-500 mt-0.5">{order.cancellationReason}</p>
              )}
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — items + payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader title="Order Items" description={`${order.items.length} item${order.items.length > 1 ? "s" : ""}`} />
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.menuItemName}
                      className="size-12 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{item.menuItemName}</p>
                        {item.variantName && (
                          <p className="text-xs text-neutral-500">{item.variantName}</p>
                        )}
                        <p className="text-[11px] text-neutral-400 mt-0.5">{item.categoryName}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-neutral-900">${item.totalPrice.toFixed(2)}</p>
                        <p className="text-xs text-neutral-400">${item.unitPrice.toFixed(2)} × {item.quantity}</p>
                      </div>
                    </div>
                    {item.specialNote && (
                      <div className="mt-2 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-700 flex items-start gap-1">
                          <AlertCircle size={11} className="flex-shrink-0 mt-0.5" />
                          {item.specialNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-5 pt-5 border-t border-neutral-100 space-y-2">
              {[
                { label: "Subtotal",     value: order.subtotal },
                order.discount > 0 && { label: "Discount",    value: -order.discount },
                order.deliveryFee > 0 && { label: "Delivery Fee", value: order.deliveryFee },
                { label: "Tax",          value: order.tax },
              ].filter(Boolean).map((row) => {
                const r = row as { label: string; value: number };
                return (
                  <div key={r.label} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">{r.label}</span>
                    <span className={cn("font-medium", r.value < 0 ? "text-green-600" : "text-neutral-700")}>
                      {r.value < 0 ? "-" : ""}${Math.abs(r.value).toFixed(2)}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <span className="text-sm font-semibold text-neutral-900">Total</span>
                <span className="text-lg font-bold text-neutral-900">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Status History */}
          <Card padding="none">
            <button
              onClick={() => setHistoryOpen((o) => !o)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-neutral-50 transition-colors rounded-xl"
              aria-expanded={historyOpen}
            >
              <div>
                <p className="text-sm font-semibold text-neutral-900">Status History</p>
                <p className="text-xs text-neutral-400">{order.statusHistory.length} events</p>
              </div>
              {historyOpen ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}
            </button>

            {historyOpen && (
              <div className="px-6 pb-5">
                <div className="space-y-3">
                  {[...order.statusHistory].reverse().map((event, i) => {
                    const cfg = ORDER_STATUS_CONFIG[event.status];
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className={cn("size-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", cfg.bg)}>
                          <span className={cn("size-2 rounded-full", cfg.dot)} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-xs font-semibold", cfg.text)}>{cfg.label}</span>
                            {event.by && <span className="text-xs text-neutral-400">by {event.by}</span>}
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            {new Date(event.at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                          </p>
                          {event.note && (
                            <p className="text-xs text-neutral-500 mt-1 italic">{event.note}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right column — customer, payment, location */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader title="Customer" />
            <div className="space-y-3">
              <InfoRow icon={<User size={14} />} label="Name"  value={order.customer.name} />
              <InfoRow icon={<Phone size={14} />} label="Phone" value={order.customer.phone} />
              {order.customer.email && (
                <InfoRow icon={<Mail size={14} />} label="Email" value={order.customer.email} />
              )}
              {order.assignedStaff && (
                <InfoRow icon={<Utensils size={14} />} label="Staff" value={order.assignedStaff} />
              )}
            </div>
          </Card>

          {/* Delivery / Table */}
          <Card>
            <CardHeader title={order.type === "dine-in" ? "Table" : order.type === "delivery" ? "Delivery Address" : "Pickup"} />
            {order.tableNumber && (
              <InfoRow icon={<MapPin size={14} />} label="Table" value={order.tableNumber} />
            )}
            {order.deliveryAddress && (
              <InfoRow icon={<MapPin size={14} />} label="Address" value={order.deliveryAddress} />
            )}
            {order.type === "takeaway" && (
              <p className="text-sm text-neutral-500">Customer collects in store.</p>
            )}
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader title="Payment" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Status</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              {order.paymentMethod && (
                <InfoRow
                  icon={<CreditCard size={14} />}
                  label="Method"
                  value={paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}
                />
              )}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <span className="text-sm font-semibold text-neutral-900">Grand Total</span>
                <span className="text-base font-bold text-neutral-900">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Branch */}
          <Card>
            <CardHeader title="Branch" />
            <InfoRow icon={<Store size={14} />} label="Location" value={order.franchiseName} />
          </Card>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        open={cancelOpen}
        onClose={() => { setCancelOpen(false); setReason(""); }}
        title="Cancel Order"
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setCancelOpen(false)} disabled={cancelling}>
              Keep Order
            </Button>
            <Button variant="danger" size="sm" loading={cancelling} onClick={handleCancel}>
              Confirm Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-neutral-600">
            This will cancel order <strong className="text-neutral-900">{order.orderNumber}</strong>.
          </p>
          <div>
            <label className="form-label">Cancellation Reason (optional)</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer request, item unavailable…"
              rows={3}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-neutral-400 flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-neutral-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-neutral-800 font-medium break-words">{value}</p>
      </div>
    </div>
  );
}
