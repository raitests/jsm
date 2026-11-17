import { describe, expect, it } from "vitest";
import {
  DEFAULT_WIDGET_CONFIG,
  MAX_MESSAGE_CHARS,
  PUBLIC_KEY_PREFIX,
  updateWidgetConfigBodySchema,
  widgetChatBodySchema,
  widgetConfigQuerySchema,
  widgetConfigSchema,
} from "./index";

const key = `${PUBLIC_KEY_PREFIX}abcdefghijklmnop1234`;
const visitorId = "6f1c1f5e-2f4b-4b8e-9a51-2b7f0f7f2a10";

describe("public key", () => {
  it("accepts a pk_ key", () => {
    expect(widgetConfigQuerySchema.safeParse({ key }).success).toBe(true);
  });

  it.each([
    ["no prefix", "abcdefghijklmnop1234"],
    ["wrong prefix", "sk_abcdefghijklmnop1234"],
    ["too short", "pk_abc"],
    ["bad characters", "pk_abcdefghijklmnop<script>"],
    ["empty", ""],
  ])("refuses a key with %s", (_label, bad) => {
    expect(widgetConfigQuerySchema.safeParse({ key: bad }).success).toBe(false);
  });
});

describe("widget chat input", () => {
  const base = { key, visitorId, message: "Hello" };

  it("accepts a first message without conversationId", () => {
    expect(widgetChatBodySchema.safeParse(base).success).toBe(true);
  });

  it(`accepts exactly ${MAX_MESSAGE_CHARS} characters`, () => {
    const r = widgetChatBodySchema.safeParse({ ...base, message: "a".repeat(MAX_MESSAGE_CHARS) });
    expect(r.success).toBe(true);
  });

  it(`refuses ${MAX_MESSAGE_CHARS + 1} characters`, () => {
    const r = widgetChatBodySchema.safeParse({ ...base, message: "a".repeat(MAX_MESSAGE_CHARS + 1) });
    expect(r.success).toBe(false);
  });

  it("refuses an empty or whitespace-only message", () => {
    expect(widgetChatBodySchema.safeParse({ ...base, message: "" }).success).toBe(false);
    expect(widgetChatBodySchema.safeParse({ ...base, message: "   " }).success).toBe(false);
  });

  it("refuses a bad conversationId or visitorId", () => {
    expect(widgetChatBodySchema.safeParse({ ...base, conversationId: "1" }).success).toBe(false);
    expect(widgetChatBodySchema.safeParse({ ...base, visitorId: "x" }).success).toBe(false);
  });
});

describe("widget config", () => {
  it("defaults are valid Free defaults", () => {
    expect(widgetConfigSchema.parse(DEFAULT_WIDGET_CONFIG)).toEqual(DEFAULT_WIDGET_CONFIG);
    expect(DEFAULT_WIDGET_CONFIG.position).toBe("bottom-right");
    expect(DEFAULT_WIDGET_CONFIG.animation).toBe("fade");
    expect(DEFAULT_WIDGET_CONFIG.showBadge).toBe(true);
  });

  it("update accepts a partial change and refuses an empty one", () => {
    expect(updateWidgetConfigBodySchema.safeParse({ position: "top-left" }).success).toBe(true);
    expect(updateWidgetConfigBodySchema.safeParse({}).success).toBe(false);
  });

  it("update refuses unknown positions, animations and bad colors", () => {
    expect(updateWidgetConfigBodySchema.safeParse({ position: "center" }).success).toBe(false);
    expect(updateWidgetConfigBodySchema.safeParse({ animation: "bounce" }).success).toBe(false);
    expect(updateWidgetConfigBodySchema.safeParse({ buttonColor: "red" }).success).toBe(false);
  });
});
