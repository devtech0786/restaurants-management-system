"use client";

import { ArrowLeft, ShoppingBag, ShieldOff, Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import CustomerTierBadge from "@/components/customers/CustomerTierBadge";
import type { Customer } from "@/types/customer";

interface CustomerActionBarProps {
  customer:       Customer;
  blocking:       boolean;
  onToggleBlock:  () => void;
}

export default function CustomerActionBar({
  customer, blocking, onToggleBlock,
}: CustomerActionBarProps) {
  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-4">
        {/* Back */}
        <Link
          href="/customers"
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors flex-shrink-0"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Customers</span>
        </Link>

        <div className="h-4 w-px bg-neutral-200 flex-shrink-0" />

        {/* Name + tier */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">{customer.name}</p>
          <CustomerTierBadge tier={customer.tier} />
          {customer.isBlocked && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-red-700 bg-red-100 border border-red-200">
              Blocked
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href={`/orders?customer=${encodeURIComponent(customer.name)}`}>
            <Button variant="outline" size="sm" leftIcon={<ShoppingBag size={13} />}>
              Orders
            </Button>
          </Link>

          <Button
            variant={customer.isBlocked ? "primary" : "danger"}
            size="sm"
            loading={blocking}
            leftIcon={customer.isBlocked ? <Shield size={13} /> : <ShieldOff size={13} />}
            onClick={onToggleBlock}
          >
            {customer.isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      </div>
    </div>
  );
}
