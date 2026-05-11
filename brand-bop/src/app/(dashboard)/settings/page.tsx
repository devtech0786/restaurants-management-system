import type { Metadata } from "next";
import Link from "next/link";
import { Palette, Store, Bell, Shield, Globe, CreditCard } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Settings" };

interface SettingCard {
  href: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  badge?: string;
}

const settingCards: SettingCard[] = [
  {
    href: "/settings/brand",
    icon: Palette,
    iconBg: "bg-brand-50",
    iconColor: "text-brand-600",
    title: "Brand Configuration",
    description: "Manage your brand identity, logo, colors, and contact information.",
  },
  {
    href: "/settings/franchises",
    icon: Store,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    title: "Franchise Management",
    description: "View, add, and manage all your franchise locations and branches.",
    badge: "8 locations",
  },
  {
    href: "/settings/notifications",
    icon: Bell,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "Notifications",
    description: "Configure alerts, email preferences, and notification channels.",
  },
  {
    href: "/settings/security",
    icon: Shield,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    title: "Security & Access",
    description: "Manage roles, permissions, and two-factor authentication.",
  },
  {
    href: "/settings/integrations",
    icon: Globe,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    title: "Integrations",
    description: "Connect third-party tools like POS systems, delivery platforms, and more.",
  },
  {
    href: "/settings/billing",
    icon: CreditCard,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Billing & Plans",
    description: "View invoices, manage your subscription, and update payment methods.",
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title="Settings"
        description="Manage your restaurant platform preferences and configurations."
        breadcrumbs={[{ label: "Settings" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingCards.map((card) => (
          <Link key={card.href} href={card.href} className="group outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl">
            <Card hover padding="md" className="h-full transition-all duration-150 group-hover:-translate-y-0.5">
              <div className="flex items-start gap-4">
                <div className={cn("size-10 rounded-xl flex items-center justify-center flex-shrink-0", card.iconBg)}>
                  <card.icon size={20} className={card.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-sm font-semibold text-neutral-900 group-hover:text-brand-600 transition-colors">
                      {card.title}
                    </h2>
                    {card.badge && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">{card.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
