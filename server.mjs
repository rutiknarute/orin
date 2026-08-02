import { createServer } from "node:http";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";

import {
  activities,
  analyzeDocument,
  demoCredentials,
  demoUser,
  evidence,
  findProduct,
  products,
} from "./src/catalog.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const RUNTIME_STORE = resolve(ROOT, "data/runtime.json");
const SESSION_COOKIE = "orin_session";
const SESSION_LIFETIME_SECONDS = 8 * 60 * 60;
const MAX_BODY_BYTES = 64 * 1024;
let runtimeWriteQueue = Promise.resolve();

// Artwork is declared optional: a missing file logs a notice and 404s that one
// path rather than stopping the server from booting.
const imageAssets = [
  "logo-orin.png",
  "hero-supply-chain.jpg",
  "product-aster-loop-jacket.jpg",
  "product-meridian-knit.jpg",
  "flow-01-intake.jpg",
  "flow-02-review.jpg",
  "flow-03-passport.jpg",
];

const imageType = (name) => (name.endsWith(".png") ? "image/png" : "image/jpeg");

const assetDefinitions = {
  "/": { file: "public/index.html", type: "text/html; charset=utf-8", cache: "no-store" },
  "/app.css": { file: "public/app.css", type: "text/css; charset=utf-8", cache: "no-cache" },
  "/app.js": { file: "public/app.js", type: "text/javascript; charset=utf-8", cache: "no-cache" },
  "/favicon.svg": { file: "public/favicon.svg", type: "image/svg+xml", cache: "public, max-age=86400" },
  ...Object.fromEntries(
    imageAssets.map((name) => [
      `/${name}`,
      { file: `public/${name}`, type: imageType(name), cache: "public, max-age=86400", optional: true },
    ]),
  ),
};

function standardHeaders() {
  return {
    "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };
}

function send(res, status, body = "", headers = {}, method = "GET") {
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(body);
  res.writeHead(status, {
    ...standardHeaders(),
    "Content-Length": payload.byteLength,
    ...headers,
  });
  res.end(method === "HEAD" ? undefined : payload);
}

function sendJson(res, status, value, headers = {}, method = "GET") {
  send(
    res,
    status,
    JSON.stringify(value),
    { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
    method,
  );
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf("=");
        if (separator === -1) return [part, ""];
        return [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
      }),
  );
}

async function readJson(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

function sessionForRequest(req, sessions) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { token, ...session };
}

function requireSession(req, res, sessions) {
  const session = sessionForRequest(req, sessions);
  if (!session) {
    sendJson(res, 401, { error: "Sign in to continue." });
    return null;
  }
  return session;
}

function validateDocumentName(value) {
  if (typeof value !== "string") return null;
  const filename = value.trim();
  if (!filename || filename.length > 180) return null;
  if (!/\.(pdf|png|jpe?g)$/i.test(filename)) return null;
  return filename;
}

export async function createAppServer({
  sessions = new Map(),
  runtime = { savedEvidence: [], reminders: [] },
  persistRuntime = async () => {},
  // Outside production the interface files are re-read per request, so editing
  // app.css or app.js and reloading the page shows the change without a
  // restart. Production keeps the boot-time copy in memory.
  reloadAssets = process.env.NODE_ENV !== "production",
} = {}) {
  const assets = new Map(
    await Promise.all(
      Object.entries(assetDefinitions).map(async ([pathname, definition]) => {
        try {
          return [pathname, { ...definition, body: await readFile(resolve(ROOT, definition.file)) }];
        } catch (error) {
          if (!definition.optional) throw error;
          console.warn(`${definition.file} is not present; ${pathname} responds 404 until it is added.`);
          return [pathname, { ...definition, body: null }];
        }
      }),
    ),
  );

  async function asset(pathname) {
    const entry = assets.get(pathname);
    if (!entry) return null;
    if (!reloadAssets) return entry.body ? entry : null;
    try {
      return { ...entry, body: await readFile(resolve(ROOT, entry.file)) };
    } catch {
      // Fall back to the copy loaded at boot if the file is briefly
      // unreadable, e.g. mid-write by an editor.
      return entry.body ? entry : null;
    }
  }

  return createServer(async (req, res) => {
    const method = req.method ?? "GET";
    const url = new URL(req.url ?? "/", "http://localhost");
    const pathname = url.pathname;

    try {
      if (pathname === "/api/health" && (method === "GET" || method === "HEAD")) {
        return sendJson(
          res,
          200,
          { status: "ok", service: "orin-node", catalog: { source: "local", products: products.length } },
          {},
          method,
        );
      }

      if (pathname === "/api/login" && method === "POST") {
        const body = await readJson(req);
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body.password === "string" ? body.password : "";

        if (email !== demoCredentials.email || password !== demoCredentials.password) {
          return sendJson(res, 401, { error: "Email or password is incorrect." });
        }

        const token = randomUUID();
        sessions.set(token, { user: demoUser, expiresAt: Date.now() + SESSION_LIFETIME_SECONDS * 1000 });
        return sendJson(
          res,
          200,
          { authenticated: true, user: demoUser },
          {
            "Set-Cookie": `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_LIFETIME_SECONDS}`,
          },
        );
      }

      if (pathname === "/api/logout" && method === "POST") {
        const session = sessionForRequest(req, sessions);
        if (session) sessions.delete(session.token);
        return sendJson(
          res,
          200,
          { authenticated: false },
          { "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` },
        );
      }

      if (pathname === "/api/session" && (method === "GET" || method === "HEAD")) {
        const session = sessionForRequest(req, sessions);
        return sendJson(
          res,
          200,
          session ? { authenticated: true, user: session.user } : { authenticated: false, user: null },
          {},
          method,
        );
      }

      if (pathname === "/api/products" && (method === "GET" || method === "HEAD")) {
        if (!requireSession(req, res, sessions)) return;
        return sendJson(res, 200, { products, evidence: [...runtime.savedEvidence, ...evidence], activities }, {}, method);
      }

      const productMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
      if (productMatch && (method === "GET" || method === "HEAD")) {
        if (!requireSession(req, res, sessions)) return;
        const product = findProduct(decodeURIComponent(productMatch[1]));
        if (!product) return sendJson(res, 404, { error: "Product not found." }, {}, method);
        return sendJson(res, 200, { product, evidence: [...runtime.savedEvidence, ...evidence] }, {}, method);
      }

      const passportMatch = pathname.match(/^\/api\/passport\/([^/]+)$/);
      if (passportMatch && (method === "GET" || method === "HEAD")) {
        const product = findProduct(decodeURIComponent(passportMatch[1]));
        if (!product) return sendJson(res, 404, { error: "Passport not found." }, {}, method);
        return sendJson(res, 200, { product }, {}, method);
      }

      if (pathname === "/api/documents/analyze" && method === "POST") {
        if (!requireSession(req, res, sessions)) return;
        const body = await readJson(req);
        const filename = validateDocumentName(body.filename);
        if (!filename) {
          return sendJson(res, 400, { error: "Choose a PDF, PNG, or JPG file." });
        }
        return sendJson(res, 200, { result: analyzeDocument(filename) });
      }

      if (pathname === "/api/evidence" && method === "POST") {
        if (!requireSession(req, res, sessions)) return;
        const body = await readJson(req);
        const filename = validateDocumentName(body.filename);
        if (!filename) return sendJson(res, 400, { error: "A valid source document is required." });

        const analysis = analyzeDocument(filename);
        const reviewedFields = Array.isArray(body.reviewedFields)
          ? body.reviewedFields.filter((index) => Number.isInteger(index) && index >= 0 && index < analysis.fieldsFound)
          : [];
        const record = {
          id: `EV-${randomUUID().slice(0, 8).toUpperCase()}`,
          title: filename,
          supplier: analysis.supplier,
          type: analysis.documentType,
          received: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date()),
          fields: analysis.fieldsFound,
          confidence: analysis.confidence,
          status: reviewedFields.length === analysis.fieldsFound ? "Verified" : "In review",
          reviewedFields: reviewedFields.length,
        };
        runtime.savedEvidence.unshift(record);
        try {
          await persistRuntime(runtime);
        } catch (error) {
          runtime.savedEvidence.shift();
          throw error;
        }
        return sendJson(res, 201, { evidence: record, totalSaved: runtime.savedEvidence.length });
      }

      if (pathname === "/api/reminders" && method === "POST") {
        if (!requireSession(req, res, sessions)) return;
        const body = await readJson(req);
        const product = typeof body.productId === "string" ? findProduct(body.productId) : null;
        if (!product) return sendJson(res, 404, { error: "Product not found." });
        const reminder = {
          id: randomUUID(),
          productId: product.id,
          action: product.nextAction,
          queuedAt: new Date().toISOString(),
        };
        runtime.reminders.push(reminder);
        try {
          await persistRuntime(runtime);
        } catch (error) {
          runtime.reminders.pop();
          throw error;
        }
        return sendJson(res, 201, { reminder, message: `Reminder queued for ${product.name}.` });
      }

      if (pathname.startsWith("/api/")) {
        return sendJson(res, 404, { error: "API route not found." }, {}, method);
      }

      if (method !== "GET" && method !== "HEAD") {
        return sendJson(res, 405, { error: "Method not allowed." }, { Allow: "GET, HEAD" }, method);
      }

      if (pathname !== "/") {
        const file = await asset(pathname);
        if (file) {
          return send(
            res,
            200,
            file.body,
            { "Content-Type": file.type, "Cache-Control": file.cache },
            method,
          );
        }
        // A declared asset that is missing on disk must 404 rather than fall
        // through to the SPA shell, which would hand HTML to an <img> tag.
        if (assetDefinitions[pathname]) {
          return sendJson(res, 404, { error: "Asset not found." }, {}, method);
        }
      }

      const index = await asset("/");
      return send(res, 200, index.body, { "Content-Type": index.type, "Cache-Control": index.cache }, method);
    } catch (error) {
      const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
      if (status === 500) console.error(error);
      if (!res.headersSent) {
        sendJson(res, status, { error: status === 500 ? "Something went wrong." : error.message });
      } else {
        res.end();
      }
    }
  });
}

async function existingOrinServer(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`, {
      signal: AbortSignal.timeout(700),
      headers: { Accept: "application/json" },
    });
    const body = await response.json();
    return body.service === "orin-node";
  } catch {
    return false;
  }
}

async function loadRuntimeStore() {
  try {
    const stored = JSON.parse(await readFile(RUNTIME_STORE, "utf8"));
    return {
      savedEvidence: Array.isArray(stored.savedEvidence) ? stored.savedEvidence : [],
      reminders: Array.isArray(stored.reminders) ? stored.reminders : [],
    };
  } catch (error) {
    if (error.code !== "ENOENT") console.warn("Local runtime data could not be read; starting with a clean store.");
    return { savedEvidence: [], reminders: [] };
  }
}

function persistRuntimeStore(runtime) {
  const snapshot = `${JSON.stringify(runtime, null, 2)}\n`;
  const write = runtimeWriteQueue.catch(() => {}).then(async () => {
    await mkdir(dirname(RUNTIME_STORE), { recursive: true });
    const temporaryStore = `${RUNTIME_STORE}.${process.pid}.tmp`;
    await writeFile(temporaryStore, snapshot, { mode: 0o600 });
    await rename(temporaryStore, RUNTIME_STORE);
  });
  runtimeWriteQueue = write;
  return write;
}

async function start() {
  const port = Number.parseInt(process.env.PORT ?? "3000", 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("PORT must be a number between 1 and 65535.");
    process.exitCode = 1;
    return;
  }

  if (await existingOrinServer(port)) {
    console.log(`Orin is already running at http://localhost:${port}`);
    return;
  }

  const runtime = await loadRuntimeStore();
  const server = await createAppServer({ runtime, persistRuntime: persistRuntimeStore });
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is being used by another application. Run Orin with PORT=3001 npm run dev.`);
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`Orin is ready at http://localhost:${port}`);
  });

  const close = () => server.close(() => process.exit(0));
  process.once("SIGINT", close);
  process.once("SIGTERM", close);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (invokedPath === import.meta.url) await start();
