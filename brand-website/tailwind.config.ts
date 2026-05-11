import type { Config } from "tailwindcss";

/* ══════════════════════════════════════════════════════════════════════════
   SINGLE SOURCE OF TRUTH — edit brand colors HERE only.

   The Tailwind plugin at the bottom auto-injects matching CSS vars into
   :root so that .gradient-brand, shadow-brand, and the runtime JS tenant
   override  (document.documentElement.style.setProperty)  all stay in sync
   automatically.  You never need to touch globals.css for color changes.
   ══════════════════════════════════════════════════════════════════════ */

const brand = {
  50:  "#fdf4f3",
  100: "#fbe8e6",
  200: "#f7d0cb",
  300: "#f1b1a8",
  400: "#e88a7c",
  500: "#D96C4A",   // ← PRIMARY  — change this one to rebrand the whole site
  600: "#bf5839",
  700: "#9f472f",
  800: "#813b29",
  900: "#6a3225",
} as const;

const accent = {
  400: "#FFDA2D",
  500: "#FFD60A",
  600: "#E6C000",
} as const;

const orangeGradient = "#FF6B35"; // right-side colour used in .gradient-brand

/* Derive box-shadow colour from the primary brand hex */
function brandShadow(hex: string, alpha = 0.28): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `0 4px 24px rgba(${r},${g},${b},${alpha})`;
}

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: { brand, accent },
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
        brand: brandShadow(brand[500]),
        card:  "0 2px 16px rgba(0,0,0,0.06)",
      },
    },
  },

  /* ── Plugin: auto-generate :root CSS vars from the palette above ── */
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function ({ addBase }: any) {
      const vars: Record<string, string> = {};
      (Object.entries(brand)  as [string, string][]).forEach(([k, v]) => { vars[`--brand-${k}`]  = v; });
      (Object.entries(accent) as [string, string][]).forEach(([k, v]) => { vars[`--accent-${k}`] = v; });
      vars["--orange-500"] = orangeGradient;
      addBase({ ":root": vars });
    },
  ],
};

export default config;
