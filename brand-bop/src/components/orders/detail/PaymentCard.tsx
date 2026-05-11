"use client";

import { CreditCard, Banknote, Smartphone, Split, CheckCircle2, RotateCcw } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PaymentStatusBadge } from "@/components/orders/OrderStatusBadge";
import { toast } from "@/components/ui/Toast";
import type { Order, PaymentMethod, PaymentStatus } from "@/types/order";

const METHOD_ICON: Record<PaymentMethod, React.ElementType> = {
  cash:   Banknote,
  card:   CreditCard,
  online: Smartphone,
  split:  Split,
};

const METHOD_LABEL: Record<PaymentMethod, string> = {
  cash:   "Cash",
  card:   "Card",
  online: "Online Payment",
  split:  "Split Payment",
};

interface PaymentCardProps {
  order: Pick<
    Order,
    | "paymentStatus"
    | "paymentMethod"
    | "subtotal"
    | "discount"
    | "deliveryFee"
    | "tax"
    | "total"
    | "status"
  >;
  onMarkPaid: () => void;
  onIssueRefund: () => void;
  markingPaid: boolean;
  issuingRefund: boolean;
}

export default function PaymentCard({
  order,
  onMarkPaid,
  onIssueRefund,
  markingPaid,
  issuingRefund,
}: PaymentCardProps) {
  const MethodIcon = order.paymentMethod ? METHOD_ICON[order.paymentMethod] : CreditCard;
  const isCancelledOrRefunded = order.status === "cancelled" || order.status === "refunded";

  const rows: { label: string; value: number; style?: "discount" | "muted" | "bold" }[] = [
    { label: "Subtotal",    value: order.subtotal },
    ...(order.discount > 0 ? [{ label: "Discount", value: -order.discount, style: "discount" as const }] : []),
    ...(order.deliveryFee > 0 ? [{ label: "Delivery Fee", value: order.deliveryFee }] : []),
    { label: "Tax",         value: order.tax, style: "muted" as const },
    { label: "Total",       value: order.total, style: "bold" as const },
  ];

  return (
    <Card>
      <CardHeader
        title="Payment"
        action={<PaymentStatusBadge status={order.paymentStatus} />}
      />

      {/* Method */}
      {order.paymentMethod && (
        <div className="flex items-center gap-2.5 mb-5 pb-5 border-b border-neutral-100">
          <div className="size-9 rounded-lg bg-neutral-100 flex items-center justify-center">
            <MethodIcon size={16} className="text-neutral-600" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Payment Method</p>
            <p className="text-sm font-medium text-neutral-800">
              {METHOD_LABEL[order.paymentMethod]}
            </p>
          </div>
        </div>
      )}

      {/* Breakdown */}
      <div className="space-y-2.5 mb-5">
        {rows.map((row) => (
          <div key={row.label} className={`flex items-center justify-between ${row.style === "bold" ? "pt-3 border-t border-neutral-200" : ""}`}>
            <span className={`text-sm ${row.style === "muted" ? "text-neutral-400" : row.style === "bold" ? "font-bold text-neutral-900" : "text-neutral-500"}`}>
              {row.label}
            </span>
            <span className={`font-medium ${row.style === "discount" ? "text-green-600" : row.style === "bold" ? "text-xl font-bold text-neutral-900" : "text-neutral-700"}`}>
              {row.value < 0 ? "-" : ""}${Math.abs(row.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-4 border-t border-neutral-100">
        {order.paymentStatus === "unpaid" && !isCancelledOrRefunded && (
          <Button
            variant="primary"
            size="sm"
            className="w-full justify-center"
            leftIcon={<CheckCircle2 size={14} />}
            loading={markingPaid}
            onClick={onMarkPaid}
          >
            Mark as Paid
          </Button>
        )}
        {order.paymentStatus === "paid" && isCancelledOrRefunded && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50"
            leftIcon={<RotateCcw size={14} />}
            loading={issuingRefund}
            onClick={onIssueRefund}
          >
            Issue Refund
          </Button>
        )}
        {order.paymentStatus === "refunded" && (
          <p className="text-xs text-center text-neutral-400 py-1">Refund has been issued.</p>
        )}
        {order.paymentStatus === "paid" && !isCancelledOrRefunded && (
          <p className="text-xs text-center text-green-600 font-medium py-1 flex items-center justify-center gap-1">
            <CheckCircle2 size={12} /> Payment received
          </p>
        )}
      </div>
    </Card>
  );
}
