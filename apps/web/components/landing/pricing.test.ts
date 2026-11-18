import { describe, it, expect } from "vitest";
import { PRICING_TABLE, PRO_PRICE_USD_MONTHLY } from "./pricing-data";
import { PLAN_LIMITS } from "@askwell/shared";

describe("Pricing section data", () => {
  it("Projects row reads from PLAN_LIMITS", () => {
    const row = PRICING_TABLE.find((r) => r.label === "Projects")!;
    expect(row.free).toBe(PLAN_LIMITS.free.projects);
    expect(row.pro).toBe(PLAN_LIMITS.pro.projects);
  });

  it("Messages row reads from PLAN_LIMITS", () => {
    const row = PRICING_TABLE.find((r) => r.label.includes("Messages"))!;
    expect(row.free).toBe(PLAN_LIMITS.free.messagesPerMonth);
    expect(row.pro).toBe(PLAN_LIMITS.pro.messagesPerMonth);
  });

  it("Knowledge sources row reads from PLAN_LIMITS", () => {
    const row = PRICING_TABLE.find((r) => r.label.includes("Knowledge"))!;
    expect(row.free).toBe(PLAN_LIMITS.free.knowledgeSources);
    expect(row.pro).toBe(PLAN_LIMITS.pro.knowledgeSources);
  });

  it("Pro price is PRO_PRICE_USD_MONTHLY ($19)", () => {
    expect(PRO_PRICE_USD_MONTHLY).toBe(19);
  });
});
