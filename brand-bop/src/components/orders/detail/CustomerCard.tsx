import { Phone, Mail, User, ShoppingBag, TrendingUp, ExternalLink } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import type { OrderCustomer } from "@/types/order";

interface CustomerCardProps {
  customer: OrderCustomer;
  assignedStaff?: string;
}

export default function CustomerCard({ customer, assignedStaff }: CustomerCardProps) {
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardHeader title="Customer" />

      {/* Avatar + name */}
      <div className="flex items-center gap-3 mb-5 pb-5 border-b border-neutral-100">
        <div className="size-11 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-brand-700">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900">{customer.name}</p>
          {customer.totalOrders !== undefined && (
            <p className="text-xs text-neutral-400 mt-0.5">
              {customer.totalOrders} order{customer.totalOrders !== 1 ? "s" : ""} placed
            </p>
          )}
        </div>
        {(customer.totalOrders ?? 0) >= 10 && (
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">
            Regular
          </span>
        )}
      </div>

      {/* Contact */}
      <div className="space-y-3 mb-5">
        <ContactRow
          icon={<Phone size={13} />}
          label="Phone"
          value={customer.phone}
          href={`tel:${customer.phone}`}
        />
        {customer.email && (
          <ContactRow
            icon={<Mail size={13} />}
            label="Email"
            value={customer.email}
            href={`mailto:${customer.email}`}
          />
        )}
        {assignedStaff && (
          <ContactRow
            icon={<User size={13} />}
            label="Served by"
            value={assignedStaff}
          />
        )}
      </div>

      {/* Lifetime stats */}
      {(customer.totalOrders !== undefined || customer.lifetimeValue !== undefined) && (
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100">
          {customer.totalOrders !== undefined && (
            <StatCell
              icon={<ShoppingBag size={14} className="text-violet-500" />}
              label="Total Orders"
              value={String(customer.totalOrders)}
              bg="bg-violet-50"
            />
          )}
          {customer.lifetimeValue !== undefined && (
            <StatCell
              icon={<TrendingUp size={14} className="text-green-500" />}
              label="Lifetime Value"
              value={`$${customer.lifetimeValue.toLocaleString()}`}
              bg="bg-green-50"
            />
          )}
        </div>
      )}
    </Card>
  );
}

function ContactRow({
  icon, label, value, href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-neutral-400 flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-neutral-400 uppercase tracking-wide">{label}</p>
        {href ? (
          <a
            href={href}
            className="text-sm text-brand-600 font-medium hover:underline break-all inline-flex items-center gap-1"
          >
            {value}
            <ExternalLink size={10} className="flex-shrink-0" />
          </a>
        ) : (
          <p className="text-sm text-neutral-800 font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

function StatCell({
  icon, label, value, bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-3`}>
      <div className="flex items-center gap-1.5 mb-1">{icon}</div>
      <p className="text-base font-bold text-neutral-900">{value}</p>
      <p className="text-[10px] text-neutral-500 mt-0.5">{label}</p>
    </div>
  );
}
