import type { Config } from "tailwindcss";

/* ============================================================
   BRAND PALETTE — single source of truth
   Change brand[500] (and its shades) here to rebrand the
   entire site. All bg-brand-*, text-brand-*, border-brand-*,
   ring-brand-* classes and the shadow-brand box-shadow will
   update automatically on the next build / HMR refresh.

   Also update the matching CSS vars in globals.css so the
   .gradient-brand utility and runtime per-tenant JS override
   (layout.tsx) stay in sync.
   ============================================================ */
const brand = {
  50:  "#fff1f2",
  100: "#ffe4e6",
  200: "#fecdd3",
  300: "#fda4af",
  400: "#fb7185",
  500: "#E63946",   // ← PRIMARY — change this one value to rebrand the whole site
  600: "#c9303c",
  700: "#a82530",
  800: "#8c1d25",
  900: "#741820",
} as const;

const accent = {
  400: "#FFDA2D",
  500: "#FFD60A",
  600: "#E6C000",
} as const;

/* Derive rgba shadow from the primary brand hex */
function brandShadow(hex: string, alpha = 0.28): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `0 4px 24px rgba(${r},${g},${b},${alpha})`;
}

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand,
        accent,
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        sans:    ["var(--font-sans)",    "system-ui", "sans-serif"],
      },
      animation: {
        "slide-up":   "slideUp 0.3s ease-out",
        "fade-in":    "fadeIn 0.2s ease-out",
        "bounce-in":  "bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "spin-slow":  "spin 3s linear infinite",
      },
      keyframes: {
        slideUp:  { "0%": { transform: "translateY(100%)", opacity: "0" }, "100%": { transform: "translateY(0)",   opacity: "1" } },
        fadeIn:   { "0%": { opacity: "0" },                                "100%": { opacity: "1" }                              },
        bounceIn: { "0%": { transform: "scale(0.3)",       opacity: "0" }, "100%": { transform: "scale(1)",        opacity: "1" } },
      },
      boxShadow: {
        // Auto-derived from brand[500] — stays in sync when you change the palette above
        brand: brandShadow(brand[500]),
        card:  "0 2px 16px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
