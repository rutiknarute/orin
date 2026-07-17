import type { Metadata } from "next";
import { DocumentLab } from "@/components/workspace/document-lab";

export const metadata: Metadata = { title: "Evidence lab" };

export default function DocumentsPage() {
  return <DocumentLab />;
}
