import Link from "next/link";
import { APP_NAME } from "@askwell/shared";

export function Hero() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <p className="hero-animate-1 mb-4 text-xs font-semibold uppercase tracking-widest text-fg-muted">
          {APP_NAME}
        </p>
        <h1 className="hero-animate-2 mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          AI support that knows
          <br />
          your product
        </h1>
        <p className="hero-animate-3 mb-10 text-lg leading-relaxed text-fg-muted">
          Add your docs. Copy one script tag. Your site gets a support bot
          <br className="hidden sm:inline" /> that answers from your content —
          in minutes.
        </p>
        <div className="hero-animate-3 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-7 py-3 text-sm font-medium text-accent-fg transition-opacity hover:opacity-80"
          >
            Start free →
          </Link>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-xl border border-border px-7 py-3 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
          >
            See pricing ↓
          </a>
        </div>
      </div>
    </section>
  );
}
