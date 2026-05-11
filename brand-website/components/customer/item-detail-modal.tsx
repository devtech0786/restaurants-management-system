"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import type { MenuItem, VariantOption, AddonOption } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { formatCurrency, calcItemPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";

interface Props {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAdded?: (name: string) => void;
}

export function ItemDetailModal({ item, isOpen, onClose, onAdded }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, VariantOption>>({});
  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);
  const [instructions, setInstructions] = useState("");

  const unitPrice = calcItemPrice(item.price, selectedVariants, selectedAddons);
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (option: AddonOption) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === option.id)
        ? prev.filter((a) => a.id !== option.id)
        : [...prev, option]
    );
  };

  const handleAdd = () => {
    addItem(item, quantity, selectedVariants, selectedAddons, instructions);
    onAdded?.(item.name);
    onClose();
    setQuantity(1);
    setSelectedVariants({});
    setSelectedAddons([]);
    setInstructions("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {item.imageUrl && (
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={600}
          height={280}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-5 space-y-5">
        <div>
          <h2 className="text-xl font-bold">{item.name}</h2>
          {item.description && (
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          )}
        </div>

        {/* Variants */}
        {item.variants.map((variant) => (
          <div key={variant.id}>
            <p className="text-sm font-semibold mb-2">{variant.name}</p>
            <div className="flex flex-wrap gap-2">
              {variant.options.map((opt) => {
                const selected = selectedVariants[variant.id]?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() =>
                      setSelectedVariants((p) => ({ ...p, [variant.id]: opt }))
                    }
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selected
                        ? "border-brand-500 bg-brand-50 text-brand-700 font-medium"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {opt.label}
                    {opt.priceModifier > 0 && (
                      <span className="ml-1 text-xs text-gray-400">
                        +{formatCurrency(opt.priceModifier)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Addons */}
        {item.addons.map((addon) => (
          <div key={addon.id}>
            <p className="text-sm font-semibold mb-2">
              {addon.name}
              {addon.isRequired && <span className="text-red-400 ml-1">*</span>}
            </p>
            <div className="space-y-2">
              {addon.options.map((opt) => {
                const selected = selectedAddons.some((a) => a.id === opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleAddon(opt)}
                        className="accent-brand-500"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </div>
                    {opt.price > 0 && (
                      <span className="text-xs text-gray-500">+{formatCurrency(opt.price)}</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Special instructions */}
        <Textarea
          label="Special instructions"
          placeholder="E.g. No onions, extra sauce..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        {/* Quantity + Add */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
            >
              <Minus size={14} />
            </button>
            <span className="font-semibold w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full bg-brand-500 text-white shadow flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>
          <Button fullWidth onClick={handleAdd} size="lg">
            Add to cart — {formatCurrency(totalPrice)}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
