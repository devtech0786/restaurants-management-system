"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  ChefHat,
  Users,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href:   string;
  label:  string;
  icon:   React.ElementType;
  badge?: number;
}

interface NavGroup {
  title?: string;
  items:  NavItem[];
}

const navigation: NavGroup[] = [
  {
    items: [
      { href: "/orders",    label: "Orders",    icon: ShoppingBag, badge: 2 },
      { href: "/customers", label: "Customers", icon: Users },
    ],
  },
  {
    title: "Menu",
    items: [
      { href: "/menu",            label: "All Items",  icon: ChefHat },
      { href: "/menu/categories", label: "Categories", icon: Tag     },
    ],
  },
  {
    title: "Settings",
    items: [
      { href: "/settings", label: "General", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/settings") return pathname === "/settings";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-full bg-white border-r border-neutral-100">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-neutral-100">
        <div className="size-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
          <ChefHat size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900 leading-none">Brand BOP</p>
          <p className="text-[10px] text-neutral-400 mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-6" aria-label="Main navigation">
        {navigation.map((group, gi) => (
          <div key={gi}>
            {group.title && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn("sidebar-link", active && "active")}
                      aria-current={active ? "page" : undefined}
                    >
                      <item.icon size={16} className="flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge != null && (
                        <span className="ml-auto flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-brand-500 text-white text-[10px] font-semibold flex items-center justify-center px-1">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer — user profile only */}
      <div className="border-t border-neutral-100 p-3">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors">
          <div className="size-7 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-brand-700">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-800 truncate">John Doe</p>
            <p className="text-[10px] text-neutral-400 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
