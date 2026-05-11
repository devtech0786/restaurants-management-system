import { DollarSign, ShoppingBag, TrendingUp, Repeat } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import type { Customer } from "@/types/customer";

interface CustomerStatsCardProps {
  customer: Customer;
}

export default function CustomerStatsCard({ customer }: CustomerStatsCardProps) {
  const frequency = getFrequency(customer);

  return (
    <Card>
      <CardHeader title="Spending Stats" />

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          icon={<DollarSign size={15} className="text-emerald-600" />}
          bg="bg-emerald-50"
          label="Lifetime Value"
          value={`$${customer.lifetimeValue.toLocaleString()}`}
        />
        <StatTile
          icon={<ShoppingBag size={15} className="text-brand-600" />}
          bg="bg-brand-50"
          label="Total Orders"
          value={String(customer.totalOrders)}
        />
        <StatTile
          icon={<TrendingUp size={15} className="text-violet-600" />}
          bg="bg-violet-50"
          label="Avg. Order"
          value={`$${customer.avgOrderValue.toFixed(2)}`}
        />
        <StatTile
          icon={<Repeat size={15} className="text-cyan-600" />}
          bg="bg-cyan-50"
          label="Frequency"
          value={frequency}
        />
      </div>
    </Card>
  );
}

function getFrequency(customer: Customer): string {
  if (!customer.lastOrderAt || customer.totalOrders < 2) return "—";
  const joinMs  = new Date(customer.joinedAt).getTime();
  const lastMs  = new Date(customer.lastOrderAt).getTime();
  const days    = (lastMs - joinMs) / 86400000;
  const perDay  = customer.totalOrders / Math.max(days, 1);
  const period  = 1 / perDay;
  if (period < 7)  return `Every ${Math.round(period)}d`;
  if (period < 30) return `Every ${Math.round(period / 7)}wk`;
  return `Every ${Math.round(period / 30)}mo`;
}

function StatTile({
  icon, bg, label, value,
}: {
  icon: React.ReactNode; bg: string; label: string; value: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-3.5`}>
      <div className="mb-1.5">{icon}</div>
      <p className="text-lg font-black text-neutral-900 leading-none tabular-nums">{value}</p>
      <p className="text-[10px] text-neutral-500 mt-1 font-medium uppercase tracking-wide">{label}</p>
    </div>
  );
}
