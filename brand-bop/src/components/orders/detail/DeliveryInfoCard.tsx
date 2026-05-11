import {
  MapPin, Users, Clock, Truck, ShoppingBag,
  UtensilsCrossed, ExternalLink,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import type { Order } from "@/types/order";

interface DeliveryInfoCardProps {
  order: Pick<
    Order,
    | "type"
    | "tableNumber"
    | "covers"
    | "deliveryAddress"
    | "estimatedDeliveryAt"
    | "assignedDriver"
    | "pickupTime"
    | "estimatedReadyAt"
    | "franchiseName"
  >;
}

function fmt(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function fmtFull(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function DeliveryInfoCard({ order }: DeliveryInfoCardProps) {
  const titleMap = {
    "dine-in":  "Table Details",
    delivery:   "Delivery Details",
    takeaway:   "Pickup Details",
  };

  return (
    <Card>
      <CardHeader
        title={titleMap[order.type]}
        action={
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            {order.type === "dine-in"  && <UtensilsCrossed size={13} />}
            {order.type === "delivery" && <Truck size={13} />}
            {order.type === "takeaway" && <ShoppingBag size={13} />}
            <span className="capitalize">{order.type}</span>
          </div>
        }
      />

      <div className="space-y-4">
        {/* Dine-in */}
        {order.type === "dine-in" && (
          <>
            <InfoRow icon={<UtensilsCrossed size={13} />} label="Table" value={order.tableNumber ?? "—"} />
            {order.covers && (
              <InfoRow icon={<Users size={13} />} label="Covers" value={`${order.covers} guest${order.covers > 1 ? "s" : ""}`} />
            )}
            <InfoRow icon={<MapPin size={13} />} label="Branch" value={order.franchiseName} />
          </>
        )}

        {/* Delivery */}
        {order.type === "delivery" && (
          <>
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <MapPin size={11} /> Delivery Address
              </p>
              <p className="text-sm font-medium text-neutral-800">{order.deliveryAddress}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress ?? "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline mt-1"
              >
                View on map <ExternalLink size={10} />
              </a>
            </div>
            {order.assignedDriver && (
              <InfoRow icon={<Truck size={13} />} label="Driver" value={order.assignedDriver} />
            )}
            {order.estimatedDeliveryAt && (
              <InfoRow
                icon={<Clock size={13} />}
                label="Est. Delivery"
                value={fmtFull(order.estimatedDeliveryAt) ?? "—"}
                highlight
              />
            )}
          </>
        )}

        {/* Takeaway */}
        {order.type === "takeaway" && (
          <>
            <InfoRow icon={<MapPin size={13} />} label="Pick up from" value={order.franchiseName} />
            {order.pickupTime && (
              <InfoRow
                icon={<Clock size={13} />}
                label="Pickup Time"
                value={fmtFull(order.pickupTime) ?? "—"}
                highlight
              />
            )}
            {order.estimatedReadyAt && (
              <InfoRow
                icon={<Clock size={13} />}
                label="Ready at"
                value={fmt(order.estimatedReadyAt) ?? "—"}
              />
            )}
          </>
        )}
      </div>
    </Card>
  );
}

function InfoRow({
  icon, label, value, highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-neutral-400 flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-neutral-400 uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-medium break-words ${highlight ? "text-brand-700" : "text-neutral-800"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
