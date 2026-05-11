"use client";

import { Download, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePwaInstall } from "@/lib/hooks/use-pwa-install";
import { Button } from "@/components/ui/button";

export function PwaInstallPrompt() {
  const { canInstall, install } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInstall = async () => {
    setLoading(true);
    await install();
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {canInstall && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shrink-0">
              <Download size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Install the app</p>
              <p className="text-xs text-gray-500">Order faster with our app</p>
            </div>
            <Button size="sm" onClick={handleInstall} loading={loading}>
              Install
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
