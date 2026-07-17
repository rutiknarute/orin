import { evidenceDocuments, getProduct, products } from "@/lib/demo-data";

export interface ProductRepository {
  list(): Promise<typeof products>;
  get(id: string): Promise<ReturnType<typeof getProduct>>;
  listEvidence(productId: string): Promise<typeof evidenceDocuments>;
}

/**
 * Demo repository used for the prototype. A MongoProductRepository can replace
 * this adapter without changing the page or API contracts.
 */
export const demoProductRepository: ProductRepository = {
  async list() {
    return products;
  },
  async get(id) {
    return getProduct(id);
  },
  async listEvidence() {
    return evidenceDocuments;
  },
};
