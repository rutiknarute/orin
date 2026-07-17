import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/workspace/product-detail-client";
import { demoProductRepository } from "@/lib/data/product-repository";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await demoProductRepository.get(id);
  return { title: product?.name ?? "Product" };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, evidence] = await Promise.all([
    demoProductRepository.get(id),
    demoProductRepository.listEvidence(id),
  ]);
  if (!product) notFound();
  return <ProductDetailClient product={product} evidence={evidence} />;
}
