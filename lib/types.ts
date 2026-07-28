export type ProductStatus =
  | "Passport ready"
  | "In review"
  | "Needs evidence"
  | "At risk";

export type EvidenceStatus = "Verified" | "In review" | "Missing" | "Expired";

export interface SupplyChainNode {
  id: string;
  stage: string;
  company: string;
  location: string;
  documents: number;
  status: EvidenceStatus;
  note: string;
}

export interface EvidenceDocument {
  id: string;
  title: string;
  type: string;
  supplier: string;
  received: string;
  confidence: number;
  status: EvidenceStatus;
  fields: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  season: string;
  color: string;
  completion: number;
  status: ProductStatus;
  suppliers: number;
  evidence: number;
  openItems: number;
  nextAction: string;
  owner: string;
  updatedAt: string;
  material: string;
  recycledContent: number;
  chain: SupplyChainNode[];
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export type ActivityTone = "info" | "success" | "warning" | "danger";

export interface ActivityEvent {
  title: string;
  detail: string;
  time: string;
  tone: ActivityTone;
}

export interface AnalysisResult {
  id: string;
  filename: string;
  documentType: string;
  supplier: string;
  confidence: number;
  fieldsFound: number;
  reviewItems: number;
  extracted: Array<{
    label: string;
    value: string;
    confidence: number;
  }>;
}
