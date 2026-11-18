import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// server-only throws in Vitest's Node resolver; stub it out for tests
vi.mock("server-only", () => ({}));

// Mock @clerk/nextjs/server so owner.ts can be imported without a live Clerk env
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ getToken: vi.fn().mockResolvedValue("test-token") }),
}));

const originalEnv = { ...process.env };

function setEnv(vars: Record<string, string | undefined>) {
  for (const [k, v] of Object.entries(vars)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

afterEach(() => {
  // Restore env after each test
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) delete process.env[key];
  }
  Object.assign(process.env, originalEnv);
  vi.resetModules();
});

// ---------------------------------------------------------------------------
// owner client
// ---------------------------------------------------------------------------

describe("createOwnerClient", () => {
  beforeEach(() => {
    setEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-key",
    });
  });

  it("returns a client when env vars are present", async () => {
    const { createOwnerClient } = await import("./owner");
    const client = await createOwnerClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe("function");
  });

  it("throws clearly when NEXT_PUBLIC_SUPABASE_URL is missing", async () => {
    setEnv({ NEXT_PUBLIC_SUPABASE_URL: undefined });
    const { createOwnerClient } = await import("./owner");
    await expect(createOwnerClient()).rejects.toThrow("NEXT_PUBLIC_SUPABASE_URL is not set");
  });

  it("throws clearly when NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing", async () => {
    setEnv({ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: undefined });
    const { createOwnerClient } = await import("./owner");
    await expect(createOwnerClient()).rejects.toThrow(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set",
    );
  });
});

// ---------------------------------------------------------------------------
// service client
// ---------------------------------------------------------------------------

describe("createServiceClient", () => {
  beforeEach(() => {
    setEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SECRET_KEY: "service-role-key",
    });
  });

  it("returns a client when env vars are present", async () => {
    const { createServiceClient } = await import("./service");
    const client = createServiceClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe("function");
  });

  it("throws clearly when NEXT_PUBLIC_SUPABASE_URL is missing", async () => {
    setEnv({ NEXT_PUBLIC_SUPABASE_URL: undefined });
    const { createServiceClient } = await import("./service");
    expect(() => createServiceClient()).toThrow("NEXT_PUBLIC_SUPABASE_URL is not set");
  });

  it("throws clearly when SUPABASE_SECRET_KEY is missing", async () => {
    setEnv({ SUPABASE_SECRET_KEY: undefined });
    const { createServiceClient } = await import("./service");
    expect(() => createServiceClient()).toThrow("SUPABASE_SECRET_KEY is not set");
  });
});
