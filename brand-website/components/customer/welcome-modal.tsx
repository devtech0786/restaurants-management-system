"use client";

import { useState } from "react";
import {
  MapPin, Clock, ChevronRight, ArrowLeft,
  Navigation, Bike, CheckCircle2, X, Search,
} from "lucide-react";
import type { Branch, Tenant } from "@/types";
import { cn } from "@/lib/utils";

const CITIES = [
  { name: "Lahore",     emoji: "🏙️", available: true  },
  { name: "Karachi",    emoji: "🌊", available: false },
  { name: "Islamabad",  emoji: "🏛️", available: false },
  { name: "Rawalpindi", emoji: "🏡", available: false },
  { name: "Faisalabad", emoji: "🏭", available: false },
  { name: "Multan",     emoji: "🌆", available: false },
];

interface WelcomeModalProps {
  tenant:   Tenant;
  branches: Branch[];
  onSelect: (branch: Branch) => void;
  onSkip:   () => void;
}

export function WelcomeModal({ tenant, branches, onSelect, onSkip }: WelcomeModalProps) {
  const [step,          setStep]         = useState<1 | 2>(1);
  const [selectedCity,  setSelectedCity] = useState<string | null>(null);
  const [searchQuery,   setSearchQuery]  = useState("");
  const [confirming,    setConfirming]   = useState<string | null>(null);

  const cityBranches = branches.filter((b) =>
    selectedCity ? b.city === selectedCity : true,
  );

  const filtered = searchQuery.trim()
    ? cityBranches.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.address.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : cityBranches;

  const handleCityPick = (city: typeof CITIES[number]) => {
    if (!city.available) return;
    setSelectedCity(city.name);
    setStep(2);
  };

  const handleBranchPick = (branch: Branch) => {
    if (!branch.isOpen) return;
    setConfirming(branch.id);
    setTimeout(() => {
      onSelect(branch);
    }, 500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onSkip}
      />

      {/* Modal card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-bounce-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="relative bg-brand-500 px-6 pt-6 pb-8 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/10" />

            {/* Close */}
            <button
              onClick={onSkip}
              className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10"
              aria-label="Skip"
            >
              <X size={15} />
            </button>

            {/* Tenant brand */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                {tenant.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tenant.logoUrl} alt={tenant.name} className="size-10 rounded-xl object-cover" />
                ) : (
                  <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl select-none">
                    🍔
                  </div>
                )}
                <span className="text-lg font-black text-white font-heading">{tenant.name}</span>
              </div>

              <h2 className="text-2xl font-black text-white leading-tight mb-1">
                {step === 1 ? "Where are we\ndelivering?" : `Branches in ${selectedCity}`}
              </h2>
              <p className="text-white/75 text-sm">
                {step === 1
                  ? "Choose your city to find the nearest branch"
                  : "Pick the location closest to you"}
              </p>
            </div>

            {/* Step dots */}
            <div className="relative z-10 flex items-center gap-2 mt-4">
              <div className={cn("h-1.5 rounded-full transition-all duration-300", step === 1 ? "w-6 bg-white" : "w-2 bg-white/50")} />
              <div className={cn("h-1.5 rounded-full transition-all duration-300", step === 2 ? "w-6 bg-white" : "w-2 bg-white/30")} />
              <span className="ml-1 text-white/50 text-[11px] font-medium">Step {step} of 2</span>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="max-h-[50vh] overflow-y-auto">

            {/* Step 1 — City grid */}
            {step === 1 && (
              <div className="p-5 grid grid-cols-2 gap-3">
                {CITIES.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleCityPick(city)}
                    disabled={!city.available}
                    className={cn(
                      "group relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all",
                      city.available
                        ? "border-gray-100 bg-gray-50 hover:border-brand-400 hover:bg-brand-50 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                        : "border-gray-100 bg-gray-50 opacity-45 cursor-not-allowed",
                    )}
                  >
                    <span className="text-2xl flex-shrink-0">{city.emoji}</span>
                    <div className="min-w-0">
                      <p className={cn(
                        "text-sm font-bold leading-tight transition-colors",
                        city.available
                          ? "text-gray-800 group-hover:text-brand-700"
                          : "text-gray-500",
                      )}>
                        {city.name}
                      </p>
                      <p className="text-[10px] mt-0.5 text-gray-400">
                        {city.available
                          ? `${branches.filter((b) => b.city === city.name).length} branch${branches.filter((b) => b.city === city.name).length !== 1 ? "es" : ""}`
                          : "Coming soon"}
                      </p>
                    </div>
                    {city.available && (
                      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-brand-400 transition-colors" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2 — Branch list */}
            {step === 2 && (
              <div className="p-5 space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search branch or area…"
                    className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Use location */}
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors text-sm font-semibold">
                  <div className="size-7 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Navigation size={13} className="text-white" />
                  </div>
                  Detect my location automatically
                </button>

                {filtered.length === 0 && (
                  <div className="py-8 text-center text-gray-400">
                    <p className="text-2xl mb-2">😕</p>
                    <p className="text-sm">No branches found</p>
                  </div>
                )}

                {filtered.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => handleBranchPick(branch)}
                    disabled={!branch.isOpen || !!confirming}
                    className={cn(
                      "group w-full text-left rounded-2xl border-2 p-4 transition-all",
                      branch.isOpen && !confirming
                        ? "border-gray-100 bg-white hover:border-brand-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                        : "border-gray-100 bg-white opacity-50 cursor-not-allowed",
                      confirming === branch.id && "border-brand-500 bg-brand-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={cn(
                            "font-bold text-sm leading-tight transition-colors",
                            confirming === branch.id
                              ? "text-brand-700"
                              : "text-gray-900 group-hover:text-brand-700",
                          )}>
                            {branch.name}
                          </p>
                          {confirming === branch.id && (
                            <CheckCircle2 size={14} className="text-brand-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                          <MapPin size={10} className="flex-shrink-0" />
                          {branch.address}, {branch.city}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {branch.estimatedDeliveryTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Bike size={10} />
                            Delivery available
                          </span>
                        </div>
                      </div>

                      <span className={cn(
                        "flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full",
                        branch.isOpen
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600",
                      )}>
                        {branch.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            {step === 2 ? (
              <button
                onClick={() => { setStep(1); setSelectedCity(null); setSearchQuery(""); }}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={14} />
                Change city
              </button>
            ) : (
              <p className="text-xs text-gray-400">
                {branches.length} branch{branches.length !== 1 ? "es" : ""} across Pakistan
              </p>
            )}

            <button
              onClick={onSkip}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
