"use client";

import { motion } from "framer-motion";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const FEATURED = {
  badge: "Today's Special",
  title: "50% OFF Your First 3 Orders",
  sub: "Use code FASTFO10 at checkout. Valid today only.",
  bg: "from-[#E63946] via-[#EF4E3A] to-[#FF6B35]",
  emoji: "🔥",
  cta: "Order Now",
  coupon: "FASTFO10",
};

const SIDE = [
  {
    id: "s1",
    badge: "Today Only",
    title: "Free Delivery",
    sub: "No minimum order",
    bg: "from-[#1D3557] to-[#457B9D]",
    emoji: "🛵",
    cta: "Grab It",
  },
  {
    id: "s2",
    badge: "Combo Deal",
    title: "Family Feast",
    sub: "4 burgers · 4 drinks · fries",
    bg: "from-[#6B21A8] to-[#A855F7]",
    emoji: "🎁",
    cta: "View Deal",
  },
];

/* ─── Component ─────────────────────────────────────────────────────────── */
export function DealBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-5 lg:py-7">
      {/*
        Mobile  : stack all 3 vertically
        Tablet+ : 2-col (featured left ⅔ | two side banners right ⅓)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">

        {/* ── Featured banner (spans 2 cols on sm+) ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42 }}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${FEATURED.bg}
            sm:col-span-2 p-6 lg:p-7 cursor-pointer group
            hover:shadow-xl hover:-translate-y-0.5 transition-all`}
          style={{ minHeight: "148px" }}
        >
          {/* Content */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[10px] font-bold bg-white/25 text-white px-2.5 py-0.5 rounded-full tracking-wide mb-2.5">
                {FEATURED.badge}
              </span>
              <h3 className="text-white font-black text-xl lg:text-2xl font-heading leading-tight mb-1.5">
                {FEATURED.title}
              </h3>
              <p className="text-white/70 text-xs lg:text-sm mb-4 leading-relaxed">
                {FEATURED.sub}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button className="text-sm font-bold bg-white text-brand-600 px-4 py-2 rounded-xl
                  hover:bg-brand-50 transition-all group-hover:scale-105 active:scale-95 shadow-sm">
                  {FEATURED.cta} →
                </button>
                <div className="flex items-center gap-1.5 bg-white/15 border border-white/25
                  backdrop-blur-sm rounded-xl px-3 py-1.5">
                  <span className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">
                    Code
                  </span>
                  <span className="text-white font-black text-sm tracking-widest">
                    {FEATURED.coupon}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-6xl lg:text-7xl drop-shadow-lg shrink-0 select-none
              group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              {FEATURED.emoji}
            </span>
          </div>

          {/* Decorative rings */}
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-4 -right-4  w-20 h-20 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute top-0   right-1/3   w-10 h-10 rounded-full bg-white/10" />
        </motion.div>

        {/* ── Two side banners (stack in right col) ── */}
        <div className="flex sm:flex-col gap-3">
          {SIDE.map((banner, i) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 1) * 0.1, duration: 0.4 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${banner.bg}
                flex-1 sm:flex-none p-4 lg:p-5 cursor-pointer group
                hover:shadow-lg hover:-translate-y-0.5 transition-all`}
              style={{ minHeight: "116px" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[9px] font-bold bg-white/25 text-white px-2 py-0.5 rounded-full tracking-wide mb-1.5">
                    {banner.badge}
                  </span>
                  <h4 className="text-white font-black text-sm lg:text-base font-heading leading-tight mb-0.5">
                    {banner.title}
                  </h4>
                  <p className="text-white/65 text-[11px] mb-3 leading-snug">{banner.sub}</p>
                  <button className="text-[11px] font-bold bg-white/20 hover:bg-white/30 text-white
                    px-3 py-1.5 rounded-lg transition-all group-hover:scale-105 active:scale-95">
                    {banner.cta} →
                  </button>
                </div>
                <span className="text-3xl lg:text-4xl drop-shadow-sm shrink-0 select-none
                  group-hover:scale-110 transition-transform duration-300">
                  {banner.emoji}
                </span>
              </div>
              <div className="pointer-events-none absolute -bottom-5 -right-5 w-16 h-16 rounded-full bg-white/10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
