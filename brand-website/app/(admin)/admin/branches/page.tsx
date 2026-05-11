"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adminApi } from "@/lib/api/admin";
import { tenantApi } from "@/lib/api/tenant";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Branch } from "@/types";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  phone: z.string().min(10),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  deliveryRadius: z.coerce.number().min(1),
  estimatedDeliveryTime: z.coerce.number().min(1),
});

type FormValues = z.infer<typeof schema>;

function BranchForm({
  branch,
  tenantId,
  onSuccess,
}: {
  branch?: Branch;
  tenantId: string;
  onSuccess: () => void;
}) {
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: branch,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      branch
        ? adminApi.updateBranch(branch.id, values)
        : adminApi.createBranch({ ...values, tenantId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
      toast.success(branch ? "Branch updated" : "Branch created");
      onSuccess();
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="p-5 space-y-3">
      <Input label="Branch name" {...register("name")} error={errors.name?.message} />
      <Input label="Address" {...register("address")} />
      <Input label="City" {...register("city")} />
      <Input label="Phone" {...register("phone")} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Latitude" type="number" step="any" {...register("lat")} />
        <Input label="Longitude" type="number" step="any" {...register("lng")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Delivery radius (km)" type="number" {...register("deliveryRadius")} />
        <Input label="Est. delivery time (min)" type="number" {...register("estimatedDeliveryTime")} />
      </div>
      <Button type="submit" fullWidth loading={isPending}>
        {branch ? "Save changes" : "Create branch"}
      </Button>
    </form>
  );
}

const MOCK_TENANT_ID = "tenant_1";

export default function AdminBranchesPage() {
  const qc = useQueryClient();
  const [modalBranch, setModalBranch] = useState<Branch | "new" | null>(null);

  const { data: branches = [], isLoading } = useQuery({
    queryKey: ["branches", MOCK_TENANT_ID],
    queryFn: () => tenantApi.getBranches(MOCK_TENANT_ID),
  });

  const { mutate: deleteBranch } = useMutation({
    mutationFn: adminApi.deleteBranch,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch deleted");
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Branches</h1>
        <Button onClick={() => setModalBranch("new")}>
          <Plus size={16} /> Add branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <Card key={branch.id}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">{branch.name}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {branch.address}, {branch.city}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock size={12} /> ~{branch.estimatedDeliveryTime} min delivery
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{branch.phone}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={branch.isOpen ? "success" : "danger"}>
                  {branch.isOpen ? "Open" : "Closed"}
                </Badge>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setModalBranch(branch)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={14} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${branch.name}"?`)) deleteBranch(branch.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={!!modalBranch}
        onClose={() => setModalBranch(null)}
        title={modalBranch === "new" ? "New branch" : "Edit branch"}
      >
        <BranchForm
          branch={modalBranch !== "new" ? (modalBranch as Branch) : undefined}
          tenantId={MOCK_TENANT_ID}
          onSuccess={() => setModalBranch(null)}
        />
      </Modal>
    </div>
  );
}
