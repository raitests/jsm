import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

// Shared mock state for the upsert chain
const mockUpsert = vi.fn();
const mockFrom = vi.fn(() => ({ upsert: mockUpsert }));

vi.mock("./supabase/service", () => ({
  createServiceClient: () => ({ from: mockFrom }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ensureAccount", () => {
  it("upserts with plan free on first call", async () => {
    mockUpsert.mockResolvedValue({ error: null });
    const { ensureAccount } = await import("./accounts");
    await ensureAccount("user_abc");

    expect(mockFrom).toHaveBeenCalledWith("accounts");
    expect(mockUpsert).toHaveBeenCalledWith(
      { clerk_user_id: "user_abc", plan: "free" },
      { onConflict: "clerk_user_id", ignoreDuplicates: true },
    );
  });

  it("plan is always free regardless of any external state", async () => {
    mockUpsert.mockResolvedValue({ error: null });
    const { ensureAccount } = await import("./accounts");
    await ensureAccount("user_xyz");

    const [insertedRow] = mockUpsert.mock.calls[0];
    expect(insertedRow.plan).toBe("free");
  });

  it("does not throw on a second call (duplicate is ignored)", async () => {
    // A second call returns no error because ignoreDuplicates handles the conflict
    mockUpsert.mockResolvedValue({ error: null });
    const { ensureAccount } = await import("./accounts");
    await expect(ensureAccount("user_abc")).resolves.toBeUndefined();
    await expect(ensureAccount("user_abc")).resolves.toBeUndefined();
    expect(mockUpsert).toHaveBeenCalledTimes(2);
  });

  it("throws when the database returns an error", async () => {
    mockUpsert.mockResolvedValue({ error: { message: "db error" } });
    const { ensureAccount } = await import("./accounts");
    await expect(ensureAccount("user_abc")).rejects.toThrow("Failed to initialize account: db error");
  });
});
