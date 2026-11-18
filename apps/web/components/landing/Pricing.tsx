import Link from "next/link";
import { PRO_PRICE_USD_MONTHLY } from "@askwell/shared";
import { AnimateIn } from "./AnimateIn";
import { PRICING_TABLE } from "./pricing-data";

export { PRICING_TABLE } from "./pricing-data";

export function Pricing() {
  return (
    <section id="pricing" className="px-4 py-24">
      <AnimateIn className="mx-auto max-w-4xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight">
          Simple pricing
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Free plan */}
          <div className="flex flex-col rounded-2xl border border-border bg-surface p-8 backdrop-blur-panel">
            <p className="mb-1 text-sm font-medium text-fg-muted">Free</p>
            <p className="mb-8 text-4xl font-bold">$0</p>
            <ul className="mb-8 flex flex-col gap-3 text-sm">
              {PRICING_TABLE.map((row) => (
                <li key={row.label} className="flex justify-between gap-4">
                  <span className="text-fg-muted">{row.label}</span>
                  <span className="font-medium tabular-nums">{row.free}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="mt-auto inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-raised"
            >
              Start free
            </Link>
          </div>

          {/* Pro plan */}
          <div className="flex flex-col rounded-2xl border border-border-strong bg-surface-raised p-8 backdrop-blur-panel">
            <p className="mb-1 text-sm font-medium text-fg-muted">Pro</p>
            <div className="mb-8 flex items-end gap-1">
              <p className="text-4xl font-bold">${PRO_PRICE_USD_MONTHLY}</p>
              <p className="mb-1 text-sm text-fg-muted">/ month</p>
            </div>
            <ul className="mb-8 flex flex-col gap-3 text-sm">
              {PRICING_TABLE.map((row) => (
                <li key={row.label} className="flex justify-between gap-4">
                  <span className="text-fg-muted">{row.label}</span>
                  <span className="font-medium tabular-nums">{row.pro}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="mt-auto inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-80"
            >
              Get Pro
            </Link>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
