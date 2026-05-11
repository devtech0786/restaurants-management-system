import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailView from "@/components/orders/detail/OrderDetailView";
import { MOCK_ORDERS } from "@/lib/mock-data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id }  = await params;
  const order   = MOCK_ORDERS.find((o) => o.id === id);
  return {
    title: order ? `Order ${order.orderNumber}` : "Order Not Found",
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order  = MOCK_ORDERS.find((o) => o.id === id);
  if (!order) notFound();

  return <OrderDetailView initialOrder={order} />;
}
