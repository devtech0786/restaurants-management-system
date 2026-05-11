"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock, MapPin, ChevronRight, Home, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useOrder } from "@/lib/hooks/use-orders";
import { useTenant } from "@/lib/hooks/use-tenant";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  const params = useParams<{ tenant: string; orderId: string }>();
  const router = useRouter();
  const { data: tenant } = useTenant();
  const { data: order } = useOrder(params.orderId);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50">

      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="w-28 h-28 rounded-full gradient-brand flex items-center justify-center shadow-brand">
          <CheckCircle size={56} className="text-white" strokeWidth={1.5} />
        </div>

        {/* Confetti rings */}
        {showConfetti && (
          <>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
                transition={{ duration: 1.2, delay: i * 0.2, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-2 border-brand-400"
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold font-heading text-gray-900">Order Placed! 🎉</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {order ? `Order #${order.orderNumber}` : "Your order is confirmed"}
        </p>
      </motion.div>

      {/* ETA card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-card border border-gray-100 p-5 mb-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0">
            <Clock size={26} className="text-brand-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Estimated delivery</p>
            <p className="text-2xl font-bold font-heading text-gray-900">
              {order?.estimatedDeliveryTime
                ? new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "25–35 min"}
            </p>
          </div>
        </div>

        {order && (
          <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
            <div className="flex items-start gap-2 text-sm text-gray-500">
              <MapPin size={14} className="mt-0.5 shrink-0 text-brand-400" />
              <span>
                {order.deliveryAddress.street}, {order.deliveryAddress.city}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Order summary */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-card border border-gray-100 p-5 mb-6"
        >
          <p className="text-sm font-semibold mb-3">Order Summary</p>
          <div className="space-y-1.5 text-sm">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between text-gray-600">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-xs text-gray-400">+{order.items.length - 3} more items</p>
            )}
            <div className="flex justify-between font-bold border-t pt-2 text-gray-900">
              <span>Total paid</span>
              <span className="text-brand-600">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm space-y-3"
      >
        <Link href={`/${params.tenant}/orders/${params.orderId}`}>
          <Button fullWidth size="lg" className="shadow-brand">
            <Package size={18} /> Track your order
          </Button>
        </Link>
        <Link href={`/${params.tenant}`}>
          <Button fullWidth size="lg" variant="outline">
            <Home size={18} /> Back to home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
