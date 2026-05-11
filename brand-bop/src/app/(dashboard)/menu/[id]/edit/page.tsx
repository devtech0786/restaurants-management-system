import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import MenuItemForm from "@/components/menu/MenuItemForm";
import { MOCK_MENU_ITEMS, MOCK_CATEGORIES } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Edit Menu Item" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMenuItemPage({ params }: Props) {
  const { id } = await params;
  const item = MOCK_MENU_ITEMS.find((i) => i.id === id);
  if (!item) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <PageHeader
        title={`Edit: ${item.name}`}
        description="Update this menu item's details, pricing, and availability."
        breadcrumbs={[
          { label: "Menu",  href: "/menu" },
          { label: item.name },
          { label: "Edit" },
        ]}
      />
      <MenuItemForm categories={MOCK_CATEGORIES} initialData={item} mode="edit" />
    </div>
  );
}
