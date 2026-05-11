"use client";

import { Search, Bell } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [search, setSearch] = useState("");

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-neutral-100">
      {/* Search */}
      <div className="relative max-w-xs w-full">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          aria-label="Global search"
          className="w-full h-9 pl-8 pr-3 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="relative size-9 flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-red-500" aria-hidden />
        </button>
        <div className="size-8 rounded-full bg-brand-100 flex items-center justify-center cursor-pointer hover:bg-brand-200 transition-colors">
          <span className="text-xs font-semibold text-brand-700">JD</span>
        </div>
      </div>
    </header>
  );
}
