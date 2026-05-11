import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

type AuthStep = "idle" | "phone" | "otp" | "profile";

interface AuthStore {
  user: User | null;
  phone: string;
  step: AuthStep;
  isModalOpen: boolean;

  setUser: (user: User | null) => void;
  setPhone: (phone: string) => void;
  setStep: (step: AuthStep) => void;
  openModal: () => void;
  closeModal: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      phone: "",
      step: "idle",
      isModalOpen: false,

      setUser:     (user)  => set({ user, isModalOpen: false, step: "idle" }),
      setPhone:    (phone) => set({ phone }),
      setStep:     (step)  => set({ step }),
      openModal:   ()      => set({ isModalOpen: true, step: "phone" }),
      closeModal:  ()      => set({ isModalOpen: false, step: "idle", phone: "" }),
      logout:      ()      => set({ user: null }),
    }),
    {
      name: "fastfo-auth",
      partialize: (s) => ({ user: s.user }), // only persist the user object
    }
  )
);
