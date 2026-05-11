"use client";

import { useState } from "react";
import { toast } from "@/components/ui/Toast";
import CustomerActionBar    from "./CustomerActionBar";
import CustomerProfileCard  from "./CustomerProfileCard";
import CustomerStatsCard    from "./CustomerStatsCard";
import CustomerOrdersCard   from "./CustomerOrdersCard";
import CustomerPreferencesCard from "./CustomerPreferencesCard";
import CustomerNotesCard    from "./CustomerNotesCard";
import type { Customer, CustomerNote } from "@/types/customer";
import type { Order } from "@/types/order";

interface CustomerDetailViewProps {
  initialCustomer: Customer;
  initialOrders:   Order[];
}

export default function CustomerDetailView({
  initialCustomer,
  initialOrders,
}: CustomerDetailViewProps) {
  const [customer, setCustomer] = useState<Customer>(initialCustomer);
  const [blocking, setBlocking] = useState(false);

  const handleToggleBlock = async () => {
    setBlocking(true);
    await new Promise((r) => setTimeout(r, 600));
    setCustomer((prev) => ({ ...prev, isBlocked: !prev.isBlocked }));
    toast(
      "success",
      customer.isBlocked
        ? `${customer.name} has been unblocked.`
        : `${customer.name} has been blocked.`,
    );
    setBlocking(false);
  };

  const handleSavePreferences = (data: { favoriteItems: string[]; dietaryNotes: string }) => {
    setCustomer((prev) => ({ ...prev, ...data }));
  };

  const handleAddNote = (note: CustomerNote) => {
    setCustomer((prev) => ({ ...prev, internalNotes: [...prev.internalNotes, note] }));
  };

  const handleDeleteNote = (id: string) => {
    setCustomer((prev) => ({
      ...prev,
      internalNotes: prev.internalNotes.filter((n) => n.id !== id),
    }));
  };

  return (
    <>
      <CustomerActionBar
        customer={customer}
        blocking={blocking}
        onToggleBlock={handleToggleBlock}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main column (2/3) ── */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerOrdersCard orders={initialOrders} />
            <CustomerNotesCard
              notes={customer.internalNotes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>

          {/* ── Sidebar (1/3) ── */}
          <div className="space-y-6">
            <CustomerProfileCard customer={customer} />
            <CustomerStatsCard   customer={customer} />
            <CustomerPreferencesCard
              customer={customer}
              onSave={handleSavePreferences}
            />
          </div>

        </div>
      </div>
    </>
  );
}
