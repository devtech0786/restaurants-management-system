import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart, CartItem, MenuItem, VariantOption, AddonOption } from "@/types";
import { calcItemPrice } from "@/lib/utils";
import { nanoid } from "nanoid";

interface CartStore {
  cart: Cart | null;
  isOpen: boolean;

  initCart: (tenantId: string, branchId: string) => void;
  addItem: (
    menuItem: MenuItem,
    quantity: number,
    selectedVariants: Record<string, VariantOption>,
    selectedAddons: AddonOption[],
    specialInstructions?: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,

      initCart: (tenantId, branchId) => {
        const existing = get().cart;
        if (!existing || existing.tenantId !== tenantId || existing.branchId !== branchId) {
          set({ cart: { tenantId, branchId, items: [] } });
        }
      },

      addItem: (menuItem, quantity, selectedVariants, selectedAddons, specialInstructions) => {
        const unitPrice = calcItemPrice(
          menuItem.price,
          selectedVariants,
          selectedAddons
        );
        const newItem: CartItem = {
          id: nanoid(),
          menuItem,
          quantity,
          selectedVariants,
          selectedAddons,
          specialInstructions,
          unitPrice,
        };
        set((state) => ({
          cart: state.cart
            ? { ...state.cart, items: [...state.cart.items, newItem] }
            : null,
          isOpen: true,
        }));
      },

      removeItem: (itemId) =>
        set((state) => ({
          cart: state.cart
            ? {
                ...state.cart,
                items: state.cart.items.filter((i) => i.id !== itemId),
              }
            : null,
        })),

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          cart: state.cart
            ? {
                ...state.cart,
                items: state.cart.items.map((i) =>
                  i.id === itemId ? { ...i, quantity } : i
                ),
              }
            : null,
        }));
      },

      clearCart: () =>
        set((state) => ({
          cart: state.cart ? { ...state.cart, items: [] } : null,
        })),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      itemCount: () =>
        get().cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0,

      subtotal: () =>
        get().cart?.items.reduce(
          (sum, i) => sum + i.unitPrice * i.quantity,
          0
        ) ?? 0,
    }),
    { name: "fastfo-cart", skipHydration: true }
  )
);
