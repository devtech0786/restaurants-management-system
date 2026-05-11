"use client";

import { useState, useEffect } from "react";
import { useTenant, useBranches } from "@/lib/hooks/use-tenant";
import { useCartStore } from "@/lib/store/cart";
import { CustomerNavbar } from "@/components/customer/navbar";
import { CartDrawer } from "@/components/customer/cart-drawer";
import { BranchSelector } from "@/components/customer/branch-selector";
import { WelcomeModal } from "@/components/customer/welcome-modal";
import { PwaInstallPrompt } from "@/components/customer/pwa-install-prompt";
import { BottomNav } from "@/components/customer/bottom-nav";
import { AuthModal } from "@/components/customer/auth-modal";
import { CustomerFooter } from "@/components/customer/footer";
import { FullPageSpinner } from "@/components/ui/spinner";
import type { Branch } from "@/types";
import { useParams } from "next/navigation";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ tenant: string }>();
  const { data: tenant, isLoading } = useTenant();
  const { data: branches = [] } = useBranches(tenant?.id);
  const [branchOpen,    setBranchOpen]    = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showWelcome,   setShowWelcome]   = useState(false);
  const initCart = useCartStore((s) => s.initCart);

  useEffect(() => {
    if (tenant && selectedBranch) initCart(tenant.id, selectedBranch.id);
  }, [tenant, selectedBranch, initCart]);

  useEffect(() => {
    if (!branches.length) return;
    const storageKey = `welcome_done_${tenant?.id ?? "default"}`;
    const alreadySet = typeof window !== "undefined" && localStorage.getItem(storageKey);
    if (!alreadySet) {
      setShowWelcome(true);
    } else if (!selectedBranch) {
      setSelectedBranch(branches.find((b) => b.isOpen) ?? branches[0] ?? null);
    }
  }, [branches, tenant?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleWelcomeBranchSelect = (branch: Branch) => {
    const storageKey = `welcome_done_${tenant?.id ?? "default"}`;
    localStorage.setItem(storageKey, branch.id);
    setSelectedBranch(branch);
    setShowWelcome(false);
  };

  const handleWelcomeSkip = () => {
    const storageKey = `welcome_done_${tenant?.id ?? "default"}`;
    localStorage.setItem(storageKey, "skipped");
    setSelectedBranch(branches.find((b) => b.isOpen) ?? branches[0] ?? null);
    setShowWelcome(false);
  };

  useEffect(() => {
    if (tenant?.primaryColor) {
      document.documentElement.style.setProperty("--brand-500", tenant.primaryColor);
      document.documentElement.style.setProperty("--brand-600", shadeColor(tenant.primaryColor, -15));
      document.documentElement.style.setProperty("--brand-50",  shadeColor(tenant.primaryColor, 90));
    }
  }, [tenant?.primaryColor]);

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomerNavbar
        onBranchClick={() => setBranchOpen(true)}
        selectedBranchName={selectedBranch?.name}
      />

      {/* pb-20 on mobile for bottom nav; no extra padding on lg */}
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      <CustomerFooter tenantSlug={params.tenant} />

      {/* Bottom nav — mobile only */}
      <div className="lg:hidden">
        <BottomNav tenantSlug={params.tenant} />
      </div>

      <CartDrawer />
      <AuthModal />

      {showWelcome && tenant && (
        <WelcomeModal
          tenant={tenant}
          branches={branches}
          onSelect={handleWelcomeBranchSelect}
          onSkip={handleWelcomeSkip}
        />
      )}

      <BranchSelector
        branches={branches}
        selectedBranchId={selectedBranch?.id}
        onSelect={setSelectedBranch}
        isOpen={branchOpen}
        onClose={() => setBranchOpen(false)}
      />
      <PwaInstallPrompt />
    </div>
  );
}

function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(2.55 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(2.55 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(2.55 * percent)));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
