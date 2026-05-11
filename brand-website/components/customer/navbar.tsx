"use client";

import Link from "next/link";
import { ShoppingCart, MapPin, ChevronDown, Search, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useAuthStore } from "@/lib/store/auth";
import { useTenant } from "@/lib/hooks/use-tenant";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onBranchClick?: () => void;
  selectedBranchName?: string;
}

export function CustomerNavbar({ onBranchClick, selectedBranchName }: NavbarProps) {
  const { data: tenant } = useTenant();
  const { itemCount, openCart } = useCartStore();
  const { user, openModal } = useAuthStore();
  const count = itemCount();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 safe-top shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* ── Desktop & Mobile shared bar ── */}
        <div className="h-16 flex items-center gap-4">

          {/* Logo / Brand name */}
          <Link href={`/${tenant?.slug}`} className="flex flex-col leading-tight shrink-0 mr-2">
            <span className="font-bold text-lg text-gray-900 font-heading leading-none">
              {tenant?.name ?? "Fastfo"}
            </span>
            <span className="text-[10px] text-brand-500 font-semibold leading-none mt-0.5 uppercase tracking-wide">
              {tenant?.cuisineTypes?.[0] ?? "Fast Food"}
            </span>
          </Link>

          {/* Location pill — hidden on mobile, visible md+ */}
          {onBranchClick && (
            <button
              onClick={onBranchClick}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-all text-sm font-medium max-w-[200px] shrink-0"
            >
              <MapPin size={14} className="text-brand-500 shrink-0" />
              <span className="truncate text-gray-700">{selectedBranchName ?? "Select branch"}</span>
              <ChevronDown size={13} className="shrink-0 text-gray-400 ml-auto" />
            </button>
          )}

          {/* Search bar — desktop center */}
          <div className="hidden lg:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for dishes, cuisines…"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Spacer on non-lg */}
          <div className="flex-1 lg:hidden" />

          {/* Right actions */}
          <div className="flex items-center gap-1">

            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Mobile branch */}
            {onBranchClick && (
              <button
                onClick={onBranchClick}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MapPin size={20} className="text-brand-500" />
              </button>
            )}

            {/* Profile */}
            <button
              onClick={() => !user && openModal()}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                user ? "gradient-brand text-white" : "bg-gray-100 text-gray-500"
              )}>
                {user ? user.name.charAt(0).toUpperCase() : <User size={14} />}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden lg:block">
                {user ? user.name.split(" ")[0] : "Sign in"}
              </span>
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl gradient-brand text-white hover:opacity-90 transition-opacity ml-1"
            >
              <ShoppingCart size={17} />
              <span className="text-sm font-semibold hidden sm:block">Cart</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-white text-brand-600 text-[10px] font-bold px-1"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile search bar — expandable */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-3 lg:hidden"
            >
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search dishes, cuisines…"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:bg-white transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
