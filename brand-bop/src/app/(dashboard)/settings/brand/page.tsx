import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import BrandConfigForm from "@/components/settings/BrandConfigForm";
import { MOCK_BRAND } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Brand Configuration" };

export default function BrandPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Brand Configuration"
        description="Manage your restaurant brand's identity, visual style, and contact information."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Brand Configuration" },
        ]}
      />
      <BrandConfigForm initialData={MOCK_BRAND} />
    </div>
  );
}
