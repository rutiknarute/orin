/**
 * Supabase connection settings.
 *
 * The publishable (anon) key is safe to ship: every Orin table has row level
 * security enabled with select-only policies, so this key can read the public
 * demo catalog and nothing else. Values can still be overridden per
 * environment — Cloudflare Workers expose `vars` and secrets on `process.env`
 * when `nodejs_compat` is on.
 */
const DEFAULT_SUPABASE_URL = "https://oghhyfzaohtfxsicmimu.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_fCgy-1QzrAvQck5LeuqmLg_EY4wF6SB";

function read(...names: string[]): string | undefined {
  // `process` is absent in some edge runtimes; guard rather than assume.
  const source =
    typeof process !== "undefined" && process.env ? process.env : undefined;
  if (!source) return undefined;
  for (const name of names) {
    const value = source[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export const supabaseUrl =
  read("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL") ?? DEFAULT_SUPABASE_URL;

export const supabaseKey =
  read(
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ) ?? DEFAULT_SUPABASE_KEY;

/** How long a fetched catalog stays warm inside a worker isolate. */
export const CATALOG_TTL_MS = 5 * 60 * 1000;

/** Upper bound on a catalog read before falling back to the local snapshot. */
export const CATALOG_TIMEOUT_MS = 2500;
