import Link from "next/link";
import { APP_NAME } from "@askwell/shared";

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <span className="text-sm font-semibold">{APP_NAME}</span>
        <nav className="flex gap-6 text-sm text-fg-muted" aria-label="Footer">
          <Link href="/sign-in" className="transition-colors hover:text-fg">
            Sign in
          </Link>
          <Link href="/sign-up" className="transition-colors hover:text-fg">
            Sign up
          </Link>
        </nav>
      </div>
    </footer>
  );
}
