import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import FranchiseTable from "@/components/settings/FranchiseTable";
import { MOCK_FRANCHISES } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Franchises" };

export default function FranchisesPage() {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <PageHeader
        title="Franchise Management"
        description="View and manage all restaurant franchise locations and branches."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Franchises" },
        ]}
      />
      <FranchiseTable franchises={MOCK_FRANCHISES} />
    </div>
  );
}
