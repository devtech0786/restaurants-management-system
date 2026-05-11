import type { Metadata } from "next";
import { Users, Crown, UserPlus, TrendingUp } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import KPICard from "@/components/orders/KPICard";
import CustomerTable from "@/components/customers/CustomerTable";
import { MOCK_CUSTOMERS, MOCK_FRANCHISES } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  const total   = MOCK_CUSTOMERS.length;
  const vip     = MOCK_CUSTOMERS.filter((c) => c.tier === "vip").length;

  const monthAgo = new Date("2026-04-05T00:00:00Z");
  const newMonth = MOCK_CUSTOMERS.filter((c) => new Date(c.joinedAt) >= monthAgo).length;

  const avgLTV = total > 0
    ? MOCK_CUSTOMERS.reduce((s, c) => s + c.lifetimeValue, 0) / total
    : 0;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <PageHeader
        title="Customers"
        description="View and manage your customer base across all franchise locations."
        breadcrumbs={[{ label: "Customers" }]}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          label="Total Customers"
          value={total}
          icon={Users}
          iconBg="bg-brand-50"
          iconColor="text-brand-600"
          trend={6}
          trendLabel="vs last month"
        />
        <KPICard
          label="New This Month"
          value={newMonth}
          icon={UserPlus}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          trend={14}
          trendLabel="vs last month"
        />
        <KPICard
          label="VIP Members"
          value={vip}
          icon={Crown}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          trend={2}
          trendLabel="vs last month"
        />
        <KPICard
          label="Avg. Lifetime Value"
          value={`$${avgLTV.toFixed(0)}`}
          icon={TrendingUp}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={5}
          trendLabel="vs last month"
        />
      </div>

      <CustomerTable
        initialCustomers={MOCK_CUSTOMERS}
        franchises={MOCK_FRANCHISES.map((f) => ({ id: f.id, name: f.name }))}
      />
    </div>
  );
}
