import { PLAN_LIMITS, PRO_PRICE_USD_MONTHLY } from "@askwell/shared";

export interface PricingRow {
  label: string;
  free: string | number;
  pro: string | number;
}

export const PRICING_TABLE: readonly PricingRow[] = [
  {
    label: "Projects",
    free: PLAN_LIMITS.free.projects,
    pro: PLAN_LIMITS.pro.projects,
  },
  {
    label: "Messages / month",
    free: PLAN_LIMITS.free.messagesPerMonth,
    pro: PLAN_LIMITS.pro.messagesPerMonth,
  },
  {
    label: "Knowledge sources",
    free: PLAN_LIMITS.free.knowledgeSources,
    pro: PLAN_LIMITS.pro.knowledgeSources,
  },
  {
    label: "Widget customization",
    free: "—",
    pro: "✓",
  },
];

export { PRO_PRICE_USD_MONTHLY };
