import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import CategoryManager from "@/components/menu/CategoryManager";
import { MOCK_CATEGORIES, MOCK_MENU_ITEMS } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Menu Categories" };

export default function CategoriesPage() {
  const withCounts = MOCK_CATEGORIES.map((cat) => ({
    ...cat,
    itemCount: MOCK_MENU_ITEMS.filter((i) => i.categoryId === cat.id).length,
  }));

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title="Menu Categories"
        description="Organise your menu items into categories. Drag to reorder."
        breadcrumbs={[
          { label: "Menu", href: "/menu" },
          { label: "Categories" },
        ]}
      />
      <CategoryManager initialCategories={withCounts} />
    </div>
  );
}
