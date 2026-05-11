"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { adminApi } from "@/lib/api/admin";
import { StatsCard } from "@/components/admin/stats-card";
import { StatCardSkeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#fbbf24",
  CONFIRMED: "#60a5fa",
  PREPARING: "#fb923c",
  READY: "#a78bfa",
  OUT_FOR_DELIVERY: "#818cf8",
  DELIVERED: "#34d399",
  CANCELLED: "#f87171",
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getStats(),
    refetchInterval: 30_000,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard
              title="Total Orders"
              value={stats?.totalOrders ?? 0}
              change={stats?.ordersGrowth}
              icon={ShoppingBag}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            <StatsCard
              title="Revenue"
              value={formatCurrency(stats?.totalRevenue ?? 0)}
              change={stats?.revenueGrowth}
              icon={DollarSign}
              iconColor="text-green-600"
              iconBg="bg-green-100"
            />
            <StatsCard
              title="Active Orders"
              value={stats?.activeOrders ?? 0}
              icon={Clock}
              iconColor="text-orange-600"
              iconBg="bg-orange-100"
            />
            <StatsCard
              title="Customers"
              value={stats?.totalCustomers ?? 0}
              icon={Users}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Revenue (Last 7 days)</h2>
          {stats?.revenueByDay && (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats.revenueByDay}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">Orders by Status</h2>
          {stats?.ordersByStatus && (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.ordersByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {stats.ordersByStatus.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] ?? "#e5e7eb"}
                    />
                  ))}
                </Pie>
                <Legend formatter={(v) => v.charAt(0) + v.slice(1).toLowerCase()} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Top items */}
      {stats?.topItems && stats.topItems.length > 0 && (
        <Card>
          <h2 className="font-semibold mb-4">Top Selling Items</h2>
          <div className="space-y-3">
            {stats.topItems.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500">{item.count} sold</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{
                        width: `${(item.count / stats.topItems[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
