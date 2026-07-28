/**
 * Generates components/icons.tsx from @phosphor-icons/react defs, inlining only
 * the icon + weight combinations this codebase actually renders.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.argv[2] ?? process.cwd();
const SRC_DIRS = ["app", "components"];
const DEFS = join(ROOT, "node_modules/@phosphor-icons/react/dist/defs");
const OUT = join(ROOT, "components/icons.tsx");
const ALL_WEIGHTS = ["regular", "bold", "fill", "duotone"];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const files = (
  await Promise.all(SRC_DIRS.map((d) => walk(join(ROOT, d))))
).flat();

/** icon name -> Set of weights */
const used = new Map();
const add = (name, weight) => {
  if (!used.has(name)) used.set(name, new Set());
  used.get(name).add(weight);
};

for (const file of files) {
  if (file === OUT) continue;
  const source = await readFile(file, "utf8");

  // Names imported from the icon set in this file. Both the upstream package
  // and this generated module count, so regenerating stays idempotent.
  const importBlock = source.match(
    /import\s*\{([^}]*?)\}\s*from\s*"(?:@phosphor-icons\/react|@\/components\/icons)"/,
  );
  if (!importBlock) continue;
  const imported = importBlock[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Icons stashed in a config object (`{ icon: SquaresFour }`) are rendered
  // through a local alias (`{ icon: Icon }`). Collect both sides: the alias
  // tells us which weights are drawn, the config tells us which icons.
  const referenced = new Set();
  const aliases = new Set();
  for (const m of source.matchAll(/icon:\s*([A-Z][A-Za-z0-9]*)/g)) {
    if (imported.includes(m[1])) referenced.add(m[1]);
    else aliases.add(m[1]);
  }
  const indirectWeights = weightsForAliases(source, aliases);

  for (const name of imported) {
    for (const [, attrs = ""] of source.matchAll(
      new RegExp(`<${name}(\\s[^>]*)?/?>`, "g"),
    )) {
      const literal = attrs.match(/weight="([a-z]+)"/);
      if (literal) add(name, literal[1]);
      else if (/weight=\{/.test(attrs)) ALL_WEIGHTS.forEach((w) => add(name, w));
      else add(name, "regular");
    }
    if (referenced.has(name))
      for (const w of indirectWeights) add(name, w);
  }
}

function weightsForAliases(source, aliases) {
  const weights = new Set();
  for (const alias of aliases) {
    for (const [, attrs = ""] of source.matchAll(
      new RegExp(`<${alias}(\\s[^>]*)?/?>`, "g"),
    )) {
      const literal = attrs.match(/weight="([a-z]+)"/);
      if (literal) weights.add(literal[1]);
      else if (/weight=\{/.test(attrs)) ALL_WEIGHTS.forEach((w) => weights.add(w));
      else weights.add("regular");
    }
  }
  return weights;
}

/** Pull the JSX element list for one weight out of a phosphor def module. */
function extractWeight(defSource, weight) {
  const key = `"${weight}"`;
  const at = defSource.indexOf(`  [\n    ${key},`);
  if (at === -1) return undefined;
  const start = defSource.indexOf("\n", at + 1);
  const end = defSource.indexOf("\n  ]", start);
  const body = defSource.slice(start, end);

  const paths = [];
  for (const m of body.matchAll(
    /createElement\("path",\s*\{([\s\S]*?)\}\s*\)/g,
  )) {
    const attrs = m[1];
    const d = attrs.match(/d:\s*"([^"]*)"/)?.[1];
    if (!d) continue;
    const opacity = attrs.match(/opacity:\s*"([^"]*)"/)?.[1];
    paths.push({ d, opacity });
  }
  return paths.length ? paths : undefined;
}

const names = [...used.keys()].sort();
const icons = [];

for (const name of names) {
  const defPath = join(DEFS, `${name}.es.js`);
  let defSource;
  try {
    defSource = await readFile(defPath, "utf8");
  } catch {
    console.warn(`! no def for ${name}`);
    continue;
  }
  const weights = {};
  for (const weight of [...used.get(name)].sort()) {
    const paths = extractWeight(defSource, weight);
    if (!paths) {
      console.warn(`! ${name} has no ${weight} weight`);
      continue;
    }
    weights[weight] = paths;
  }
  if (Object.keys(weights).length) icons.push({ name, weights });
}

const renderPaths = (paths) =>
  paths
    .map(
      (p) =>
        `<path d="${p.d}"${p.opacity ? ` opacity="${p.opacity}"` : ""} />`,
    )
    .join("");

const body = icons
  .map(({ name, weights }) => {
    const entries = Object.entries(weights)
      .map(([w, paths]) => `  ${w}: <>${renderPaths(paths)}</>,`)
      .join("\n");
    // The PURE marker lets the bundler drop icons a client chunk never draws.
    return `export const ${name} = /* @__PURE__ */ icon({\n${entries}\n});`;
  })
  .join("\n\n");

const out = `/**
 * Inline Phosphor icons.
 *
 * GENERATED FILE — do not edit by hand. Regenerate with:
 *   node scripts/generate-icons.mjs
 *
 * These are plain server-renderable components with no React context and no
 * client boundary, so pages that only draw icons ship no JavaScript for them.
 * Only the icon/weight pairs this app renders are inlined.
 *
 * Icons from Phosphor Icons (MIT) — https://phosphoricons.com
 */
import type { ReactElement, SVGProps } from "react";

export type IconWeight = "regular" | "bold" | "fill" | "duotone";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "weight"> {
  size?: number | string;
  weight?: IconWeight;
}

type Glyphs = Partial<Record<IconWeight, ReactElement>>;

function icon(glyphs: Glyphs) {
  const fallback = Object.values(glyphs)[0];
  return function Icon({ size, weight = "regular", color, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color ?? "currentColor"}
        viewBox="0 0 256 256"
        {...props}
      >
        {glyphs[weight] ?? fallback}
      </svg>
    );
  };
}

${body}
`;

await writeFile(OUT, out);
console.log(`wrote ${OUT}`);
console.log(
  `${icons.length} icons, ${icons.reduce((n, i) => n + Object.keys(i.weights).length, 0)} weight variants`,
);
for (const { name, weights } of icons)
  console.log(`  ${name}: ${Object.keys(weights).join(", ")}`);
