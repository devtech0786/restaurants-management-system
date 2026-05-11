import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import MenuListing from "@/components/menu/MenuListing";
import Button from "@/components/ui/Button";
import { MOCK_MENU_ITEMS, MOCK_CATEGORIES } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Menu" };

export default function MenuPage() {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <PageHeader
        title="Menu Management"
        description="Manage your restaurant's full menu — items, pricing, and availability."
        breadcrumbs={[{ label: "Menu" }]}
        actions={
          <Link href="/menu/categories">
            <Button variant="outline" size="sm" leftIcon={<Tag size={14} />}>
              Manage Categories
            </Button>
          </Link>
        }
      />
      <MenuListing initialItems={MOCK_MENU_ITEMS} categories={MOCK_CATEGORIES} />
    </div>
  );
}
