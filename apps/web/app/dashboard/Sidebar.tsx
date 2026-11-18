"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { APP_NAME } from "@askwell/shared";

const NAV_ITEMS = [
  { label: "Projects", href: "/dashboard" },
  { label: "Billing", href: "/dashboard/billing" },
];

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        active
          ? "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-surface-raised text-fg"
          : "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-fg-muted hover:bg-surface hover:text-fg transition-colors"
      }
    >
      {label}
    </Link>
  );
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-2 px-1 py-1">
        <span className="text-base font-semibold text-fg">{APP_NAME}</span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            onClick={onNavClick}
          />
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-2 px-1">
        <UserButton />
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="fixed left-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-fg shadow-panel sm:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <span className="text-lg leading-none">≡</span>
      </button>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar panel — always visible on sm+, drawer on mobile */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-56 flex-col",
          "border-r border-border bg-surface backdrop-blur-panel",
          "transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
        ].join(" ")}
      >
        <SidebarContent onNavClick={() => setOpen(false)} />
      </aside>
    </>
  );
}
