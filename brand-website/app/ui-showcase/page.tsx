"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus, Minus, Star, Clock, ChevronRight, Check,
  Heart, ArrowRight, Zap, Flame, ShoppingBag, Tag,
  Percent, Timer, X, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Shared mock data ─────────────────────────────────────────────────────────

const CATS = [
  { id: "1", name: "Burgers",  emoji: "🍔", count: 8,  from: "#E63946", to: "#FF6B35", light: "#FFF0F0", ink: "#C1121F" },
  { id: "2", name: "Combos",   emoji: "🎁", count: 5,  from: "#7209B7", to: "#B5179E", light: "#FAF0FF", ink: "#6A0FA3" },
  { id: "3", name: "Sides",    emoji: "🍟", count: 6,  from: "#F77F00", to: "#FCBF49", light: "#FFF8EE", ink: "#C77800" },
  { id: "4", name: "Drinks",   emoji: "🥤", count: 7,  from: "#0077B6", to: "#00B4D8", light: "#F0F9FF", ink: "#005F92" },
  { id: "5", name: "Desserts", emoji: "🍦", count: 4,  from: "#2D6A4F", to: "#52B788", light: "#F0FFF4", ink: "#1B4332" },
];

const PRODUCT = {
  name: "Classic Whopper",
  desc: "Flame-grilled beef patty with fresh tomatoes, lettuce, mayo & pickles on a toasted sesame bun.",
  price: 950,
  rating: 4.8,
  reviews: 1240,
  calories: 660,
  img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  sizes: [
    { id: "r",  label: "Regular", sub: "Single patty · 660 cal", extra: 0   },
    { id: "l",  label: "Large",   sub: "Double patty · 890 cal", extra: 150 },
    { id: "xl", label: "XL Meal", sub: "+ Sides & Drink",        extra: 400 },
  ],
  addons: [
    { id: "ch", label: "Extra Cheese",   price: 60  },
    { id: "ba", label: "Crispy Bacon",   price: 120 },
    { id: "eg", label: "Fried Egg",      price: 80  },
    { id: "sa", label: "Special Sauce",  price: 40  },
    { id: "ja", label: "Jalapeños",      price: 50  },
    { id: "av", label: "Avocado Slices", price: 90  },
  ],
};

const ITEMS = [
  {
    id: "1", name: "Classic Whopper",
    desc: "Flame-grilled beef with fresh veggies on sesame bun",
    price: 950, slash: 1200,
    rating: 4.8, reviews: 1240,
    cal: 660, time: "15 min",
    tags: ["Beef", "Bestseller"],
    badge: "🔥 Popular", badgeBg: "#F97316",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  },
  {
    id: "2", name: "Crispy Chicken Deluxe",
    desc: "Juicy crispy chicken with coleslaw & honey mustard",
    price: 850, slash: null,
    rating: 4.6, reviews: 892,
    cal: 580, time: "12 min",
    tags: ["Chicken", "Spicy"],
    badge: "⚡ New", badgeBg: "#3B82F6",
    img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80",
  },
];

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;

function Stars({ v, size = 11 }: { v: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <Star size={size} className="fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-gray-700">{v}</span>
    </span>
  );
}

// ─── Showcase wrappers ────────────────────────────────────────────────────────

const VARIANT_COLORS = ["#E63946", "#7209B7", "#0077B6", "#2D6A4F"];
const VARIANT_LABELS = ["V1", "V2", "V3", "V4"];
const VARIANT_NAMES  = {
  cat:  ["Pill Tabs",     "Icon Grid",    "Banner Scroll",  "Dark Sidebar"     ],
  cfg:  ["Classic Form",  "Side Split",   "Step Wizard",    "Chip Select"      ],
  card: ["Horizontal",    "Vertical Grid","Minimal Row",    "Hero Overlay"     ],
};

function VariantShell({
  index, group, children,
}: { index: number; group: keyof typeof VARIANT_NAMES; children: React.ReactNode }) {
  const color = VARIANT_COLORS[index];
  const label = VARIANT_LABELS[index];
  const name  = VARIANT_NAMES[group][index];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className="text-[11px] font-black px-2 py-0.5 rounded-md text-white tracking-wide"
          style={{ background: color }}
        >
          {label}
        </span>
        <span className="text-sm font-bold text-gray-800">{name}</span>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-4">
        {children}
      </div>
    </div>
  );
}

function SectionHeader({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-black text-sm shrink-0 shadow-brand">
        {n}
      </div>
      <div>
        <h2 className="text-xl font-black text-gray-900 font-heading">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — CATEGORY DESIGNS
// ══════════════════════════════════════════════════════════════════════════════

/** V1 · Pill Tabs — horizontal scroll with gradient active */
function CatV1() {
  const [active, setActive] = useState("1");
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATS.map((c) => {
        const on = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap",
              on
                ? "text-white border-transparent shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
            style={on ? { background: `linear-gradient(135deg, ${c.from}, ${c.to})` } : {}}
          >
            <span className="text-base leading-none">{c.emoji}</span>
            {c.name}
          </button>
        );
      })}
    </div>
  );
}

/** V2 · Icon Grid — square cards with emoji + name */
function CatV2() {
  const [active, setActive] = useState("1");
  return (
    <div className="grid grid-cols-5 gap-2">
      {CATS.map((c) => {
        const on = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border-2 transition-all",
              on ? "border-transparent shadow-md" : "border-gray-100 bg-white hover:border-gray-200"
            )}
            style={on ? { background: c.light, borderColor: c.from } : {}}
          >
            <span className="text-2xl">{c.emoji}</span>
            <span
              className="text-[10px] font-bold leading-tight text-center"
              style={{ color: on ? c.ink : "#4B5563" }}
            >
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** V3 · Banner Scroll — gradient landscape cards with emoji right */
function CatV3() {
  const [active, setActive] = useState("1");
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
      {CATS.map((c) => {
        const on = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "shrink-0 relative flex items-center justify-between w-[130px] h-20 rounded-2xl px-3 py-3 overflow-hidden transition-all",
              on ? "ring-2 ring-white ring-offset-1 shadow-lg scale-[1.03]" : "opacity-80 hover:opacity-100"
            )}
            style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
          >
            <div className="text-left z-10">
              <p className="text-white/70 text-[9px] font-semibold uppercase tracking-wide">
                {c.count} items
              </p>
              <p className="text-white font-black text-sm leading-tight mt-0.5">{c.name}</p>
            </div>
            <span className="text-3xl drop-shadow-sm">{c.emoji}</span>
            {on && (
              <div className="absolute bottom-1.5 left-3 w-1.5 h-1.5 rounded-full bg-white/80" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** V4 · Dark Sidebar — vertical list with colored left border */
function CatV4() {
  const [active, setActive] = useState("1");
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden divide-y divide-white/5">
      {CATS.map((c) => {
        const on = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 transition-all text-left",
              on ? "bg-white/10" : "hover:bg-white/5"
            )}
            style={on ? { borderLeft: `3px solid ${c.from}` } : { borderLeft: "3px solid transparent" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
              style={{ background: on ? `linear-gradient(135deg, ${c.from}, ${c.to})` : "rgba(255,255,255,0.08)" }}
            >
              {c.emoji}
            </div>
            <span className={cn("text-sm font-semibold flex-1", on ? "text-white" : "text-gray-400")}>
              {c.name}
            </span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: on ? `${c.from}33` : "rgba(255,255,255,0.06)", color: on ? c.from : "#6B7280" }}
            >
              {c.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — PRODUCT CONFIGURATOR
// ══════════════════════════════════════════════════════════════════════════════

/** V1 · Classic Form — image header + stacked sections */
function CfgV1() {
  const [size, setSize] = useState("r");
  const [addons, setAddons] = useState<string[]>([]);
  const sizeExtra = PRODUCT.sizes.find((s) => s.id === size)?.extra ?? 0;
  const addonTotal = addons.reduce((s, id) => s + (PRODUCT.addons.find((a) => a.id === id)?.price ?? 0), 0);
  const total = PRODUCT.price + sizeExtra + addonTotal;

  return (
    <div className="space-y-4">
      {/* Product header */}
      <div className="flex gap-3">
        <Image src={PRODUCT.img} alt={PRODUCT.name} width={72} height={72}
          className="w-18 h-18 rounded-xl object-cover shrink-0" />
        <div>
          <p className="font-bold text-gray-900 leading-tight">{PRODUCT.name}</p>
          <Stars v={PRODUCT.rating} />
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{PRODUCT.desc}</p>
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Choose Size</p>
        <div className="space-y-2">
          {PRODUCT.sizes.map((s) => (
            <label key={s.id} className={cn(
              "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
              size === s.id ? "border-[#E63946] bg-red-50" : "border-gray-100 hover:border-gray-200"
            )}>
              <div className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                size === s.id ? "border-[#E63946]" : "border-gray-300"
              )}>
                {size === s.id && <div className="w-2 h-2 rounded-full bg-[#E63946]" />}
              </div>
              <input type="radio" className="sr-only" value={s.id} checked={size === s.id} onChange={() => setSize(s.id)} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="text-[11px] text-gray-400">{s.sub}</p>
              </div>
              <span className="text-sm font-bold text-[#E63946]">
                {s.extra === 0 ? "Included" : `+${fmt(s.extra)}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Addons */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Extras</p>
        <div className="grid grid-cols-2 gap-2">
          {PRODUCT.addons.map((a) => {
            const on = addons.includes(a.id);
            return (
              <label key={a.id} className={cn(
                "flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-all",
                on ? "border-[#E63946] bg-red-50" : "border-gray-100 hover:border-gray-200"
              )}>
                <div className={cn(
                  "w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors",
                  on ? "bg-[#E63946]" : "border-2 border-gray-300"
                )}>
                  {on && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
                <input type="checkbox" className="sr-only" checked={on}
                  onChange={() => setAddons((p) => on ? p.filter((x) => x !== a.id) : [...p, a.id])} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold truncate">{a.label}</p>
                  <p className="text-[10px] text-gray-400">+{fmt(a.price)}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <div>
          <p className="text-[10px] text-gray-400">Total</p>
          <p className="text-lg font-black text-[#E63946]">{fmt(total)}</p>
        </div>
        <button className="flex-1 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#E63946,#FF6B35)" }}>
          <Plus size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}

/** V2 · Side Split — image/info left, form right */
function CfgV2() {
  const [size, setSize] = useState("r");
  const [addons, setAddons] = useState<string[]>([]);
  const sizeExtra = PRODUCT.sizes.find((s) => s.id === size)?.extra ?? 0;
  const addonTotal = addons.reduce((s, id) => s + (PRODUCT.addons.find((a) => a.id === id)?.price ?? 0), 0);
  const total = PRODUCT.price + sizeExtra + addonTotal;

  return (
    <div className="grid grid-cols-[110px_1fr] gap-4">
      {/* Left: image + meta */}
      <div className="space-y-3">
        <Image src={PRODUCT.img} alt={PRODUCT.name} width={110} height={110}
          className="w-full aspect-square rounded-xl object-cover" />
        <div className="space-y-1">
          <Stars v={PRODUCT.rating} />
          <p className="text-[10px] text-gray-400">{PRODUCT.reviews.toLocaleString()} reviews</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {["Beef", "Popular"].map((t) => (
              <span key={t} className="text-[9px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md">{t}</span>
            ))}
          </div>
        </div>
        <p className="text-xl font-black text-[#E63946]">{fmt(total)}</p>
        <button className="w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg,#E63946,#FF6B35)" }}>
          Add to Cart
        </button>
      </div>

      {/* Right: form */}
      <div className="space-y-4 overflow-y-auto max-h-[340px] pr-1">
        <div>
          <p className="font-black text-gray-900 text-sm leading-tight mb-1">{PRODUCT.name}</p>
          <p className="text-[11px] text-gray-400 line-clamp-2">{PRODUCT.desc}</p>
        </div>

        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Size</p>
          <div className="space-y-1.5">
            {PRODUCT.sizes.map((s) => (
              <button key={s.id} onClick={() => setSize(s.id)}
                className={cn(
                  "w-full flex justify-between items-center px-3 py-2 rounded-lg border text-left transition-all",
                  size === s.id ? "border-[#E63946] bg-red-50" : "border-gray-100 hover:border-gray-200 bg-white"
                )}>
                <div>
                  <span className="text-xs font-bold">{s.label}</span>
                  <span className="text-[10px] text-gray-400 ml-1.5">{s.sub}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: size === s.id ? "#E63946" : "#6B7280" }}>
                  {s.extra === 0 ? "Base" : `+${fmt(s.extra)}`}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Extras</p>
          <div className="grid grid-cols-1 gap-1.5">
            {PRODUCT.addons.map((a) => {
              const on = addons.includes(a.id);
              return (
                <button key={a.id} onClick={() => setAddons((p) => on ? p.filter((x) => x !== a.id) : [...p, a.id])}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all",
                    on ? "border-[#E63946] bg-red-50" : "border-gray-100 bg-white hover:border-gray-200"
                  )}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3.5 h-3.5 rounded flex items-center justify-center shrink-0", on ? "bg-[#E63946]" : "border border-gray-300")}>
                      {on && <Check size={9} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-xs font-medium">{a.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">+{fmt(a.price)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** V3 · Step Wizard — one option group per numbered step */
function CfgV3() {
  const [step, setStep] = useState(0);
  const [size, setSize] = useState("r");
  const [addons, setAddons] = useState<string[]>([]);
  const STEPS = ["Choose Size", "Add Extras", "Confirm"];
  const sizeExtra = PRODUCT.sizes.find((s) => s.id === size)?.extra ?? 0;
  const addonTotal = addons.reduce((s, id) => s + (PRODUCT.addons.find((a) => a.id === id)?.price ?? 0), 0);
  const total = PRODUCT.price + sizeExtra + addonTotal;

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1 flex-1">
            <button onClick={() => i <= step && setStep(i)} className="flex items-center gap-1.5 shrink-0">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                i < step  ? "bg-green-500 text-white" :
                i === step ? "text-white" : "bg-gray-100 text-gray-400"
              )}
                style={i === step ? { background: "linear-gradient(135deg,#E63946,#FF6B35)" } : {}}>
                {i < step ? <Check size={10} strokeWidth={3} /> : i + 1}
              </div>
              <span className={cn("text-[10px] font-bold hidden sm:block",
                i === step ? "text-[#E63946]" : i < step ? "text-green-600" : "text-gray-400")}>
                {label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-px mx-1 transition-colors", i < step ? "bg-green-400" : "bg-gray-200")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 */}
      {step === 0 && (
        <div className="space-y-2">
          {PRODUCT.sizes.map((s) => (
            <button key={s.id} onClick={() => setSize(s.id)}
              className={cn(
                "w-full flex items-center gap-4 p-3.5 rounded-xl border-2 text-left transition-all",
                size === s.id ? "border-[#E63946] bg-red-50 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"
              )}>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black transition-all",
                size === s.id ? "text-white" : "bg-gray-100 text-gray-400"
              )}
                style={size === s.id ? { background: "linear-gradient(135deg,#E63946,#FF6B35)" } : {}}>
                {s.id === "r" ? "S" : s.id === "l" ? "L" : "XL"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{s.label}</p>
                <p className="text-[11px] text-gray-400">{s.sub}</p>
              </div>
              <p className="text-sm font-black" style={{ color: size === s.id ? "#E63946" : "#9CA3AF" }}>
                {s.extra === 0 ? fmt(PRODUCT.price) : `+${fmt(s.extra)}`}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-2">
          {PRODUCT.addons.map((a) => {
            const on = addons.includes(a.id);
            return (
              <button key={a.id} onClick={() => setAddons((p) => on ? p.filter((x) => x !== a.id) : [...p, a.id])}
                className={cn(
                  "flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all",
                  on ? "border-[#E63946] bg-red-50" : "border-gray-100 bg-white hover:border-gray-200"
                )}>
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold truncate">{a.label}</span>
                  {on && <Check size={12} className="text-[#E63946] shrink-0" strokeWidth={3} />}
                </div>
                <span className="text-[11px] font-semibold" style={{ color: on ? "#E63946" : "#9CA3AF" }}>
                  +{fmt(a.price)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-3">
          <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
            <Image src={PRODUCT.img} alt={PRODUCT.name} width={56} height={56}
              className="w-14 h-14 rounded-lg object-cover shrink-0" />
            <div>
              <p className="font-bold text-sm">{PRODUCT.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {PRODUCT.sizes.find((s) => s.id === size)?.label}
                {addons.length > 0 && ` · ${addons.length} extra${addons.length > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Base price</span><span>{fmt(PRODUCT.price)}</span>
            </div>
            {sizeExtra > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Size upgrade</span><span>+{fmt(sizeExtra)}</span>
              </div>
            )}
            {addonTotal > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Extras ({addons.length})</span><span>+{fmt(addonTotal)}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-base pt-2 border-t border-gray-100">
              <span>Total</span><span style={{ color: "#E63946" }}>{fmt(total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-2 pt-1">
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)}
            className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-gray-300 transition-colors">
            Back
          </button>
        )}
        {step < 2 ? (
          <button onClick={() => setStep((s) => s + 1)}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md"
            style={{ background: "linear-gradient(135deg,#E63946,#FF6B35)" }}>
            Next <ArrowRight size={15} />
          </button>
        ) : (
          <button
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md"
            style={{ background: "linear-gradient(135deg,#E63946,#FF6B35)" }}>
            <ShoppingBag size={15} /> Place Order — {fmt(total)}
          </button>
        )}
      </div>
    </div>
  );
}

/** V4 · Chip Select — compact toggle chips + inline quantity */
function CfgV4() {
  const [size, setSize] = useState("r");
  const [addons, setAddons] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const sizeExtra = PRODUCT.sizes.find((s) => s.id === size)?.extra ?? 0;
  const addonTotal = addons.reduce((s, id) => s + (PRODUCT.addons.find((a) => a.id === id)?.price ?? 0), 0);
  const unit = PRODUCT.price + sizeExtra + addonTotal;

  return (
    <div className="space-y-4">
      {/* Compact header */}
      <div className="flex gap-3 items-center">
        <Image src={PRODUCT.img} alt={PRODUCT.name} width={52} height={52}
          className="w-13 h-13 rounded-xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-sm">{PRODUCT.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Stars v={PRODUCT.rating} />
            <span className="text-[10px] text-gray-400">{PRODUCT.calories} cal</span>
          </div>
        </div>
        <p className="text-lg font-black" style={{ color: "#E63946" }}>{fmt(unit)}</p>
      </div>

      {/* Size chips */}
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Size</p>
        <div className="flex gap-2">
          {PRODUCT.sizes.map((s) => {
            const on = size === s.id;
            return (
              <button key={s.id} onClick={() => setSize(s.id)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all",
                  on ? "text-white border-transparent shadow-md" : "border-gray-200 text-gray-500 hover:border-gray-300"
                )}
                style={on ? { background: "linear-gradient(135deg,#E63946,#FF6B35)" } : {}}>
                <span className="block">{s.label}</span>
                <span className="block text-[9px] font-semibold opacity-75 mt-0.5">
                  {s.extra === 0 ? "Base" : `+${fmt(s.extra)}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Addon toggle pills */}
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
          Extras <span className="normal-case text-gray-300 font-normal ml-1">optional</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PRODUCT.addons.map((a) => {
            const on = addons.includes(a.id);
            return (
              <button key={a.id} onClick={() => setAddons((p) => on ? p.filter((x) => x !== a.id) : [...p, a.id])}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  on
                    ? "text-white border-transparent"
                    : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"
                )}
                style={on ? { background: "#E63946" } : {}}>
                {on && <Check size={10} strokeWidth={3} />}
                {a.label}
                {!on && <span className="text-gray-400 ml-0.5">+{fmt(a.price)}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Qty + add */}
      <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1.5">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md transition-shadow">
            <Minus size={12} />
          </button>
          <span className="w-5 text-center text-sm font-black">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)}
            className="w-6 h-6 rounded-full text-white shadow flex items-center justify-center hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#E63946,#FF6B35)" }}>
            <Plus size={12} />
          </button>
        </div>
        <button className="flex-1 py-3 rounded-xl text-white text-sm font-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md"
          style={{ background: "linear-gradient(135deg,#E63946,#FF6B35)" }}>
          Add {qty > 1 ? `×${qty}` : ""} — {fmt(unit * qty)}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — PRODUCT CARDS
// ══════════════════════════════════════════════════════════════════════════════

/** V1 · Horizontal — image left, content right */
function CardV1() {
  return (
    <div className="space-y-3">
      {ITEMS.map((item) => (
        <div key={item.id} className="flex gap-3 p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="relative shrink-0">
            <Image src={item.img} alt={item.name} width={88} height={88}
              className="w-22 h-22 rounded-xl object-cover" />
            <span className="absolute top-1.5 left-1.5 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md"
              style={{ background: item.badgeBg }}>{item.badge}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 text-sm leading-tight">{item.name}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{item.desc}</p>
            <div className="flex items-center gap-2 mt-1">
              <Stars v={item.rating} />
              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                <Clock size={9} /> {item.time}
              </span>
              <span className="text-[10px] text-gray-400">{item.cal} cal</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {item.tags.map((t) => (
                <span key={t} className="text-[9px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md">{t}</span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-base" style={{ color: "#E63946" }}>{fmt(item.price)}</span>
                {item.slash && (
                  <span className="text-xs text-gray-300 line-through">{fmt(item.slash)}</span>
                )}
              </div>
              <button className="w-8 h-8 rounded-full text-white flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#E63946,#FF6B35)" }}>
                <Plus size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** V2 · Vertical Grid — image top fills card */
function CardV2() {
  const [favs, setFavs] = useState<string[]>([]);
  return (
    <div className="grid grid-cols-2 gap-3">
      {ITEMS.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute top-2 left-2 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md"
              style={{ background: item.badgeBg }}>{item.badge}</span>
            <button onClick={() => setFavs((f) => f.includes(item.id) ? f.filter((x) => x !== item.id) : [...f, item.id])}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
              <Heart size={13} className={favs.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
          </div>

          {/* Content */}
          <div className="p-3">
            <p className="font-bold text-gray-900 text-sm leading-tight truncate">{item.name}</p>
            <div className="flex items-center justify-between mt-1.5">
              <div>
                <span className="font-black text-base" style={{ color: "#E63946" }}>{fmt(item.price)}</span>
                {item.slash && (
                  <span className="text-[10px] text-gray-300 line-through ml-1">{fmt(item.slash)}</span>
                )}
              </div>
              <Stars v={item.rating} />
            </div>
            <button className="w-full mt-2.5 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#E63946,#FF6B35)" }}>
              <Plus size={12} /> Add to cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/** V3 · Minimal Row — text-dense, no heavy imagery */
function CardV3() {
  const [added, setAdded] = useState<string[]>([]);
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
      {ITEMS.map((item) => {
        const on = added.includes(item.id);
        return (
          <div key={item.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
            {/* Tiny thumbnail */}
            <div className="relative w-12 h-12 shrink-0">
              <Image src={item.img} alt={item.name} fill className="object-cover rounded-lg" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm text-gray-900 truncate">{item.name}</p>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md text-white shrink-0"
                  style={{ background: item.badgeBg }}>{item.badge}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Stars v={item.rating} size={9} />
                <span className="text-[10px] text-gray-400">{item.cal} cal</span>
                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  <Clock size={8} /> {item.time}
                </span>
              </div>
            </div>

            {/* Price + toggle */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="font-black text-sm" style={{ color: "#E63946" }}>{fmt(item.price)}</span>
              <button onClick={() => setAdded((p) => on ? p.filter((x) => x !== item.id) : [...p, item.id])}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-sm",
                  on ? "bg-green-500 text-white" : "text-white"
                )}
                style={!on ? { background: "linear-gradient(135deg,#E63946,#FF6B35)" } : {}}>
                {on ? <Check size={12} strokeWidth={3} /> : <Plus size={12} />}
              </button>
            </div>
          </div>
        );
      })}

      {/* Footer hint */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">{ITEMS.length} items</span>
        <button className="text-[11px] font-semibold flex items-center gap-0.5" style={{ color: "#E63946" }}>
          View all <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}

/** V4 · Hero Overlay — full-bleed image with gradient text overlay */
function CardV4() {
  const [favs, setFavs] = useState<string[]>([]);
  return (
    <div className="space-y-3">
      {ITEMS.map((item, i) => (
        <div key={item.id}
          className={cn("relative rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow", i === 0 ? "h-44" : "h-36")}>
          {/* Background image */}
          <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="text-white text-[10px] font-black px-2 py-1 rounded-lg backdrop-blur-sm border border-white/20"
              style={{ background: `${item.badgeBg}CC` }}>{item.badge}</span>
          </div>

          {/* Favorite */}
          <button onClick={() => setFavs((f) => f.includes(item.id) ? f.filter((x) => x !== item.id) : [...f, item.id])}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform border border-white/20">
            <Heart size={14} className={favs.includes(item.id) ? "fill-red-400 text-red-400" : "text-white"} />
          </button>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div>
              <p className="text-white font-black text-base leading-tight drop-shadow-md">{item.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Stars v={item.rating} />
                <span className="text-white/60 text-[10px] flex items-center gap-0.5">
                  <Clock size={9} /> {item.time}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-white font-black text-lg leading-none">{fmt(item.price)}</p>
                {item.slash && <p className="text-white/40 text-[10px] line-through">{fmt(item.slash)}</p>}
              </div>
              <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                style={{ color: "#E63946" }}>
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function UIShowcasePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB]">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-[#E63946] mb-3 border border-red-100">
                <Sparkles size={12} /> Design System
              </span>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 font-heading leading-tight">
                UI/UX Component<br />
                <span style={{ background: "linear-gradient(135deg,#E63946,#FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Variations
                </span>
              </h1>
              <p className="text-gray-500 text-sm lg:text-base mt-3 max-w-xl">
                12 unique design variations across 3 component categories — categories, product configurators, and product cards.
                Each explores distinct layout, spacing, and visual language.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 shrink-0">
              {[
                { n: "3",  label: "Sections" },
                { n: "12", label: "Variations" },
                { n: "4",  label: "Per section" },
              ].map(({ n, label }) => (
                <div key={label} className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100 min-w-[80px]">
                  <p className="text-2xl font-black text-gray-900">{n}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-16">

        {/* ══ SECTION 1: Category Designs ══════════════════════════════════════ */}
        <section>
          <SectionHeader
            n="01"
            title="Category Section Designs"
            desc="4 distinct approaches to presenting food categories — from horizontal pill tabs to dark sidebar navigation."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <VariantShell index={0} group="cat"><CatV1 /></VariantShell>
            <VariantShell index={1} group="cat"><CatV2 /></VariantShell>
            <VariantShell index={2} group="cat"><CatV3 /></VariantShell>
            <VariantShell index={3} group="cat"><CatV4 /></VariantShell>
          </div>
        </section>

        {/* ══ SECTION 2: Product Configurators ═════════════════════════════════ */}
        <section>
          <SectionHeader
            n="02"
            title="Product Configurator Layouts"
            desc="4 unique ways to present product customization — from guided wizards to compact chip selectors."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VariantShell index={0} group="cfg"><CfgV1 /></VariantShell>
            <VariantShell index={1} group="cfg"><CfgV2 /></VariantShell>
            <VariantShell index={2} group="cfg"><CfgV3 /></VariantShell>
            <VariantShell index={3} group="cfg"><CfgV4 /></VariantShell>
          </div>
        </section>

        {/* ══ SECTION 3: Product Cards ══════════════════════════════════════════ */}
        <section>
          <SectionHeader
            n="03"
            title="Product Card Designs"
            desc="4 card styles from information-dense horizontal rows to editorial full-bleed hero cards."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <VariantShell index={0} group="card"><CardV1 /></VariantShell>
            <VariantShell index={1} group="card"><CardV2 /></VariantShell>
            <VariantShell index={2} group="card"><CardV3 /></VariantShell>
            <VariantShell index={3} group="card"><CardV4 /></VariantShell>
          </div>
        </section>

        {/* Footer credit */}
        <div className="text-center pb-6">
          <p className="text-xs text-gray-400">
            Fastfo UI/UX Design System · All components are interactive — click to explore states
          </p>
        </div>

      </div>
    </div>
  );
}
