import { z } from "zod";

export const PLANS = ["free", "pro"] as const;
export const planSchema = z.enum(PLANS);
export type Plan = z.infer<typeof planSchema>;

export interface PlanLimits {
  /** Projects per account. */
  readonly projects: number;
  /** Visitor messages per project per month. */
  readonly messagesPerMonth: number;
  /** Knowledge sources (files + pasted texts) per project. */
  readonly knowledgeSources: number;
  /** Whether the widget can be customized (color, position, label, animation, header, badge). */
  readonly canCustomize: boolean;
}

/** The only place plan limits live (project.md §5). The server reads these; clients never decide. */
export const PLAN_LIMITS: Readonly<Record<Plan, PlanLimits>> = Object.freeze({
  free: Object.freeze({
    projects: 1,
    messagesPerMonth: 100,
    knowledgeSources: 3,
    canCustomize: false,
  }),
  pro: Object.freeze({
    projects: 5,
    messagesPerMonth: 2000,
    knowledgeSources: 25,
    canCustomize: true,
  }),
});

/** Pro price in USD per month. The Clerk Billing plan must match it. */
export const PRO_PRICE_USD_MONTHLY = 19;
