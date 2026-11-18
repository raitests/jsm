import "server-only";
import { createServiceClient } from "./supabase/service";

/**
 * Idempotent: ensures an `accounts` row exists for `clerkUserId` with plan `free`.
 * Safe to call on every dashboard load; ignores duplicates so concurrent first
 * loads or repeated visits never produce a second row or override a Pro plan.
 * The user ID must come from Clerk's server-side `auth()`, never from the request.
 */
export async function ensureAccount(clerkUserId: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("accounts")
    .upsert({ clerk_user_id: clerkUserId, plan: "free" }, { onConflict: "clerk_user_id", ignoreDuplicates: true });

  if (error) throw new Error(`Failed to initialize account: ${error.message}`);
}
