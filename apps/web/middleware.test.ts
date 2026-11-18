import { describe, expect, it } from "vitest";
import { isDashboardRoute, isOwnerApiRoute } from "./middleware";

describe("isOwnerApiRoute", () => {
  it("matches /api/projects", () => {
    expect(isOwnerApiRoute("/api/projects")).toBe(true);
  });
  it("matches /api/projects/:id", () => {
    expect(isOwnerApiRoute("/api/projects/abc-123")).toBe(true);
  });
  it("matches /api/projects/:id/knowledge", () => {
    expect(isOwnerApiRoute("/api/projects/abc/knowledge")).toBe(true);
  });
  it("matches /api/knowledge/:id", () => {
    expect(isOwnerApiRoute("/api/knowledge/abc-123")).toBe(true);
  });
  it("matches /api/conversations", () => {
    expect(isOwnerApiRoute("/api/conversations")).toBe(true);
  });
  it("matches /api/conversations/:id", () => {
    expect(isOwnerApiRoute("/api/conversations/xyz")).toBe(true);
  });

  it("does not match /api/widget/chat", () => {
    expect(isOwnerApiRoute("/api/widget/chat")).toBe(false);
  });
  it("does not match /api/widget/config", () => {
    expect(isOwnerApiRoute("/api/widget/config")).toBe(false);
  });
  it("does not match /api/clerk/webhook", () => {
    expect(isOwnerApiRoute("/api/clerk/webhook")).toBe(false);
  });
  it("does not match /api/posthog-config", () => {
    expect(isOwnerApiRoute("/api/posthog-config")).toBe(false);
  });
  it("does not match /api/projectsx (prefix only, no slash)", () => {
    expect(isOwnerApiRoute("/api/projectsx")).toBe(false);
  });
});

describe("isDashboardRoute", () => {
  it("matches /dashboard", () => {
    expect(isDashboardRoute("/dashboard")).toBe(true);
  });
  it("matches /dashboard/projects", () => {
    expect(isDashboardRoute("/dashboard/projects")).toBe(true);
  });
  it("matches /dashboard/projects/123", () => {
    expect(isDashboardRoute("/dashboard/projects/123")).toBe(true);
  });

  it("does not match /", () => {
    expect(isDashboardRoute("/")).toBe(false);
  });
  it("does not match /sign-in", () => {
    expect(isDashboardRoute("/sign-in")).toBe(false);
  });
  it("does not match /sign-up", () => {
    expect(isDashboardRoute("/sign-up")).toBe(false);
  });
  it("does not match /embed/abc", () => {
    expect(isDashboardRoute("/embed/abc")).toBe(false);
  });
  it("does not match /dashboardx (prefix only)", () => {
    expect(isDashboardRoute("/dashboardx")).toBe(false);
  });
});
