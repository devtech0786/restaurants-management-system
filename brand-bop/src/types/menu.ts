export type MenuItemStatus = "available" | "unavailable" | "out_of_stock";

export type MenuTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "spicy"
  | "popular"
  | "new"
  | "seasonal"
  | "chef-special";

export type Allergen =
  | "nuts"
  | "dairy"
  | "gluten"
  | "egg"
  | "shellfish"
  | "soy"
  | "fish"
  | "sesame";

export interface MenuVariant {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  sku: string;
  name: string;
  description: string;
  basePrice: number;
  variants: MenuVariant[];
  imageUrl: string;
  gallery: string[];
  status: MenuItemStatus;
  tags: MenuTag[];
  allergens: Allergen[];
  prepTime: number;
  calories?: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  displayOrder: number;
  status: "active" | "inactive";
  itemCount?: number;
}

export type MenuItemDraft = Omit<MenuItem, "id" | "createdAt" | "updatedAt">;
