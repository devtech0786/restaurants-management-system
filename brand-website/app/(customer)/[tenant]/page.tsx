import { Metadata } from "next";
import TenantHomePage from "./home-client";

export async function generateMetadata({
  params,
}: {
  params: { tenant: string };
}): Promise<Metadata> {
  return {
    title: params.tenant,
    description: `Order online from ${params.tenant}`,
  };
}

export default function TenantPage() {
  return <TenantHomePage />;
}
