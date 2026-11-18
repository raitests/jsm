const LOOPBACK = new Set(["localhost", "127.0.0.1", "::1"]);

/** Throws if url is not https (non-loopback) or is missing. */
export function requireSupabaseUrl(url: string | undefined): asserts url is string {
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`NEXT_PUBLIC_SUPABASE_URL is not a valid URL: ${url}`);
  }
  if (parsed.protocol !== "https:" && !LOOPBACK.has(parsed.hostname)) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL must use https (got ${parsed.protocol}). ` +
        "Plain http is only allowed for local loopback addresses.",
    );
  }
}
