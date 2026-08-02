// Vercel entry point. Every request is rewritten here by vercel.json, so this
// wraps the same request listener the local `node server.mjs` process uses.
//
// Two things behave differently from running it locally, both a consequence of
// the serverless model rather than the app:
//   - Sessions live in module scope, so they survive only as long as a warm
//     instance. A request routed to a different instance appears signed out.
//   - The filesystem is read-only, so saved evidence is kept in memory for the
//     life of the instance instead of being written to data/runtime.json.
// Neither affects browsing the catalogue, records or public passports.
import { createRequestListener } from "../server.mjs";

const listener = await createRequestListener({ reloadAssets: false });

export default function handler(req, res) {
  return listener(req, res);
}
