import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { MIGRATIONS_DIR, createTestDb, migrationFiles } from "../supabase-pglite";

let db: PGlite;

beforeAll(async () => {
  db = await createTestDb();
});
afterAll(async () => {
  await db.close();
});

describe("migrations", () => {
  it("run cleanly on an empty database", async () => {
    expect(migrationFiles().length).toBeGreaterThan(0);
    const r = await db.query<{ table_name: string }>(
      "select table_name from information_schema.tables where table_schema = 'public' order by 1",
    );
    expect(r.rows.map((x) => x.table_name)).toEqual([
      "accounts",
      "conversations",
      "knowledge_chunks",
      "knowledge_sources",
      "messages",
      "projects",
      "widget_configs",
    ]);
  });

  it("enable RLS on every public table", async () => {
    const r = await db.query<{ relname: string }>(
      `select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity`,
    );
    expect(r.rows).toEqual([]);
  });

  it("give anon no table privileges", async () => {
    const r = await db.query(
      "select table_name, privilege_type from information_schema.role_table_grants where grantee in ('anon', 'PUBLIC') and table_schema = 'public'",
    );
    expect(r.rows).toEqual([]);
  });

  it("give no API role TRUNCATE", async () => {
    const r = await db.query(
      `select table_name, grantee from information_schema.role_table_grants
       where table_schema = 'public' and privilege_type = 'TRUNCATE'
         and grantee in ('anon', 'authenticated', 'service_role', 'PUBLIC')`,
    );
    expect(r.rows).toEqual([]);
  });

  it("define only the two RLS helpers (no limit/chat functions yet)", async () => {
    const r = await db.query<{ fn: string }>(
      `select n.nspname || '.' || p.proname as fn from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname in ('public', 'private') order by 1`,
    );
    expect(r.rows.map((x) => x.fn)).toEqual(["private.owned_conversation_ids", "private.owned_project_ids"]);
  });

  it("make the helpers SECURITY DEFINER with an empty search_path", async () => {
    const r = await db.query<{ proname: string; prosecdef: boolean; proconfig: string[] | null }>(
      `select p.proname, p.prosecdef, p.proconfig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'private'`,
    );
    for (const row of r.rows) {
      expect(row.prosecdef).toBe(true);
      expect(row.proconfig).toContain('search_path=""');
    }
  });

  it("create no Storage bucket", () => {
    for (const file of migrationFiles()) {
      const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8").toLowerCase();
      expect(sql).not.toContain("storage.buckets");
    }
  });
});
