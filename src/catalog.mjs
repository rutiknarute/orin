export const demoCredentials = Object.freeze({
  email: "maya@orin.demo",
  password: "orin-demo",
});

export const demoUser = Object.freeze({
  name: "Maya Chen",
  firstName: "Maya",
  initials: "MC",
  role: "Compliance lead",
  company: "Northline Studio",
});

const supplyChain = [
  { id: "fina", stage: "Raw material", company: "Fina Fiber Co.", location: "İzmir, Türkiye", documents: 3, status: "Verified" },
  { id: "luma", stage: "Yarn supplier", company: "Luma Spinning", location: "Gaziantep, Türkiye", documents: 2, status: "Verified" },
  { id: "novatex", stage: "Fabric mill", company: "NovaTex Mill", location: "Prato, Italy", documents: 4, status: "Verified" },
  { id: "chromia", stage: "Dyeing & finishing", company: "Chromia Works", location: "Como, Italy", documents: 1, status: "Missing" },
  { id: "miro", stage: "Final assembly", company: "Atelier Miro", location: "Porto, Portugal", documents: 3, status: "In review" },
  { id: "packwise", stage: "Packaging", company: "Packwise Europe", location: "Rotterdam, Netherlands", documents: 2, status: "Verified" },
];

const verifiedSupplyChain = supplyChain.map((supplier) => ({ ...supplier, status: "Verified" }));

export const products = [
  {
    id: "OR-24017",
    sku: "AS-LJ-042-NVY",
    name: "Aster Loop Jacket",
    category: "Outerwear",
    season: "AW 2026",
    color: "Midnight navy",
    status: "Needs evidence",
    completion: 84,
    evidence: 15,
    suppliers: 6,
    openItems: 3,
    recycledContent: 72,
    owner: "Maya Chen",
    updatedAt: "12 min ago",
    nextAction: "Collect dye-lot REACH declaration",
    material: "72% recycled polyester, 28% organic cotton",
    // Products without an `image` fall back to the generated placeholder.
    image: "/product-aster-loop-jacket.jpg",
    chain: supplyChain,
  },
  { id: "OR-24018", sku: "CO-OS-118-SND", name: "Coastline Overshirt", category: "Shirts", season: "SS 2027", color: "Sand", status: "In review", completion: 96, evidence: 11, suppliers: 4, openItems: 1, recycledContent: 46, owner: "Noah Williams", updatedAt: "1 hr ago", nextAction: "Approve factory declaration", material: "46% recycled cotton, 54% organic cotton", image: "/product-coastline-overshirt.jpg", chain: supplyChain.slice(0, 5) },
  { id: "OR-24019", sku: "ME-KN-220-NVY", name: "Meridian Knit", category: "Knitwear", season: "AW 2026", color: "Midnight navy", status: "Passport ready", completion: 100, evidence: 18, suppliers: 5, openItems: 0, recycledContent: 60, owner: "Maya Chen", updatedAt: "2 hrs ago", nextAction: "Publish passport", material: "60% recycled wool, 40% organic cotton", image: "/product-meridian-knit.jpg", chain: verifiedSupplyChain.slice(0, 5) },
  { id: "OR-24020", sku: "FO-TR-305-STN", name: "Forma Tailored Trouser", category: "Bottoms", season: "Core", color: "Stone grey", status: "At risk", completion: 71, evidence: 9, suppliers: 7, openItems: 6, recycledContent: 38, owner: "Imani Cole", updatedAt: "Yesterday", nextAction: "Replace expired certificate", material: "38% recycled wool, 62% viscose", image: "/product-forma-tailored-trouser.jpg", chain: supplyChain },
  { id: "OR-24021", sku: "NI-TS-014-WHT", name: "Nila Everyday Tee", category: "Jersey", season: "Core", color: "White", status: "Needs evidence", completion: 89, evidence: 8, suppliers: 3, openItems: 2, recycledContent: 25, owner: "Noah Williams", updatedAt: "Yesterday", nextAction: "Confirm origin declaration", material: "100% organic cotton", image: "/product-nila-everyday-tee.jpg", chain: supplyChain.slice(0, 4) },
  { id: "OR-24022", sku: "TE-SH-901-MOS", name: "Tera Storm Shell", category: "Outerwear", season: "AW 2026", color: "Moss", status: "Passport ready", completion: 100, evidence: 24, suppliers: 8, openItems: 0, recycledContent: 86, owner: "Maya Chen", updatedAt: "Jul 30", nextAction: "Monitor evidence validity", material: "86% recycled nylon, 14% elastane", image: "/product-tera-storm-shell.jpg", chain: verifiedSupplyChain },
];

export const evidence = [
  { id: "EV-991", title: "GRS transaction certificate 24-9081", supplier: "Luma Spinning", type: "Certification", received: "Jul 15, 2026", fields: 12, confidence: 98, status: "Verified" },
  { id: "EV-992", title: "Fabric composition test — NT-442", supplier: "NovaTex Mill", type: "Test report", received: "Jul 15, 2026", fields: 9, confidence: 96, status: "Verified" },
  { id: "EV-993", title: "Factory conformity declaration", supplier: "Atelier Miro", type: "Supplier declaration", received: "Jul 14, 2026", fields: 15, confidence: 91, status: "In review" },
  { id: "EV-994", title: "REACH dye-lot declaration", supplier: "Chromia Works", type: "Chemical compliance", received: "Not received", fields: 0, confidence: 0, status: "Missing" },
  { id: "EV-995", title: "FSC packaging scope", supplier: "Packwise Europe", type: "Certification", received: "Jul 12, 2026", fields: 7, confidence: 97, status: "Verified" },
];

export const activities = [
  { title: "Certificate verified", detail: "GRS transaction certificate · Luma Spinning", time: "8 min", tone: "success" },
  { title: "Product fields updated", detail: "9 material fields · NovaTex Mill", time: "24 min", tone: "accent" },
  { title: "Review requested", detail: "Factory conformity · Atelier Miro", time: "1 hr", tone: "warning" },
  { title: "Passport published", detail: "Meridian Knit · OR-24019", time: "3 hrs", tone: "success" },
];

export function findProduct(id) {
  return products.find((product) => product.id === id);
}

export function analyzeDocument(filename) {
  return {
    filename,
    documentType: "Transaction certificate",
    supplier: "Chromia Works",
    confidence: 94,
    fieldsFound: 6,
    reviewItems: 1,
    extracted: [
      { label: "Certificate", value: "CU-1167824", confidence: 99 },
      { label: "Issued to", value: "Chromia Works S.r.l.", confidence: 97 },
      { label: "Material", value: "Recycled polyester", confidence: 95 },
      { label: "Valid until", value: "30 Sep 2027", confidence: 93 },
      { label: "Dye lot", value: "CW-4492-NVY", confidence: 90 },
      { label: "REACH statement", value: "Human review needed", confidence: 72 },
    ],
  };
}
