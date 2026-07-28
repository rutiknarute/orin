import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

let client: SupabaseClient<Database> | undefined;

/**
 * Server-side Supabase client, created once per worker isolate.
 *
 * Auth persistence and realtime are off: this app only reads the public
 * catalog, and skipping them keeps the worker's cold start small.
 */
export function getSupabase(): SupabaseClient<Database> {
  client ??= createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return client;
}
