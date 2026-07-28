import type { Metadata } from "next";
import { DocumentLab } from "@/components/workspace/document-lab";
import { productRepository } from "@/lib/data/product-repository";

export const metadata: Metadata = { title: "Evidence lab" };

export default async function DocumentsPage() {
  const evidence = await productRepository.listEvidence();
  return <DocumentLab evidence={evidence} />;
}
