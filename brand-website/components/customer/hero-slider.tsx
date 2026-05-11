"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  imageUrl?: string;
  bg: string;
}

interface HeroSliderProps {
  slides?: HeroSlide[];
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "s1",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1400&q=80",
    bg: "from-[#E63946] to-[#FF6B35]",
  },
  {
    id: "s2",
    imageUrl:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=1400&q=80",
    bg: "from-[#1D3557] to-[#457B9D]",
  },
  {
    id: "s3",
    imageUrl:
      "https://images.unsplash.com/photo-1619881585966-3a8c36a5b9c6?w=1400&q=80",
    bg: "from-[#B5451B] to-[#F4A261]",
  },
  {
    id: "s4",
    imageUrl:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=1400&q=80",
    bg: "from-[#2D6A4F] to-[#52B788]",
  },
];

const INTERVAL = 5000;

export function HeroSlider({ slides = DEFAULT_SLIDES }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef(0);

  const goTo = useCallback(
    (idx: number) => {
      setCurrent((idx + slides.length) % slides.length);
      setProgress(0);
    },
    [slides.length],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;

    const tick = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
      setProgress(0);
    }, INTERVAL);

    const bar = setInterval(() => {
      setProgress((p) => Math.min(p + 100 / (INTERVAL / 50), 100));
    }, 50);

    return () => {
      clearInterval(tick);
      clearInterval(bar);
    };
  }, [paused, current, slides.length]);

  const slide = slides[current];

  return (
    <div
      className="relative w-full h-[300px] sm:h-[380px] lg:h-[520px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
      }}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slide.imageUrl ? (
            <Image
              src={slide.imageUrl}
              alt="Food banner"
              fill
              className="object-cover object-center"
              priority
            />
          ) : (
            <div className={cn("absolute inset-0 bg-gradient-to-br", slide.bg)} />
          )}
          {/* Subtle vignette at edges for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next arrows (desktop) */}
      <button
        onClick={prev}
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-sm items-center justify-center transition-all hover:scale-110"
      >
        <ChevronLeft size={22} className="text-white" />
      </button>
      <button
        onClick={next}
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-sm items-center justify-center transition-all hover:scale-110"
      >
        <ChevronRight size={22} className="text-white" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "rounded-full transition-all duration-300",
              i === current
                ? "w-6 h-2.5 bg-white shadow-sm"
                : "w-2.5 h-2.5 bg-white/45 hover:bg-white/70",
            )}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
        <div
          className="h-full bg-white/40 transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
