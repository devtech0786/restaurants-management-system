"use client";

import Link from "next/link";
import { ChevronRight, TrendingUp, UtensilsCrossed } from "lucide-react";
import { useTenant } from "@/lib/hooks/use-tenant";
import { useMenu } from "@/lib/hooks/use-menu";
import { useCartStore } from "@/lib/store/cart";
import { Skeleton, MenuItemSkeleton } from "@/components/ui/skeleton";
import { CategoryGrid } from "@/components/customer/category-grid";
import { ProductCard } from "@/components/customer/product-card";
import { motion } from "framer-motion";

export default function TenantHomePage() {
  const { data: tenant } = useTenant();
  const cart = useCartStore((s) => s.cart);
  const { data: categories = [], isLoading } = useMenu(tenant?.id, cart?.branchId);
  const allItems = categories.flatMap((c) => c.items);
  const featured  = allItems.filter((i) => i.isFeatured && i.isAvailable).slice(0, 8);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* Category navigation */}
        <CategoryGrid categories={categories} isLoading={isLoading} />

        {/* ── MOST POPULAR ─────────────────────────────────────────────── */}
        {(isLoading || featured.length > 0) && (
          <section className="pb-10 lg:pb-14">
            {/* Section heading */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center">
                  <TrendingUp size={16} className="text-brand-500" />
                </div>
                <div>
                  <h2 className="font-black text-lg lg:text-xl text-gray-900 font-heading leading-none">
                    Most Popular
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Loved by our customers</p>
                </div>
              </div>
              <Link
                href={`#`}
                className="flex items-center gap-1 text-sm font-bold text-brand-500 hover:text-brand-700 transition-colors"
              >
                See all <ChevronRight size={15} />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="w-full h-40 lg:h-48 rounded-2xl mb-2" />
                    <Skeleton className="h-3.5 w-3/4 mb-1.5 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {featured.map((item) => (
                  <ProductCard key={item.id} item={item} allItems={allItems} compact />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── FULL MENU ────────────────────────────────────────────────── */}
        <section className="pb-16">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <UtensilsCrossed size={16} className="text-gray-600" />
            </div>
            <div>
              <h2 className="font-black text-lg lg:text-xl text-gray-900 font-heading leading-none">
                Full Menu
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Browse everything we offer</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-10">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-5 w-36 mb-4 rounded" />
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, j) => <MenuItemSkeleton key={j} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {categories.map((cat, catIdx) => (
                <motion.div
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  className="scroll-mt-[130px]"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: catIdx * 0.04 }}
                >
                  {/* Category heading */}
                  <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                    <h3 className="font-black text-base lg:text-lg text-gray-900 font-heading">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                      {cat.items.length} items
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                    {cat.items.map((item) => (
                      <ProductCard key={item.id} item={item} allItems={allItems} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

    </div>
  );
}
