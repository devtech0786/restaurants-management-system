"use client";

import { useParams, useRouter } from "next/navigation";
import { User, Phone, LogOut, ChevronRight, Package, Heart, Bell, HelpCircle, Star } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const MENU_ITEMS = [
  { icon: Package,    label: "My Orders",         href: "orders" },
  { icon: Heart,      label: "Saved Addresses",    href: "#"      },
  { icon: Bell,       label: "Notifications",      href: "#"      },
  { icon: Star,       label: "Rate the App",       href: "#"      },
  { icon: HelpCircle, label: "Help & Support",     href: "#"      },
];

export default function ProfilePage() {
  const params = useParams<{ tenant: string }>();
  const router = useRouter();
  const { user, openModal, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="px-4 py-12 flex flex-col items-center text-center gap-5">
        <div className="w-20 h-20 gradient-brand rounded-full flex items-center justify-center shadow-brand">
          <User size={36} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-heading">Sign in to your account</h2>
          <p className="text-sm text-gray-500 mt-1">Track orders, save addresses, and order faster</p>
        </div>
        <Button size="lg" onClick={openModal} className="shadow-brand w-full max-w-xs">
          Sign in / Create account
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Profile header */}
      <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-card p-4">
        <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center shadow-brand shrink-0">
          <span className="text-white text-2xl font-bold font-heading">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg font-heading truncate">{user.name}</p>
          {user.phone && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <Phone size={12} /> {user.phone}
            </p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Orders",  value: "3"    },
          { label: "Points",  value: "120"  },
          { label: "Saved",   value: "Rs 0" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-3 text-center">
            <p className="font-bold text-lg font-heading text-brand-600">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Menu list */}
      <Card padding="none" className="overflow-hidden divide-y divide-gray-50">
        {MENU_ITEMS.map(({ icon: Icon, label, href }) => (
          <button
            key={label}
            onClick={() => href !== "#" && router.push(`/${params.tenant}/${href}`)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-brand-50 rounded-xl flex items-center justify-center">
              <Icon size={15} className="text-brand-500" />
            </div>
            <span className="flex-1 text-sm font-medium text-left">{label}</span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </Card>

      {/* Logout */}
      <button
        onClick={() => { logout(); router.push(`/${params.tenant}`); }}
        className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-semibold text-sm hover:bg-red-50 rounded-2xl transition-colors"
      >
        <LogOut size={16} /> Sign out
      </button>

      <p className="text-center text-xs text-gray-300">Fastfo v1.0 · Made with ❤️</p>
    </div>
  );
}
