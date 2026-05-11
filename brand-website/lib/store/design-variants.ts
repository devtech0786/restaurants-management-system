import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DesignVariant = 1 | 2 | 3 | 4;

interface DesignVariantsStore {
  categoryVariant: DesignVariant;
  cardVariant: DesignVariant;
  configuratorVariant: DesignVariant;
  setCategoryVariant: (v: DesignVariant) => void;
  setCardVariant: (v: DesignVariant) => void;
  setConfiguratorVariant: (v: DesignVariant) => void;
}

export const useDesignVariantsStore = create<DesignVariantsStore>()(
  persist(
    (set) => ({
      categoryVariant: 1,
      cardVariant: 1,
      configuratorVariant: 1,
      setCategoryVariant: (v) => set({ categoryVariant: v }),
      setCardVariant: (v) => set({ cardVariant: v }),
      setConfiguratorVariant: (v) => set({ configuratorVariant: v }),
    }),
    { name: "ff-design-variants" },
  ),
);
