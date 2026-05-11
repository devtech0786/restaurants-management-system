"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import OrderStatusPipeline from "@/components/orders/OrderStatusPipeline";
import { ORDER_STATUS_CONFIG } from "@/components/orders/OrderStatusBadge";
import OrderActionBar from "./OrderActionBar";
import OrderItemsCard from "./OrderItemsCard";
import CustomerCard from "./CustomerCard";
import DeliveryInfoCard from "./DeliveryInfoCard";
import PaymentCard from "./PaymentCard";
import InternalNotesCard from "./InternalNotesCard";
import StatusTimeline from "./StatusTimeline";
import PrintReceiptModal from "./PrintReceiptModal";
import PrintKitchenModal from "./PrintKitchenModal";
import type { Order, OrderStatus, InternalNote } from "@/types/order";

const ADVANCE: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:          "confirmed",
  confirmed:        "preparing",
  preparing:        "ready",
  ready:            "out_for_delivery",
  out_for_delivery: "completed",
};

interface OrderDetailViewProps {
  initialOrder: Order;
}

export default function OrderDetailView({ initialOrder }: OrderDetailViewProps) {
  const [order, setOrder]               = useState<Order>(initialOrder);
  const [advancing, setAdvancing]       = useState(false);
  const [markingPaid, setMarkingPaid]   = useState(false);
  const [issuingRefund, setRefund]      = useState(false);
  const [cancelOpen, setCancelOpen]     = useState(false);
  const [cancelReason, setReason]       = useState("");
  const [cancelling, setCancelling]     = useState(false);
  const [confirmAdvance, setConfirmAdv] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(false);
  const [printKitchen, setPrintKitchen] = useState(false);

  const isFinal = ["completed", "cancelled", "refunded"].includes(order.status);

  /* ── Helpers ───────────────────────────────────────────────── */
  const pushStatus = (next: OrderStatus, note?: string) => {
    const now = new Date().toISOString();
    setOrder((prev) => ({
      ...prev,
      status:      next,
      updatedAt:   now,
      completedAt: next === "completed" ? now : prev.completedAt,
      statusHistory: [
        ...prev.statusHistory,
        { status: next, at: now, by: "Admin", ...(note ? { note } : {}) },
      ],
    }));
  };

  /* ── Advance ───────────────────────────────────────────────── */
  const handleAdvance = async () => {
    const next = ADVANCE[order.status];
    if (!next) return;
    // confirm before completing
    if (next === "completed") { setConfirmAdv(true); return; }
    setAdvancing(true);
    await new Promise((r) => setTimeout(r, 700));
    pushStatus(next);
    toast("success", `Order status → ${ORDER_STATUS_CONFIG[next].label}`);
    setAdvancing(false);
  };

  const confirmComplete = async () => {
    setConfirmAdv(false);
    setAdvancing(true);
    await new Promise((r) => setTimeout(r, 700));
    pushStatus("completed");
    toast("success", "Order marked as Completed.");
    setAdvancing(false);
  };

  /* ── Cancel ────────────────────────────────────────────────── */
  const handleCancel = async () => {
    setCancelling(true);
    await new Promise((r) => setTimeout(r, 700));
    const now = new Date().toISOString();
    setOrder((prev) => ({
      ...prev,
      status:             "cancelled",
      updatedAt:          now,
      cancellationReason: cancelReason || undefined,
      statusHistory: [
        ...prev.statusHistory,
        { status: "cancelled", at: now, by: "Admin", ...(cancelReason ? { note: cancelReason } : {}) },
      ],
    }));
    toast("success", "Order cancelled.");
    setCancelOpen(false);
    setReason("");
    setCancelling(false);
  };

  /* ── Mark paid ─────────────────────────────────────────────── */
  const handleMarkPaid = async () => {
    setMarkingPaid(true);
    await new Promise((r) => setTimeout(r, 700));
    setOrder((prev) => ({ ...prev, paymentStatus: "paid" }));
    toast("success", "Payment recorded.");
    setMarkingPaid(false);
  };

  /* ── Issue refund ──────────────────────────────────────────── */
  const handleIssueRefund = async () => {
    setRefund(true);
    await new Promise((r) => setTimeout(r, 700));
    setOrder((prev) => ({ ...prev, paymentStatus: "refunded", status: "refunded" }));
    toast("success", "Refund issued.");
    setRefund(false);
  };

  /* ── Internal notes ────────────────────────────────────────── */
  const handleAddNote = (note: InternalNote) =>
    setOrder((prev) => ({ ...prev, internalNotes: [...prev.internalNotes, note] }));

  const handleDeleteNote = (id: string) =>
    setOrder((prev) => ({
      ...prev,
      internalNotes: prev.internalNotes.filter((n) => n.id !== id),
    }));

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <>
      {/* Sticky action bar */}
      <OrderActionBar
        order={order}
        advancing={advancing}
        onAdvance={handleAdvance}
        onCancel={() => setCancelOpen(true)}
        onPrintReceipt={() => setPrintReceipt(true)}
        onPrintKitchen={() => setPrintKitchen(true)}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Cancellation banner */}
        {(order.status === "cancelled" || order.status === "refunded") && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 capitalize">
                Order {order.status}
              </p>
              {order.cancellationReason && (
                <p className="text-xs text-red-500 mt-0.5">{order.cancellationReason}</p>
              )}
            </div>
          </div>
        )}

        {/* Status pipeline */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-card px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-neutral-900">Order Progress</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Placed {new Date(order.placedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                {order.estimatedReadyAt && (
                  <> · Ready by {new Date(order.estimatedReadyAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</>
                )}
              </p>
            </div>
            {order.isPriority && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                <AlertCircle size={11} />
                Priority Order
              </span>
            )}
          </div>
          <OrderStatusPipeline
            type={order.type}
            status={order.status}
            statusHistory={order.statusHistory}
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <OrderItemsCard
              items={order.items}
              subtotal={order.subtotal}
              discount={order.discount}
              deliveryFee={order.deliveryFee}
              tax={order.tax}
              total={order.total}
            />
            <StatusTimeline events={order.statusHistory} />
            <InternalNotesCard
              notes={order.internalNotes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            <CustomerCard
              customer={order.customer}
              assignedStaff={order.assignedStaff}
            />
            <DeliveryInfoCard order={order} />
            <PaymentCard
              order={order}
              onMarkPaid={handleMarkPaid}
              onIssueRefund={handleIssueRefund}
              markingPaid={markingPaid}
              issuingRefund={issuingRefund}
            />
          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────── */}

      {/* Confirm complete */}
      <Modal
        open={confirmAdvance}
        onClose={() => setConfirmAdv(false)}
        title="Mark Order as Completed"
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setConfirmAdv(false)}>
              Not Yet
            </Button>
            <Button variant="primary" size="sm" loading={advancing} onClick={confirmComplete}>
              Yes, Complete
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600">
          Are you sure you want to mark order{" "}
          <strong className="text-neutral-900">{order.orderNumber}</strong> as completed?
          This will finalise the order.
        </p>
      </Modal>

      {/* Cancel */}
      <Modal
        open={cancelOpen}
        onClose={() => { setCancelOpen(false); setReason(""); }}
        title="Cancel Order"
        description={order.orderNumber}
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => { setCancelOpen(false); setReason(""); }} disabled={cancelling}>
              Keep Order
            </Button>
            <Button variant="danger" size="sm" loading={cancelling} onClick={handleCancel}>
              Cancel Order
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-neutral-600">
            Cancel order for{" "}
            <strong className="text-neutral-900">{order.customer.name}</strong>?
            The kitchen will be notified immediately.
          </p>
          <div>
            <label className="form-label">Cancellation Reason <span className="text-neutral-400">(optional)</span></label>
            <textarea
              value={cancelReason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer request, item unavailable…"
              rows={3}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>
      </Modal>

      {/* Print modals */}
      <PrintReceiptModal
        open={printReceipt}
        onClose={() => setPrintReceipt(false)}
        order={order}
      />
      <PrintKitchenModal
        open={printKitchen}
        onClose={() => setPrintKitchen(false)}
        order={order}
      />
    </>
  );
}
