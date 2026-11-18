/**
 * Test helper: an in-memory Postgres (pglite) that looks enough like Supabase
 * to test migrations, RLS policies, grants and functions. Never use it in the app.
 *
 * Stubs: the `anon`, `authenticated` and `service_role` roles, the `auth` and
 * `extensions` schemas, `auth.jwt()` (reads the `request.jwt.claims` setting,
 * like Supabase), and Supabase's default grants on the `public` schema.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite, type Transaction } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite-pgvector";

export const MIGRATIONS_DIR = fileURLToPath(new URL("../../supabase/migrations", import.meta.url));

export type SupabaseRole = "anon" | "authenticated" | "service_role";
export type JwtClaims = Record<string, unknown>;

const SUPABASE_STUB = /* sql */ `
  create role anon nologin noinherit;
  create role authenticated nologin noinherit;
  create role service_role nologin noinherit bypassrls;

  create schema auth;
  create schema extensions;
  grant usage on schema public, auth, extensions to anon, authenticated, service_role;

  create function auth.jwt() returns jsonb
  language sql stable
  as $$
    select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
  $$;

  -- Supabase's defaults: new objects in public are granted to the API roles.
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
`;

/** Migration file names in `supabase/migrations`, oldest first. */
export function migrationFiles(dir: string = MIGRATIONS_DIR): string[] {
  return readdirSync(dir)
    .filter((f) => /^\d{14}_.+\.sql$/.test(f))
    .sort();
}

/** A fresh in-memory database with the Supabase stubs and every migration applied. */
export async function createTestDb(dir: string = MIGRATIONS_DIR): Promise<PGlite> {
  const db = await PGlite.create({ extensions: { vector } });
  await db.exec(SUPABASE_STUB);
  for (const file of migrationFiles(dir)) {
    try {
      await db.exec(readFileSync(join(dir, file), "utf8"));
    } catch (err) {
      throw new Error(`Migration ${file} failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return db;
}

/**
 * Run `fn` in a transaction as `role`, with `auth.jwt()` returning `claims`.
 * The transaction rolls back if `fn` throws, so a refused statement leaves no trace.
 */
export async function asRole<T>(
  db: PGlite,
  role: SupabaseRole,
  claims: JwtClaims | null,
  fn: (tx: Transaction) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify(claims ?? {})]);
    await tx.exec(`set local role ${role}`);
    return fn(tx);
  });
}

/** Run `fn` as a signed-in owner (`authenticated`, `sub` = `userId`). */
export function asOwner<T>(db: PGlite, userId: string, fn: (tx: Transaction) => Promise<T>): Promise<T> {
  return asRole(db, "authenticated", { sub: userId, role: "authenticated" }, fn);
}

/** Run `fn` as an anonymous caller (`anon`, no claims). */
export function asAnon<T>(db: PGlite, fn: (tx: Transaction) => Promise<T>): Promise<T> {
  return asRole(db, "anon", { role: "anon" }, fn);
}
