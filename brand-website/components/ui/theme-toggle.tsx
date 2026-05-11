"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Render a visible placeholder so layout doesn't shift
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0
        border border-gray-200 dark:border-gray-700
        bg-gray-50 dark:bg-gray-800
        text-gray-600 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-700
        hover:border-gray-300 dark:hover:border-gray-600
        transition-all"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0,   opacity: 1 }}
          exit={{    scale: 0, rotate:  90, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex items-center justify-center"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
