import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createAppServer } from "../server.mjs";

let server;
let baseUrl;
let persistenceCalls = 0;

before(async () => {
  server = await createAppServer({ persistRuntime: async () => { persistenceCalls += 1; } });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

async function login() {
  const response = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "maya@orin.demo", password: "orin-demo" }),
  });
  assert.equal(response.status, 200);
  return response.headers.get("set-cookie").split(";")[0];
}

test("serves the new local interface and SPA routes", async () => {
  const home = await fetch(baseUrl);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /Orin turns supply-chain evidence/);

  const nestedRoute = await fetch(`${baseUrl}/app/products/OR-24017`);
  assert.equal(nestedRoute.status, 200);
  assert.match(await nestedRoute.text(), /id="app"/);
});

test("reports a healthy local catalog", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: "ok",
    service: "orin-node",
    catalog: { source: "local", products: 6 },
  });
});

test("protects product data with a local session", async () => {
  const unauthorized = await fetch(`${baseUrl}/api/products`);
  assert.equal(unauthorized.status, 401);

  const invalidLogin = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "maya@orin.demo", password: "wrong" }),
  });
  assert.equal(invalidLogin.status, 401);

  const cookie = await login();
  const authorized = await fetch(`${baseUrl}/api/products`, { headers: { Cookie: cookie } });
  assert.equal(authorized.status, 200);
  const body = await authorized.json();
  assert.equal(body.products.length, 6);
  assert.equal(body.products[0].id, "OR-24017");
  assert.ok(body.evidence.length > 0);
});

test("analyzes supported document names and rejects unsupported ones", async () => {
  const cookie = await login();
  const invalid = await fetch(`${baseUrl}/api/documents/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ filename: "supplier-notes.exe" }),
  });
  assert.equal(invalid.status, 400);

  const valid = await fetch(`${baseUrl}/api/documents/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ filename: "supplier-certificate.pdf" }),
  });
  assert.equal(valid.status, 200);
  const body = await valid.json();
  assert.equal(body.result.fieldsFound, 6);
  assert.equal(body.result.extracted.length, 6);
});

test("saves analyzed evidence and queues supplier reminders", async () => {
  const cookie = await login();
  const saved = await fetch(`${baseUrl}/api/evidence`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ filename: "saved-certificate.pdf", reviewedFields: [0, 1, 2, 3, 4, 5] }),
  });
  assert.equal(saved.status, 201);
  const savedBody = await saved.json();
  assert.equal(savedBody.evidence.status, "Verified");

  const catalog = await fetch(`${baseUrl}/api/products`, { headers: { Cookie: cookie } });
  const catalogBody = await catalog.json();
  assert.equal(catalogBody.evidence[0].id, savedBody.evidence.id);

  const reminder = await fetch(`${baseUrl}/api/reminders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ productId: "OR-24017" }),
  });
  assert.equal(reminder.status, 201);
  assert.match((await reminder.json()).message, /Aster Loop Jacket/);
  assert.equal(persistenceCalls, 2);
});

test("serves a public product passport without authentication", async () => {
  const response = await fetch(`${baseUrl}/api/passport/OR-24019`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.product.name, "Meridian Knit");
  assert.equal(body.product.completion, 100);
  assert.ok(body.product.chain.every((supplier) => supplier.status === "Verified"));
});
