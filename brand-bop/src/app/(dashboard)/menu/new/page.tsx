import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import MenuItemForm from "@/components/menu/MenuItemForm";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Add Menu Item" };

export default function NewMenuItemPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <PageHeader
        title="Add Menu Item"
        description="Create a new item and add it to your restaurant menu."
        breadcrumbs={[
          { label: "Menu",  href: "/menu" },
          { label: "Add Item" },
        ]}
      />
      <MenuItemForm categories={MOCK_CATEGORIES} mode="create" />
    </div>
  );
}
