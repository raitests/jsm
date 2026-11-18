import { describe, expect, it } from "vitest";
import { ERROR_CODES, ERROR_MESSAGES, ERROR_STATUS, apiError, isApiError } from "./index";

describe("apiError", () => {
  it("builds { error: { code, message } }", () => {
    expect(apiError("not_found", "No such project")).toEqual({
      error: { code: "not_found", message: "No such project" },
    });
  });

  it("falls back to the default message", () => {
    expect(apiError("payment_required").error.message).toBe(ERROR_MESSAGES.payment_required);
  });

  it("maps codes to HTTP statuses", () => {
    expect(ERROR_STATUS.unauthorized).toBe(401);
    expect(ERROR_STATUS.payment_required).toBe(402);
    expect(ERROR_STATUS.rate_limited).toBe(429);
    expect(ERROR_STATUS.validation).toBe(400);
    for (const code of ERROR_CODES) expect(ERROR_STATUS[code]).toBeGreaterThanOrEqual(400);
  });

  it("recognizes error bodies", () => {
    expect(isApiError(apiError("internal"))).toBe(true);
    expect(isApiError({ error: { code: "nope", message: "x" } })).toBe(false);
    expect(isApiError({ projects: [] })).toBe(false);
  });
});
