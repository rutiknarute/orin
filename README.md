# Orin

Orin is a responsive product-intelligence workspace for fashion supply chains. It brings product, supplier, material, certification, and document evidence into one traceable record so teams can spot gaps and prepare Digital Product Passport data.

**Live demo: <https://orin-five.vercel.app>**

Sample product passport: <https://orin-five.vercel.app/passport/OR-24017>

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

## Deployment

The same source builds for two targets.

- **Vercel** (currently live) runs `next build`, pinned in `vercel.json`. Pushes
  to `main` deploy automatically.
- **Cloudflare Workers** is what `npm run build` targets, via `vinext`. It emits
  `dist/` instead of `.next/` and uses `worker/index.ts` for asset serving and
  image optimization — which is why `vercel.json` has to override the build
  command rather than inherit the one in `package.json`.

Supabase credentials are read from `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`
when set, falling back to the values in `lib/supabase/config.ts`. The publishable
key is safe to commit: every table has row level security enabled with
select-only policies. If the catalog read fails or exceeds its timeout, the app
falls back to the local snapshot in `lib/demo-data.ts`, so the deploy never
hard-depends on the database being reachable.
