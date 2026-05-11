"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuApi } from "@/lib/api/menu";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { MenuItem } from "@/types";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  imageUrl: z.string().url().optional().or(z.literal("")),
  preparationTime: z.coerce.number().min(1),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface MenuFormProps {
  item?: MenuItem;
  categoryId: string;
  onSuccess?: () => void;
}

export function MenuItemForm({ item, categoryId, onSuccess }: MenuFormProps) {
  const qc = useQueryClient();
  const isEdit = !!item;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl ?? "",
          preparationTime: item.preparationTime,
          isAvailable: item.isAvailable,
          isFeatured: item.isFeatured,
        }
      : { isAvailable: true, isFeatured: false, preparationTime: 15 },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit
        ? menuApi.updateItem(item.id, values)
        : menuApi.createItem({ ...values, categoryId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menu"] });
      toast.success(isEdit ? "Item updated" : "Item created");
      onSuccess?.();
    },
    onError: () => toast.error("Failed to save item"),
  });

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="p-5 space-y-4">
      <Input label="Name" {...register("name")} error={errors.name?.message} />
      <Textarea label="Description" {...register("description")} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Price (PKR)" type="number" {...register("price")} error={errors.price?.message} />
        <Input label="Prep time (min)" type="number" {...register("preparationTime")} />
      </div>
      <Input label="Image URL" placeholder="https://..." {...register("imageUrl")} error={errors.imageUrl?.message} />
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" {...register("isAvailable")} className="accent-brand-500" />
          Available
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" {...register("isFeatured")} className="accent-brand-500" />
          Featured
        </label>
      </div>
      <Button type="submit" fullWidth loading={isPending}>
        {isEdit ? "Save changes" : "Add item"}
      </Button>
    </form>
  );
}
