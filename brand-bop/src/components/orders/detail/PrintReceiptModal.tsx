"use client";

import { useRef } from "react";
import { Printer, X } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Order } from "@/types/order";

interface PrintReceiptModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
}

const METHOD_LABEL: Record<string, string> = {
  cash: "Cash", card: "Card", online: "Online", split: "Split",
};

export default function PrintReceiptModal({ open, onClose, order }: PrintReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Receipt — ${order.orderNumber}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Courier New', monospace; font-size: 12px; color: #000; padding: 16px; width: 360px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; margin: 3px 0; }
            .total-row { font-size: 14px; font-weight: bold; }
            h1 { font-size: 16px; }
            h2 { font-size: 13px; }
          </style>
        </head>
        <body>${printRef.current.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  if (!open) return null;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 flex flex-col max-h-[90vh]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Customer Receipt</h2>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" leftIcon={<Printer size={13} />} onClick={handlePrint}>
              Print
            </Button>
            <button onClick={onClose} aria-label="Close" className="size-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable receipt preview */}
        <div className="overflow-y-auto flex-1 p-5">
          <div
            ref={printRef}
            className="font-mono text-xs text-neutral-900 space-y-0"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            {/* Header */}
            <div className="text-center mb-4">
              <p className="text-base font-bold">FLAVOUR HOUSE</p>
              <p className="text-xs text-neutral-500 mt-0.5">{order.franchiseName.split("—")[1]?.trim()}</p>
              <p className="text-xs text-neutral-500">www.flavourhouse.com</p>
            </div>

            <div className="border-t border-dashed border-neutral-300 my-3" />

            {/* Order meta */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order #</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date</span>
                <span>{fmt(order.placedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Type</span>
                <span className="capitalize">{order.type}</span>
              </div>
              {order.tableNumber && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Table</span>
                  <span>{order.tableNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Customer</span>
                <span>{order.customer.name}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-neutral-300 my-3" />

            {/* Items */}
            <div className="space-y-2 mb-3">
              {order.items.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between">
                    <span className="font-medium flex-1 pr-2 leading-snug">
                      {item.quantity}x {item.menuItemName}
                      {item.variantName ? ` (${item.variantName})` : ""}
                    </span>
                    <span className="flex-shrink-0">${item.totalPrice.toFixed(2)}</span>
                  </div>
                  {item.specialNote && (
                    <p className="text-neutral-400 ml-4 text-[10px]">* {item.specialNote}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-neutral-300 my-3" />

            {/* Totals */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Delivery</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-2 border-neutral-900 my-2" />

            <div className="flex justify-between text-sm font-bold mb-4">
              <span>TOTAL</span>
              <span>${order.total.toFixed(2)}</span>
            </div>

            {/* Payment */}
            <div className="flex justify-between mb-1">
              <span className="text-neutral-500">Payment</span>
              <span className="capitalize">
                {order.paymentMethod ? METHOD_LABEL[order.paymentMethod] : "—"}
              </span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-neutral-500">Status</span>
              <span className="capitalize font-medium">
                {order.paymentStatus.replace("_", " ")}
              </span>
            </div>

            <div className="border-t border-dashed border-neutral-300 my-3" />

            {/* Footer */}
            <div className="text-center space-y-1 text-neutral-500">
              <p>Thank you for dining with us!</p>
              <p>We hope to see you again soon.</p>
              <p className="mt-2 text-[10px]">
                {order.completedAt ? `Completed: ${fmt(order.completedAt)}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
