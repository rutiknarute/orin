import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Dashboard } from "@/components/workspace/dashboard";
import { getCatalog } from "@/lib/data/catalog";

export const metadata: Metadata = { title: "Overview" };

export default async function WorkspacePage() {
  const { products, activity, evidence } = await getCatalog();
  const product = products[0];
  if (!product) notFound();

  return <Dashboard product={product} activity={activity} evidence={evidence} />;
}
