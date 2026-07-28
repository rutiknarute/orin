import {
  getActivity,
  getEvidence,
  getProduct,
  getProducts,
} from "@/lib/data/catalog";
import type { ActivityEvent, EvidenceDocument, Product } from "@/lib/types";

export interface ProductRepository {
  list(): Promise<Product[]>;
  get(id: string): Promise<Product | undefined>;
  listEvidence(productId?: string): Promise<EvidenceDocument[]>;
  listActivity(): Promise<ActivityEvent[]>;
}

/**
 * Supabase-backed product data. Reads go through `lib/data/catalog.ts`, which
 * keeps one warm copy of the catalog per worker isolate and falls back to the
 * bundled snapshot when the database is unreachable.
 */
export const productRepository: ProductRepository = {
  list: getProducts,
  get: getProduct,
  // The evidence inbox is workspace-wide today. The parameter is kept so this
  // seam can narrow to a single product without changing call sites.
  listEvidence: () => getEvidence(),
  listActivity: getActivity,
};
