import { getSupabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import { CATALOG_TIMEOUT_MS, CATALOG_TTL_MS } from "@/lib/supabase/config";
import {
  activity as snapshotActivity,
  DEMO_USER,
  evidenceDocuments as snapshotEvidence,
  products as snapshotProducts,
} from "@/lib/demo-data";
import type {
  ActivityEvent,
  ActivityTone,
  DemoUser,
  EvidenceDocument,
  EvidenceStatus,
  Product,
  ProductStatus,
  SupplyChainNode,
} from "@/lib/types";

export interface Catalog {
  products: Product[];
  evidence: EvidenceDocument[];
  activity: ActivityEvent[];
  user: DemoUser;
  /** Where this payload came from — useful for /api/health and debugging. */
  source: "supabase" | "snapshot";
}

type Tables = Database["public"]["Tables"];

/** A product row with its supply chain embedded, as PostgREST returns it. */
type ProductQueryRow = Tables["products"]["Row"] & {
  chain: Tables["supply_chain_nodes"]["Row"][] | null;
};

const PRODUCT_SELECT = "*, chain:supply_chain_nodes(*)";

const PRODUCT_STATUSES = new Set<string>([
  "Passport ready",
  "In review",
  "Needs evidence",
  "At risk",
]);
const EVIDENCE_STATUSES = new Set<string>([
  "Verified",
  "In review",
  "Missing",
  "Expired",
]);
const TONES = new Set<string>(["info", "success", "warning", "danger"]);

function toProductStatus(value: string): ProductStatus {
  return PRODUCT_STATUSES.has(value)
    ? (value as ProductStatus)
    : "Needs evidence";
}

function toEvidenceStatus(value: string): EvidenceStatus {
  return EVIDENCE_STATUSES.has(value) ? (value as EvidenceStatus) : "In review";
}

function toTone(value: string): ActivityTone {
  return TONES.has(value) ? (value as ActivityTone) : "info";
}

const byPosition = (a: { position: number }, b: { position: number }) =>
  a.position - b.position;

/**
 * The catalog is small, static, and shared by every page, so it is fetched
 * once per worker isolate and reused until the TTL expires. Concurrent
 * requests during a miss share a single in-flight promise.
 */
let cached: { catalog: Catalog; expiresAt: number } | undefined;
let inFlight: Promise<Catalog> | undefined;

const snapshot = (): Catalog => ({
  products: snapshotProducts,
  evidence: snapshotEvidence,
  activity: snapshotActivity,
  user: DEMO_USER,
  source: "snapshot",
});

async function fetchCatalog(): Promise<Catalog> {
  const supabase = getSupabase();
  const signal = AbortSignal.timeout(CATALOG_TIMEOUT_MS);

  const [productResult, evidenceResult, activityResult, userResult] =
    await Promise.all([
      supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .order("position")
        .abortSignal(signal)
        .returns<ProductQueryRow[]>(),
      supabase
        .from("evidence_documents")
        .select("*")
        .order("position")
        .abortSignal(signal)
        .returns<Tables["evidence_documents"]["Row"][]>(),
      supabase
        .from("activity_events")
        .select("*")
        .order("position")
        .abortSignal(signal)
        .returns<Tables["activity_events"]["Row"][]>(),
      supabase
        .from("app_users")
        .select("*")
        .eq("email", DEMO_USER.email)
        .abortSignal(signal)
        .returns<Tables["app_users"]["Row"][]>()
        .maybeSingle(),
    ]);

  const failure =
    productResult.error ??
    evidenceResult.error ??
    activityResult.error ??
    userResult.error;
  if (failure) throw new Error(failure.message);
  if (!productResult.data?.length) throw new Error("No products returned");

  const products: Product[] = productResult.data.map((row) => ({
    id: row.id,
    name: row.name,
    sku: row.sku,
    category: row.category,
    season: row.season,
    color: row.color,
    completion: row.completion,
    status: toProductStatus(row.status),
    suppliers: row.suppliers,
    evidence: row.evidence,
    openItems: row.open_items,
    nextAction: row.next_action,
    owner: row.owner,
    updatedAt: row.updated_label,
    material: row.material,
    recycledContent: row.recycled_content,
    chain: [...(row.chain ?? [])].sort(byPosition).map(
      (node): SupplyChainNode => ({
        id: node.id,
        stage: node.stage,
        company: node.company,
        location: node.location,
        documents: node.documents,
        status: toEvidenceStatus(node.status),
        note: node.note,
      }),
    ),
  }));

  const evidence: EvidenceDocument[] = (evidenceResult.data ?? []).map(
    (row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      supplier: row.supplier,
      received: row.received,
      confidence: row.confidence,
      status: toEvidenceStatus(row.status),
      fields: row.fields,
    }),
  );

  const activity: ActivityEvent[] = (activityResult.data ?? []).map((row) => ({
    title: row.title,
    detail: row.detail,
    time: row.time_label,
    tone: toTone(row.tone),
  }));

  const user: DemoUser = userResult.data
    ? {
        id: userResult.data.id,
        name: userResult.data.name,
        email: userResult.data.email,
        role: userResult.data.role,
        initials: userResult.data.initials,
      }
    : DEMO_USER;

  return { products, evidence, activity, user, source: "supabase" };
}

/**
 * Read the whole catalog. Never rejects: if Supabase is unreachable or slow,
 * the bundled snapshot is served so a page render is never blocked on the
 * database.
 */
export async function getCatalog(): Promise<Catalog> {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.catalog;
  if (inFlight) return inFlight;

  inFlight = fetchCatalog()
    .then((catalog) => {
      cached = { catalog, expiresAt: Date.now() + CATALOG_TTL_MS };
      return catalog;
    })
    .catch((error: unknown) => {
      console.error("Supabase catalog read failed; serving snapshot.", error);
      // Serve stale data if we have it, otherwise the bundled snapshot. Cache
      // the fallback briefly so a database outage cannot stampede requests.
      const fallback = cached?.catalog ?? snapshot();
      cached = { catalog: fallback, expiresAt: Date.now() + 30_000 };
      return fallback;
    })
    .finally(() => {
      inFlight = undefined;
    });

  return inFlight;
}

export async function getProducts(): Promise<Product[]> {
  return (await getCatalog()).products;
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return (await getCatalog()).products.find((product) => product.id === id);
}

export async function getEvidence(): Promise<EvidenceDocument[]> {
  return (await getCatalog()).evidence;
}

export async function getActivity(): Promise<ActivityEvent[]> {
  return (await getCatalog()).activity;
}
