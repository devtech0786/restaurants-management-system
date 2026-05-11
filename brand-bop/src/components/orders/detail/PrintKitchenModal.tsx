"use client";

import { useRef } from "react";
import { Printer, X, ChefHat } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Order } from "@/types/order";

interface PrintKitchenModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
}

export default function PrintKitchenModal({ open, onClose, order }: PrintKitchenModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const win = window.open("", "_blank", "width=400,height=500");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Kitchen Ticket — ${order.orderNumber}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Courier New', monospace; font-size: 14px; color: #000; padding: 16px; width: 360px; }
            .center { text-align: center; }
            .divider { border-top: 2px dashed #000; margin: 10px 0; }
            .item-name { font-size: 18px; font-weight: bold; }
            .note { font-size: 14px; background: #fffbeb; border: 1px solid #fbbf24; padding: 6px 10px; margin-top: 4px; border-radius: 4px; }
            .qty { font-size: 24px; font-weight: bold; min-width: 32px; }
            .row { display: flex; align-items: flex-start; gap: 12px; margin: 10px 0; }
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

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 flex flex-col max-h-[90vh]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <ChefHat size={16} className="text-neutral-600" />
            <h2 className="text-sm font-semibold text-neutral-900">Kitchen Ticket</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" leftIcon={<Printer size={13} />} onClick={handlePrint}>
              Print
            </Button>
            <button onClick={onClose} aria-label="Close" className="size-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Ticket preview */}
        <div className="overflow-y-auto flex-1 p-5">
          <div
            ref={printRef}
            className="font-mono text-neutral-900"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            {/* Ticket header — big and clear */}
            <div className="text-center mb-3">
              <p className="text-2xl font-black tracking-widest">KITCHEN</p>
              <div className="border-t-2 border-dashed border-neutral-400 my-2" />
              <div className="flex items-center justify-between text-sm font-bold">
                <span>{order.orderNumber.split("-").slice(-1)[0]}</span>
                <span className="text-lg uppercase">{order.type}</span>
                {order.tableNumber
                  ? <span className="text-lg font-black">{order.tableNumber}</span>
                  : <span>{fmtTime(order.placedAt)}</span>}
              </div>
              {order.isPriority && (
                <div className="mt-2 bg-neutral-900 text-white text-sm font-bold py-1 px-3 rounded text-center tracking-widest">
                  ⚡ PRIORITY
                </div>
              )}
            </div>

            <div className="border-t-2 border-dashed border-neutral-400 my-3" />

            {/* Items — large, clear */}
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id}>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl font-black min-w-[36px] leading-none">
                      {item.quantity}x
                    </span>
                    <div className="flex-1">
                      <p className="text-lg font-bold leading-tight">{item.menuItemName}</p>
                      {item.variantName && (
                        <p className="text-sm text-neutral-600 mt-0.5">({item.variantName})</p>
                      )}
                    </div>
                  </div>
                  {item.specialNote && (
                    <div className="ml-[52px] mt-1.5 bg-amber-50 border border-amber-300 rounded-lg px-3 py-2">
                      <p className="text-sm font-bold text-amber-800">⚠ {item.specialNote}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-neutral-400 my-3" />

            {/* Footer meta */}
            <div className="space-y-1 text-xs text-neutral-500">
              <div className="flex justify-between">
                <span>Placed</span>
                <span>{fmtTime(order.placedAt)}</span>
              </div>
              {order.estimatedReadyAt && (
                <div className="flex justify-between font-bold text-sm text-neutral-900">
                  <span>Ready by</span>
                  <span>{fmtTime(order.estimatedReadyAt)}</span>
                </div>
              )}
              {order.assignedStaff && (
                <div className="flex justify-between">
                  <span>Server</span>
                  <span>{order.assignedStaff}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
