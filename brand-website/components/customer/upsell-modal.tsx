"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: MenuItem[];
  addedItemName: string;
}

export function UpsellModal({ isOpen, onClose, suggestions, addedItemName }: UpsellModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState<string[]>([]);

  const handleAdd = (item: MenuItem) => {
    if (added.includes(item.id)) return;
    addItem(item, 1, {}, [], undefined);
    setAdded((p) => [...p, item.id]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl pb-safe-bottom"
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    <span className="text-brand-500">{addedItemName}</span> added to cart!
                  </p>
                  <p className="text-xs text-gray-500">Complete your meal?</p>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="px-4 space-y-2 max-h-72 overflow-y-auto">
              {suggestions.map((item) => {
                const isAdded = added.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-xl shrink-0">
                        🍟
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                      <p className="text-sm font-bold text-brand-600 mt-0.5">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAdd(item)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        isAdded
                          ? "bg-green-500 text-white"
                          : "bg-brand-500 text-white hover:bg-brand-600 active:scale-95"
                      }`}
                    >
                      {isAdded ? <CheckCircle size={16} /> : <Plus size={16} />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-4 pt-3">
              <Button fullWidth variant="outline" onClick={onClose}>
                No thanks, go to cart
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
