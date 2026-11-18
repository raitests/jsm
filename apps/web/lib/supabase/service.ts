import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@askwell/db";
import { requireSupabaseUrl } from "./validate";

/**
 * Server-only Supabase client using the service role key.
 * Bypasses RLS — only use after the route has verified ownership.
 * This is the only file in the repo that may read SUPABASE_SECRET_KEY.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  requireSupabaseUrl(url);
  if (!key) throw new Error("SUPABASE_SECRET_KEY is not set");

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
