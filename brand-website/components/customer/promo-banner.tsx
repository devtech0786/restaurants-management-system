"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromoSlide {
  id: string;
  bg: string;               // Tailwind gradient or bg class
  accentColor: string;      // for badge + CTA
  badge?: string;           // e.g. "50% OFF"
  headline: string;
  sub: string;
  cta?: string;
  coupon?: string;
  emoji: string;
}

const SLIDES: PromoSlide[] = [
  {
    id: "1",
    bg: "from-[#E63946] to-[#FF6B35]",
    accentColor: "#fff",
    badge: "50% OFF",
    headline: "Flame-Grilled Deals",
    sub: "On your first 3 orders this week",
    cta: "Order Now",
    coupon: "FASTFO10",
    emoji: "🍔",
  },
  {
    id: "2",
    bg: "from-[#1D3557] to-[#457B9D]",
    accentColor: "#FFD60A",
    badge: "FREE DELIVERY",
    headline: "Free Delivery All Day",
    sub: "No minimum order — today only",
    cta: "Grab it",
    emoji: "🛵",
  },
  {
    id: "3",
    bg: "from-[#2D6A4F] to-[#52B788]",
    accentColor: "#fff",
    badge: "NEW",
    headline: "Fresh Veggie Range",
    sub: "Crispy, healthy & bursting with flavour",
    cta: "Explore",
    emoji: "🥬",
  },
  {
    id: "4",
    bg: "from-[#7B2D8B] to-[#C77DFF]",
    accentColor: "#FFD60A",
    badge: "COMBO DEAL",
    headline: "Family Feast Bundle",
    sub: "4 burgers + 4 drinks + fries — Rs. 2,499",
    cta: "Add to cart",
    coupon: "FAMILY",
    emoji: "🎁",
  },
  {
    id: "5",
    bg: "from-[#B5451B] to-[#F4A261]",
    accentColor: "#fff",
    badge: "FLASH SALE",
    headline: "Spicy Chicken Wings",
    sub: "Buy 6 get 6 free — limited time only 🔥",
    cta: "Claim now",
    emoji: "🍗",
  },
];

const INTERVAL = 4500; // ms between slides

export function PromoBanner() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (dismissed || paused) return;

    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
      setProgress(0);
    }, INTERVAL);

    // Progress bar tick (~60fps feel)
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 100 / (INTERVAL / 50), 100));
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [dismissed, paused, current]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
  };

  if (dismissed) return null;

  const slide = SLIDES[current];

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className={cn(
            "w-full bg-gradient-to-r flex items-center gap-3 lg:gap-6 px-4 lg:px-8 py-3 lg:py-4",
            slide.bg
          )}
          style={{ minHeight: "68px" }}
        >
          {/* Emoji */}
          <span className="text-3xl lg:text-4xl shrink-0 drop-shadow-sm">
            {slide.emoji}
          </span>

          {/* Text block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              {slide.badge && (
                <span
                  className="text-[10px] lg:text-xs font-black px-2 py-0.5 rounded-md shrink-0 tracking-wide"
                  style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
                >
                  {slide.badge}
                </span>
              )}
              <p className="text-white font-bold text-sm lg:text-base leading-tight truncate font-heading">
                {slide.headline}
              </p>
            </div>
            <p className="text-white/75 text-xs lg:text-sm leading-tight truncate">
              {slide.sub}
            </p>
          </div>

          {/* Coupon pill + CTA — desktop */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {slide.coupon && (
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1.5">
                <span className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Code</span>
                <span className="text-white font-black text-sm tracking-widest">{slide.coupon}</span>
              </div>
            )}
            {slide.cta && (
              <button
                className="px-4 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
                style={{ background: "rgba(255,255,255,0.95)", color: "#E63946" }}
              >
                {slide.cta} →
              </button>
            )}
          </div>

          {/* Mobile CTA */}
          {slide.cta && (
            <button
              className="sm:hidden px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.9)", color: "#E63946" }}
            >
              {slide.cta}
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20">
        <div
          className="h-full bg-white/60 transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Prev / Next arrows — desktop */}
      <button
        onClick={prev}
        className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm items-center justify-center transition-all"
      >
        <ChevronLeft size={14} className="text-white" />
      </button>
      <button
        onClick={next}
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm items-center justify-center transition-all"
      >
        <ChevronRight size={14} className="text-white" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "rounded-full transition-all",
              i === current
                ? "w-4 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-1.5 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
      >
        <X size={11} className="text-white" />
      </button>
    </div>
  );
}
