"use client";

import { MapPin, Clock, Navigation } from "lucide-react";
import type { Branch } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/lib/hooks/use-geolocation";

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranchId?: string;
  onSelect: (branch: Branch) => void;
  isOpen: boolean;
  onClose: () => void;
}

function getBranchStatus(branch: Branch): { label: string; open: boolean } {
  return branch.isOpen
    ? { label: "Open now", open: true }
    : { label: "Closed", open: false };
}

export function BranchSelector({
  branches,
  selectedBranchId,
  onSelect,
  isOpen,
  onClose,
}: BranchSelectorProps) {
  const { lat, lng, loading, request } = useGeolocation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select your location">
      <div className="p-4 space-y-3">
        <Button
          variant="outline"
          fullWidth
          onClick={request}
          loading={loading}
          className="mb-2"
        >
          <Navigation size={16} />
          Use my location
        </Button>

        {branches.map((branch) => {
          const status = getBranchStatus(branch);
          const isSelected = branch.id === selectedBranchId;
          return (
            <button
              key={branch.id}
              onClick={() => { onSelect(branch); onClose(); }}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm">{branch.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {branch.address}, {branch.city}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock size={11} /> {branch.estimatedDeliveryTime} min
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                    status.open
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {status.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
