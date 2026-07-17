import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const environment = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const context = {
  waitUntil() {},
  passThroughOnException() {},
};

test("server-renders the Orin product story", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    environment,
    context,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Every supplier answer/);
  assert.match(html, /One trusted product record/);
  assert.match(html, /Open the demo workspace/);
  assert.match(html, /orin-brand-board\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships the supplied Orin brand asset and product metadata", async () => {
  await access(new URL("../public/orin-brand-board.png", import.meta.url));
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Every supplier answer/);
  assert.match(layout, /Orin — Connected product evidence/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("rejects incorrect demo credentials and accepts the demo account", async () => {
  const worker = await getWorker();
  const bad = await worker.fetch(
    new Request("http://localhost/api/auth/demo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "wrong@example.com", password: "bad" }),
    }),
    environment,
    context,
  );
  assert.equal(bad.status, 401);

  const good = await worker.fetch(
    new Request("http://localhost/api/auth/demo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "maya@orin.demo", password: "orin-demo" }),
    }),
    environment,
    context,
  );
  assert.equal(good.status, 200);
  assert.match(good.headers.get("set-cookie") ?? "", /orin_demo_session=/);
});
