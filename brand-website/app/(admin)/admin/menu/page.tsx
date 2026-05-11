"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuApi } from "@/lib/api/menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { MenuItemForm } from "@/components/admin/menu-form";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import type { MenuItem, Category } from "@/types";
import toast from "react-hot-toast";

export default function AdminMenuPage() {
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [addToCategoryId, setAddToCategoryId] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: () => menuApi.getCategories("", ""),
  });

  const { mutate: deleteItem } = useMutation({
    mutationFn: menuApi.deleteItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Item deleted");
    },
  });

  const { mutate: toggleAvailability } = useMutation({
    mutationFn: ({ id, v }: { id: string; v: boolean }) =>
      menuApi.toggleAvailability(id, v),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menu"] }),
  });

  const displayedCategories = selectedCategory
    ? categories.filter((c) => c.id === selectedCategory)
    : categories;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Categories + items */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="space-y-3">
              <Skeleton className="h-5 w-32" />
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-12 w-full rounded-xl" />
              ))}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {displayedCategories.map((cat) => (
            <Card key={cat.id}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">{cat.name}</h2>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setAddToCategoryId(cat.id)}
                >
                  <Plus size={14} /> Add item
                </Button>
              </div>

              {cat.items.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No items in this category
                </p>
              ) : (
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">{item.name}</p>
                          {item.isFeatured && <Badge variant="warning">Popular</Badge>}
                          {!item.isAvailable && <Badge variant="danger">Off</Badge>}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() =>
                            toggleAvailability({ id: item.id, v: !item.isAvailable })
                          }
                          className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Toggle availability"
                        >
                          {item.isAvailable ? (
                            <ToggleRight size={16} className="text-green-600" />
                          ) : (
                            <ToggleLeft size={16} className="text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditItem(item)}
                          className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Pencil size={14} className="text-gray-500" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${item.name}"?`)) deleteItem(item.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        title="Edit item"
      >
        {editItem && (
          <MenuItemForm
            item={editItem}
            categoryId={editItem.categoryId}
            onSuccess={() => setEditItem(null)}
          />
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={!!addToCategoryId}
        onClose={() => setAddToCategoryId(null)}
        title="Add new item"
      >
        {addToCategoryId && (
          <MenuItemForm
            categoryId={addToCategoryId}
            onSuccess={() => setAddToCategoryId(null)}
          />
        )}
      </Modal>
    </div>
  );
}
