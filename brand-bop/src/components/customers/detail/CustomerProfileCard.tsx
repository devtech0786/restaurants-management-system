import { Phone, Mail, MapPin, Store, Calendar, ShieldOff } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import CustomerTierBadge from "@/components/customers/CustomerTierBadge";
import type { Customer } from "@/types/customer";

const AVATAR_PALETTES = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100   text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100  text-amber-700",
  "bg-rose-100   text-rose-700",
  "bg-cyan-100   text-cyan-700",
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100   text-pink-700",
];

function avatarCls(name: string) {
  return AVATAR_PALETTES[(name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_PALETTES.length];
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

interface CustomerProfileCardProps {
  customer: Customer;
}

export default function CustomerProfileCard({ customer }: CustomerProfileCardProps) {
  return (
    <Card>
      <CardHeader title="Profile" />

      {/* Avatar + name */}
      <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-neutral-100">
        <div className={`size-16 rounded-2xl flex items-center justify-center text-xl font-black mb-3 ${
          customer.isBlocked ? "bg-neutral-200 text-neutral-500" : avatarCls(customer.name)
        }`}>
          {initials(customer.name)}
        </div>
        <p className="text-base font-bold text-neutral-900 leading-none">{customer.name}</p>
        <p className="text-xs text-neutral-400 mt-1">
          Member since {fmtDate(customer.joinedAt)}
        </p>
        <div className="flex items-center gap-2 mt-2.5 flex-wrap justify-center">
          <CustomerTierBadge tier={customer.tier} size="md" />
          {customer.isBlocked && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-red-700 bg-red-100 border border-red-200">
              <ShieldOff size={11} />
              Blocked
            </span>
          )}
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-3">
        <InfoRow icon={<Phone size={13} />} label="Phone" value={customer.phone} href={`tel:${customer.phone}`} />
        {customer.email && (
          <InfoRow icon={<Mail size={13} />} label="Email" value={customer.email} href={`mailto:${customer.email}`} />
        )}
        {customer.address && (
          <InfoRow icon={<MapPin size={13} />} label="Address" value={customer.address} />
        )}
        {customer.preferredBranch && (
          <InfoRow icon={<Store size={13} />} label="Branch" value={customer.preferredBranch} />
        )}
        {customer.lastOrderAt && (
          <InfoRow icon={<Calendar size={13} />} label="Last Order" value={fmtDate(customer.lastOrderAt)} />
        )}
      </div>
    </Card>
  );
}

function InfoRow({
  icon, label, value, href,
}: {
  icon: React.ReactNode; label: string; value: string; href?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-neutral-400 flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-neutral-400 uppercase tracking-wide">{label}</p>
        {href ? (
          <a href={href} className="text-sm text-brand-600 font-medium hover:underline break-all">
            {value}
          </a>
        ) : (
          <p className="text-sm text-neutral-800 font-medium break-words">{value}</p>
        )}
      </div>
    </div>
  );
}
