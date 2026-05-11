"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

const brandingSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  coverUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(200).optional(),
});

type BrandingValues = z.infer<typeof brandingSchema>;

export default function AdminSettingsPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BrandingValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: { primaryColor: "#f97316" },
  });

  const primaryColor = watch("primaryColor");

  const { mutate, isPending } = useMutation({
    mutationFn: adminApi.updateBranding,
    onSuccess: () => toast.success("Branding updated"),
    onError: () => toast.error("Failed to update branding"),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Branding */}
      <Card>
        <h2 className="font-semibold text-lg mb-4">Branding</h2>
        <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register("primaryColor")}
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
              />
              <Input
                {...register("primaryColor")}
                placeholder="#f97316"
                error={errors.primaryColor?.message}
                className="max-w-[140px]"
              />
              <div
                className="w-10 h-10 rounded-lg border border-gray-200"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
          </div>

          <Input
            label="Logo URL"
            placeholder="https://..."
            {...register("logoUrl")}
            error={errors.logoUrl?.message}
          />

          <Input
            label="Cover Image URL"
            placeholder="https://..."
            {...register("coverUrl")}
            error={errors.coverUrl?.message}
          />

          <Input
            label="Description"
            placeholder="Brief description of your restaurant..."
            {...register("description")}
          />

          <Button type="submit" loading={isPending}>
            Save branding
          </Button>
        </form>
      </Card>

      {/* Danger zone */}
      <Card>
        <h2 className="font-semibold text-lg text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <Button variant="danger" onClick={() => toast.error("Contact support to delete account")}>
          Delete Account
        </Button>
      </Card>
    </div>
  );
}
