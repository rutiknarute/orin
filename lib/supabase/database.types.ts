/**
 * Shape of the Orin Supabase schema.
 *
 * Regenerate after a migration with:
 *   npx supabase gen types typescript --project-id <ref> --schema public
 */

interface ActivityEventRow {
  id: string;
  title: string;
  detail: string;
  time_label: string;
  tone: string;
  position: number;
}

interface AppUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface EvidenceDocumentRow {
  id: string;
  title: string;
  type: string;
  supplier: string;
  received: string;
  confidence: number;
  status: string;
  fields: number;
  position: number;
}

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  category: string;
  season: string;
  color: string;
  completion: number;
  status: string;
  suppliers: number;
  evidence: number;
  open_items: number;
  next_action: string;
  owner: string;
  updated_label: string;
  material: string;
  recycled_content: number;
  position: number;
}

interface SupplyChainNodeRow {
  id: string;
  product_id: string;
  stage: string;
  company: string;
  location: string;
  documents: number;
  status: string;
  note: string;
  position: number;
}

type ReadOnlyTable<Row> = {
  Row: Row;
  Insert: Row;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      activity_events: ReadOnlyTable<ActivityEventRow>;
      app_users: ReadOnlyTable<AppUserRow>;
      evidence_documents: ReadOnlyTable<EvidenceDocumentRow>;
      products: ReadOnlyTable<ProductRow>;
      supply_chain_nodes: ReadOnlyTable<SupplyChainNodeRow>;
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
