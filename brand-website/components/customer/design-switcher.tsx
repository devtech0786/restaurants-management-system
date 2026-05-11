"use client";

import { useState } from "react";
import { Palette, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDesignVariantsStore,
  type DesignVariant,
} from "@/lib/store/design-variants";

/* ─── Config ──────────────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    key: "categoryVariant" as const,
    setter: "setCategoryVariant" as const,
    label: "Categories",
    variants: [
      { num: 1 as DesignVariant, name: "Bubbles",    preview: "🔵🟣🔵" },
      { num: 2 as DesignVariant, name: "Cards",      preview: "▬▬▬" },
      { num: 3 as DesignVariant, name: "Tabs",       preview: "— — —" },
      { num: 4 as DesignVariant, name: "Tiles",      preview: "▪▪▪▪" },
    ],
  },
  {
    key: "cardVariant" as const,
    setter: "setCardVariant" as const,
    label: "Product Cards",
    variants: [
      { num: 1 as DesignVariant, name: "Swiggy",     preview: "🟩" },
      { num: 2 as DesignVariant, name: "Uber Eats",  preview: "⬛" },
      { num: 3 as DesignVariant, name: "DoorDash",   preview: "⬜" },
      { num: 4 as DesignVariant, name: "Foodpanda",  preview: "🌸" },
    ],
  },
  {
    key: "configuratorVariant" as const,
    setter: "setConfiguratorVariant" as const,
    label: "Configurator",
    variants: [
      { num: 1 as DesignVariant, name: "Modal",      preview: "⬜" },
      { num: 2 as DesignVariant, name: "Drawer",     preview: "▶" },
      { num: 3 as DesignVariant, name: "Wizard",     preview: "1›2›3" },
      { num: 4 as DesignVariant, name: "Sheet",      preview: "⬆" },
    ],
  },
] as const;

/* ─── Component ────────────────────────────────────────────────────────────── */
export function DesignSwitcher() {
  const [open, setOpen] = useState(false);
  const store = useDesignVariantsStore();

  return (
    <div className="fixed bottom-24 right-4 lg:bottom-8 lg:right-6 z-50 flex flex-col items-end gap-2.5">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden w-[280px]"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
              <div className="flex items-center gap-2">
                <Palette size={14} className="text-white/60" />
                <span className="text-sm font-black text-white tracking-tight">Design Lab</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={12} className="text-white" />
              </button>
            </div>

            {/* Sections */}
            <div className="p-3 space-y-3">
              {SECTIONS.map(({ key, setter, label, variants }) => {
                const active = store[key];
                return (
                  <div key={key}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                      {label}
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {variants.map(({ num, name }) => {
                        const isActive = active === num;
                        return (
                          <button
                            key={num}
                            onClick={() => store[setter](num)}
                            className={`relative flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-center transition-all ${
                              isActive
                                ? "bg-brand-500 shadow-sm"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                          >
                            {isActive && (
                              <div className="absolute top-1 right-1 w-3 h-3 bg-white/30 rounded-full flex items-center justify-center">
                                <Check size={7} className="text-white" strokeWidth={3} />
                              </div>
                            )}
                            <span className={`text-sm font-black leading-none ${isActive ? "text-white" : "text-gray-700"}`}>
                              {num}
                            </span>
                            <span className={`text-[8px] font-semibold mt-1 leading-tight ${isActive ? "text-white/75" : "text-gray-400"}`}>
                              {name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 pb-3">
              <p className="text-[9px] text-gray-300 text-center font-medium tracking-wide">
                TEMPLATE DEMO · SELECTIONS SAVED
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={`w-13 h-13 w-[52px] h-[52px] rounded-2xl flex items-center justify-center shadow-lg transition-colors ${
          open ? "bg-gray-900 text-white" : "bg-brand-500 text-white hover:bg-brand-600"
        }`}
        title="Design Lab"
      >
        {open ? <X size={20} /> : <Palette size={20} />}
      </motion.button>
    </div>
  );
}
