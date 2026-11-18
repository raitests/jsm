import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@askwell/db";

/**
 * Server-only Supabase client for owner actions (server components, API routes).
 * RLS is enforced: Supabase reads the Clerk JWT `sub` claim as the user ID.
 */
export async function createOwnerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set");

  const { getToken } = await auth();

  return createClient<Database>(url, key, {
    accessToken: () => getToken().then((t) => t ?? ""),
  });
}
