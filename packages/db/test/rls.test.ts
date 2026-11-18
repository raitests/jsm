import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { asAnon, asOwner, asRole, createTestDb } from "../supabase-pglite";

const A = "user_a";
const B = "user_b";

const ids = {
  projectA: "00000000-0000-4000-8000-0000000000a1",
  projectB: "00000000-0000-4000-8000-0000000000b1",
  sourceA: "00000000-0000-4000-8000-0000000000a2",
  sourceB: "00000000-0000-4000-8000-0000000000b2",
  convA: "00000000-0000-4000-8000-0000000000a3",
  convB: "00000000-0000-4000-8000-0000000000b3",
};

const TABLES = [
  "accounts",
  "projects",
  "widget_configs",
  "knowledge_sources",
  "knowledge_chunks",
  "conversations",
  "messages",
] as const;

const SEED = /* sql */ `
  truncate public.accounts cascade;

  insert into public.accounts (clerk_user_id, plan) values ('${A}', 'free'), ('${B}', 'pro');

  insert into public.projects (id, owner_id, name, public_key) values
    ('${ids.projectA}', '${A}', 'A site', 'pk_aaaaaaaaaaaaaaaaaaaa'),
    ('${ids.projectB}', '${B}', 'B site', 'pk_bbbbbbbbbbbbbbbbbbbb');

  insert into public.widget_configs (project_id) values ('${ids.projectA}'), ('${ids.projectB}');

  insert into public.knowledge_sources (id, project_id, title, type, storage_key, status) values
    ('${ids.sourceA}', '${ids.projectA}', 'A doc', 'pdf', 'a/doc.pdf', 'ready'),
    ('${ids.sourceB}', '${ids.projectB}', 'B notes', 'text', null, 'ready');

  insert into public.knowledge_chunks (project_id, source_id, content, embedding) values
    ('${ids.projectA}', '${ids.sourceA}', 'A chunk', array_fill(0.1::real, array[1536])::extensions.vector),
    ('${ids.projectB}', '${ids.sourceB}', 'B chunk', array_fill(0.2::real, array[1536])::extensions.vector);

  insert into public.conversations (id, project_id, visitor_id) values
    ('${ids.convA}', '${ids.projectA}', 'visitor-a'),
    ('${ids.convB}', '${ids.projectB}', 'visitor-b');

  insert into public.messages (conversation_id, role, body) values
    ('${ids.convA}', 'visitor', 'Hi from A'), ('${ids.convA}', 'bot', 'Hello A'),
    ('${ids.convB}', 'visitor', 'Hi from B');
`;

async function count(db: PGlite, sql: string): Promise<number> {
  const r = await db.query<{ n: number }>(`select count(*)::int as n from (${sql}) t`);
  return r.rows[0]!.n;
}

let db: PGlite;

beforeAll(async () => {
  db = await createTestDb();
});
afterAll(async () => {
  await db.close();
});
beforeEach(async () => {
  await db.exec(SEED);
});

describe("owner isolation", () => {
  it("owner A sees only their own account", async () => {
    const rows = await asOwner(db, A, async (tx) =>
      (await tx.query<{ clerk_user_id: string }>("select clerk_user_id from public.accounts")).rows,
    );
    expect(rows).toEqual([{ clerk_user_id: A }]);
  });

  it.each([
    ["projects", "select id as project_id from public.projects", ids.projectA],
    ["widget_configs", "select project_id from public.widget_configs", ids.projectA],
    ["knowledge_sources", "select project_id from public.knowledge_sources", ids.projectA],
    ["knowledge_chunks", "select project_id from public.knowledge_chunks", ids.projectA],
    ["conversations", "select project_id from public.conversations", ids.projectA],
  ])("owner A sees only their own %s", async (_table, sql, expected) => {
    const rows = await asOwner(db, A, async (tx) => (await tx.query<{ project_id: string }>(sql)).rows);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.project_id === expected)).toBe(true);
  });

  it("owner A sees only their own messages", async () => {
    const rows = await asOwner(db, A, async (tx) =>
      (await tx.query<{ conversation_id: string }>("select conversation_id from public.messages")).rows,
    );
    expect(rows).toHaveLength(2);
    expect(rows.every((r) => r.conversation_id === ids.convA)).toBe(true);
  });

  it("owner A can't read owner B's rows by id", async () => {
    const n = await asOwner(db, A, async (tx) => {
      const r = await tx.query<{ n: number }>(
        `select
           (select count(*) from public.projects where id = $1) +
           (select count(*) from public.knowledge_sources where id = $2) +
           (select count(*) from public.conversations where id = $3) +
           (select count(*) from public.messages where conversation_id = $3) as n`,
        [ids.projectB, ids.sourceB, ids.convB],
      );
      return Number(r.rows[0]!.n);
    });
    expect(n).toBe(0);
  });

  it("a token without sub sees nothing", async () => {
    const n = await asRole(db, "authenticated", { role: "authenticated" }, async (tx) => {
      const r = await tx.query<{ n: number }>("select count(*)::int as n from public.projects");
      return r.rows[0]!.n;
    });
    expect(n).toBe(0);
  });
});

describe("anon", () => {
  it.each(TABLES)("can't read %s", async (table) => {
    await expect(asAnon(db, (tx) => tx.query(`select * from public.${table}`))).rejects.toThrow(
      /permission denied/,
    );
  });

  it("can't call the RLS helpers", async () => {
    await expect(asAnon(db, (tx) => tx.query("select private.owned_project_ids()"))).rejects.toThrow(
      /permission denied/,
    );
  });
});

describe("authenticated writes", () => {
  it("can't insert a project", async () => {
    await expect(
      asOwner(db, A, (tx) =>
        tx.query(
          "insert into public.projects (owner_id, name, public_key) values ($1, 'x', 'pk_cccccccccccccccccccc')",
          [A],
        ),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it.each([
    ["public_key", "'pk_dddddddddddddddddddd'"],
    ["messages_used", "0"],
    ["owner_id", `'${B}'`],
  ])("can't update %s", async (column, value) => {
    await expect(
      asOwner(db, A, (tx) => tx.query(`update public.projects set ${column} = ${value} where id = $1`, [ids.projectA])),
    ).rejects.toThrow(/permission denied/);
  });

  it.each(["accounts", "widget_configs", "knowledge_sources", "knowledge_chunks", "conversations", "messages"])(
    "can't delete from %s",
    async (table) => {
      await expect(asOwner(db, A, (tx) => tx.query(`delete from public.${table}`))).rejects.toThrow(
        /permission denied/,
      );
    },
  );

  it("can't change their plan", async () => {
    await expect(
      asOwner(db, A, (tx) => tx.query("update public.accounts set plan = 'pro' where clerk_user_id = $1", [A])),
    ).rejects.toThrow(/permission denied/);
  });

  it("can't truncate", async () => {
    await expect(asOwner(db, A, (tx) => tx.query("truncate public.projects cascade"))).rejects.toThrow(
      /permission denied/,
    );
  });

  it("renames their own project", async () => {
    const r = await asOwner(db, A, (tx) =>
      tx.query<{ name: string }>("update public.projects set name = 'Renamed' where id = $1 returning name", [
        ids.projectA,
      ]),
    );
    expect(r.rows).toEqual([{ name: "Renamed" }]);
  });

  it("can't rename another owner's project", async () => {
    const r = await asOwner(db, A, (tx) =>
      tx.query("update public.projects set name = 'Hacked' where id = $1", [ids.projectB]),
    );
    expect(r.affectedRows).toBe(0);
    expect(await count(db, `select 1 from public.projects where id = '${ids.projectB}' and name = 'B site'`)).toBe(1);
  });

  it("can't delete another owner's project", async () => {
    const r = await asOwner(db, A, (tx) => tx.query("delete from public.projects where id = $1", [ids.projectB]));
    expect(r.affectedRows).toBe(0);
    expect(await count(db, `select 1 from public.projects where id = '${ids.projectB}'`)).toBe(1);
  });

  it("deleting their own project cascades to all its rows", async () => {
    const r = await asOwner(db, A, (tx) => tx.query("delete from public.projects where id = $1", [ids.projectA]));
    expect(r.affectedRows).toBe(1);

    const p = ids.projectA;
    expect(await count(db, `select 1 from public.widget_configs where project_id = '${p}'`)).toBe(0);
    expect(await count(db, `select 1 from public.knowledge_sources where project_id = '${p}'`)).toBe(0);
    expect(await count(db, `select 1 from public.knowledge_chunks where project_id = '${p}'`)).toBe(0);
    expect(await count(db, `select 1 from public.conversations where project_id = '${p}'`)).toBe(0);
    expect(await count(db, `select 1 from public.messages where conversation_id = '${ids.convA}'`)).toBe(0);
    // B is untouched.
    expect(await count(db, `select 1 from public.messages where conversation_id = '${ids.convB}'`)).toBe(1);
    expect(await count(db, `select 1 from public.knowledge_chunks where project_id = '${ids.projectB}'`)).toBe(1);
  });
});

describe("service_role", () => {
  it("reads every row and writes", async () => {
    const n = await asRole(db, "service_role", { role: "service_role" }, async (tx) => {
      await tx.query("update public.projects set messages_used = messages_used + 1");
      const r = await tx.query<{ n: number }>("select count(*)::int as n from public.projects");
      return r.rows[0]!.n;
    });
    expect(n).toBe(2);
  });

  it("can't truncate", async () => {
    await expect(
      asRole(db, "service_role", { role: "service_role" }, (tx) => tx.query("truncate public.messages")),
    ).rejects.toThrow(/permission denied/);
  });
});

describe("cascades", () => {
  it("deleting a source deletes its chunks", async () => {
    await db.query("delete from public.knowledge_sources where id = $1", [ids.sourceA]);
    expect(await count(db, `select 1 from public.knowledge_chunks where source_id = '${ids.sourceA}'`)).toBe(0);
  });

  it("deleting a conversation deletes its messages", async () => {
    await db.query("delete from public.conversations where id = $1", [ids.convA]);
    expect(await count(db, `select 1 from public.messages where conversation_id = '${ids.convA}'`)).toBe(0);
  });

  it("a chunk can't point at another project's source", async () => {
    await expect(
      db.query(
        `insert into public.knowledge_chunks (project_id, source_id, content, embedding)
         values ($1, $2, 'x', array_fill(0.1::real, array[1536])::extensions.vector)`,
        [ids.projectA, ids.sourceB],
      ),
    ).rejects.toThrow(/foreign key/);
  });
});
