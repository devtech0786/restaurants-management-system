"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, ShoppingCart, Package, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface BottomNavProps {
  tenantSlug: string;
  onProfileClick?: () => void;
}

export function BottomNav({ tenantSlug, onProfileClick }: BottomNavProps) {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount)();

  const base = `/${tenantSlug}`;

  const tabs = [
    { href: base,                   label: "Home",   icon: Home },
    { href: `${base}/menu`,         label: "Menu",   icon: UtensilsCrossed },
    { href: `${base}/cart`,         label: "Cart",   icon: ShoppingCart, badge: itemCount },
    { href: `${base}/orders`,       label: "Orders", icon: Package },
    { href: `${base}/profile`,      label: "Profile",icon: User, onClick: onProfileClick },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 safe-bottom">
      <div className="max-w-2xl mx-auto flex items-stretch">
        {tabs.map(({ href, label, icon: Icon, badge, onClick }) => {
          const active = pathname === href || (href !== base && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClick}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative"
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={cn(
                    "transition-colors",
                    active ? "text-brand-500" : "text-gray-400 dark:text-gray-600"
                  )}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <AnimatePresence>
                  {badge ? (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-brand-500 text-white text-[9px] font-bold px-0.5"
                    >
                      {badge > 9 ? "9+" : badge}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  active ? "text-brand-500" : "text-gray-400 dark:text-gray-600"
                )}
              >
                {label}
              </span>
              {active && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-500 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
