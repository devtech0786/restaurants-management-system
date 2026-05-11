import Link from "next/link";
import {
  Instagram, Facebook, Twitter, Youtube,
  MapPin, Phone, Clock, ChevronRight, Flame,
} from "lucide-react";

interface CustomerFooterProps {
  tenantSlug: string;
}

const QUICK_LINKS = [
  { label: "Home",      href: (s: string) => `/${s}`          },
  { label: "My Orders", href: (s: string) => `/${s}/orders`   },
  { label: "Profile",   href: (s: string) => `/${s}/profile`  },
  { label: "Cart",      href: (s: string) => `/${s}/cart`     },
];

const HELP_LINKS = [
  "Track your order",
  "FAQs",
  "Contact us",
  "Privacy Policy",
  "Terms & Conditions",
];

const SOCIALS = [
  { Icon: Facebook,  label: "Facebook",  color: "hover:bg-blue-600"  },
  { Icon: Instagram, label: "Instagram", color: "hover:bg-pink-600"  },
  { Icon: Twitter,   label: "Twitter",   color: "hover:bg-sky-500"   },
  { Icon: Youtube,   label: "YouTube",   color: "hover:bg-red-600"   },
];

export function CustomerFooter({ tenantSlug }: CustomerFooterProps) {
  return (
    <footer className="hidden lg:block bg-[#0f0f0f] text-gray-400 mt-16">

      {/* ── Top accent bar ── */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-600 via-brand-500 to-orange-400" />

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-8 pt-14 pb-10">
        <div className="grid grid-cols-12 gap-10">

          {/* ── Brand column (4 cols) ── */}
          <div className="col-span-4 space-y-5">
            {/* Logo mark */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Flame size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-xl font-heading leading-none">Burger King</p>
                <p className="text-[11px] text-gray-500 mt-0.5 tracking-wide">Flame-grilled since 1953</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Have it your way — bold, flame-grilled flavour delivered hot and fast straight to your door.
            </p>

            {/* Social icons */}
            <div>
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
                Follow us
              </p>
              <div className="flex gap-2.5">
                {SOCIALS.map(({ Icon, label, color }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className={`w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center
                      transition-all duration-200 ${color} hover:border-transparent hover:text-white hover:scale-110`}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Quick links (2 cols) ── */}
          <div className="col-span-2">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-5">Navigate</p>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href(tenantSlug)}
                    className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronRight
                      size={12}
                      className="text-brand-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Help (2 cols) ── */}
          <div className="col-span-2">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-5">Support</p>
            <ul className="space-y-3">
              {HELP_LINKS.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronRight
                      size={12}
                      className="text-brand-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
                    />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact & hours (4 cols) ── */}
          <div className="col-span-4">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-5">Find us</p>

            <div className="space-y-4">
              {/* Featured branch */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] space-y-3">
                <p className="text-xs font-bold text-white">DHA Phase 5 — Lahore</p>

                <div className="flex items-start gap-2.5 text-xs text-gray-400">
                  <MapPin size={13} className="text-brand-500 mt-0.5 shrink-0" />
                  <span>26-Y Commercial Area, DHA Phase 5, Lahore</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-gray-400">
                  <Phone size={13} className="text-brand-500 shrink-0" />
                  <span>+92-42-111-800-800</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-gray-400">
                  <Clock size={13} className="text-brand-500 shrink-0" />
                  <span>Sun – Thu 10:00 AM – 2:00 AM &nbsp;·&nbsp; Fri – Sat until 3:00 AM</span>
                </div>
              </div>

              {/* Open badge */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs text-emerald-400 font-semibold">Open now — accepting orders</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between text-xs text-gray-600">
        <p>© {new Date().getFullYear()} <span className="text-gray-400">Burger King Pakistan.</span> All rights reserved.</p>
        <p>
          Crafted by{" "}
          <span className="text-brand-500 font-semibold">Fastfo</span>
        </p>
      </div>

    </footer>
  );
}
