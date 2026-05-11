import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CustomerDetailView from "@/components/customers/detail/CustomerDetailView";
import { MOCK_CUSTOMERS, MOCK_ORDERS } from "@/lib/mock-data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id);
  return { title: customer ? customer.name : "Customer Not Found" };
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id }   = await params;
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id);
  if (!customer) notFound();

  const orders = MOCK_ORDERS.filter(
    (o) => o.customer.name === customer.name,
  );

  return <CustomerDetailView initialCustomer={customer} initialOrders={orders} />;
}
