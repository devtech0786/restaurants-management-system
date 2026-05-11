import type { Metadata } from "next";
import { ShoppingBag, DollarSign, Clock, TrendingUp } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import KPICard from "@/components/orders/KPICard";
import OrderTable from "@/components/orders/OrderTable";
import { MOCK_ORDERS, MOCK_FRANCHISES } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  const cutoff      = new Date("2026-05-03");
  const allOrders   = MOCK_ORDERS;
  const todayOrders = allOrders.filter((o) => new Date(o.placedAt) >= cutoff);
  const paidToday   = todayOrders.filter((o) => o.paymentStatus === "paid");
  const todayRev    = paidToday.reduce((s, o) => s + o.total, 0);
  const avgVal      = paidToday.length > 0 ? todayRev / paidToday.length : 0;
  const pending     = allOrders.filter((o) => ["pending", "confirmed", "preparing"].includes(o.status)).length;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          <PageHeader
            title="Orders"
            description="Monitor and manage all incoming orders across your franchise locations."
            breadcrumbs={[{ label: "Orders" }]}
          />
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 mt-1 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 flex-shrink-0">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-green-500" />
          </span>
          <span className="text-xs font-semibold text-green-700">Live</span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          label="Today's Orders"
          value={todayOrders.length}
          icon={ShoppingBag}
          iconBg="bg-brand-50"
          iconColor="text-brand-600"
          trend={12}
          trendLabel="vs yesterday"
        />
        <KPICard
          label="Today's Revenue"
          value={`$${todayRev.toFixed(0)}`}
          icon={DollarSign}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={8}
          trendLabel="vs yesterday"
        />
        <KPICard
          label="Avg. Order Value"
          value={avgVal > 0 ? `$${avgVal.toFixed(2)}` : "—"}
          icon={TrendingUp}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
          trend={3}
          trendLabel="vs yesterday"
        />
        <KPICard
          label="Needs Attention"
          value={pending}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Order table */}
      <OrderTable
        initialOrders={MOCK_ORDERS}
        franchises={MOCK_FRANCHISES.map((f) => ({ id: f.id, name: f.name }))}
      />
    </div>
  );
}
