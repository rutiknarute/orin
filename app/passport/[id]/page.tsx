import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PassportView } from "@/app/passport/[id]/passport-view";
import { productRepository } from "@/lib/data/product-repository";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await productRepository.get(id);
  return {
    title: product ? `${product.name} — Digital Product Passport` : "Product passport",
    description: product ? `Evidence-backed product passport for ${product.name}.` : "Orin digital product passport.",
  };
}

export default async function PassportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await productRepository.get(id);
  if (!product) notFound();
  return <PassportView product={product} />;
}
