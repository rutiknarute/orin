import type { Metadata } from "next";
import { ProductsClient } from "@/components/workspace/products-client";
import { productRepository } from "@/lib/data/product-repository";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const products = await productRepository.list();
  return <ProductsClient products={products} />;
}
