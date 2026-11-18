import { describe, expect, it } from "vitest";
import { PLAN_LIMITS, PLANS, PRO_PRICE_USD_MONTHLY, planSchema } from "./index";

describe("PLAN_LIMITS", () => {
  it("matches project.md §5 exactly", () => {
    expect(PLAN_LIMITS).toEqual({
      free: { projects: 1, messagesPerMonth: 100, knowledgeSources: 3, canCustomize: false },
      pro: { projects: 5, messagesPerMonth: 2000, knowledgeSources: 25, canCustomize: true },
    });
  });

  it("has an entry for every plan and no others", () => {
    expect(Object.keys(PLAN_LIMITS).sort()).toEqual([...PLANS].sort());
  });

  it("cannot be changed at runtime", () => {
    expect(Object.isFrozen(PLAN_LIMITS)).toBe(true);
    expect(Object.isFrozen(PLAN_LIMITS.free)).toBe(true);
    expect(Object.isFrozen(PLAN_LIMITS.pro)).toBe(true);
  });

  it("prices Pro at 19 USD a month", () => {
    expect(PRO_PRICE_USD_MONTHLY).toBe(19);
  });

  it("accepts only known plans", () => {
    expect(planSchema.safeParse("pro").success).toBe(true);
    expect(planSchema.safeParse("enterprise").success).toBe(false);
  });
});
