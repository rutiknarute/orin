import type { Metadata } from "next";
import { ProductsClient } from "@/components/workspace/products-client";
import { demoProductRepository } from "@/lib/data/product-repository";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const products = await demoProductRepository.list();
  return <ProductsClient products={products} />;
}
