# Orin

Orin is a responsive product-intelligence workspace for fashion supply chains. It brings product, supplier, material, certification, and document evidence into one traceable record so teams can spot gaps and prepare Digital Product Passport data.

## Demo account

- Email: `maya@orin.demo`
- Password: `orin-demo`

The demo uses an HTTP-only session cookie and deterministic in-memory data. It is intentionally separated from the persistence and AI interfaces so MongoDB and a Llama-backed document analyzer can be connected later without rebuilding the UI.

## Run locally

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Open the URL printed by the dev server. Useful checks:

```bash
npm run lint
npm test
npm run build
```

## Product surfaces

- Public product story and problem framing
- Demo authentication
- Traceability dashboard
- Product catalog and evidence detail
- Document extraction lab with a replaceable AI adapter
- Public Digital Product Passport preview
- Protected JSON APIs for products, session state, and document analysis

## Integration seams

- `lib/data/product-repository.ts` defines the product data interface and demo repository. Add a MongoDB implementation there.
- `lib/ai/document-analyzer.ts` defines the document intelligence interface and demo analyzer. Add the Llama provider implementation there.
- `lib/auth.ts` owns the current demo session boundary and can later be replaced by production identity.

Brand guidance and reusable visual tokens live in `docs/brand-guidelines.md`, `assets/design-tokens.json`, and `assets/design-tokens.css`.
