"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
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

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const prevOpenRef = useRef(false);

  // Track mobile breakpoint so we know when to apply inert
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Escape closes the drawer
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, close]);

  // Restore focus to the hamburger when the drawer closes
  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;
    if (wasOpen && !open) {
      // display:none on sm+ means focus is a no-op on desktop — safe to call always
      hamburgerRef.current?.focus();
    }
  }, [open]);

  // On mobile, inert removes the closed panel from tab order and AT
  const drawerInert = isMobile && !open;

  return (
    <>
      {/* Mobile toggle — also serves as the accessible close trigger via keyboard */}
      <button
        ref={hamburgerRef}
        className="fixed left-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-fg shadow-panel sm:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="dashboard-sidebar"
      >
        <span className="text-lg leading-none" aria-hidden>
          {open ? "✕" : "≡"}
        </span>
      </button>

      {/* Backdrop — pointer close for touch/mouse users */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 sm:hidden"
          onClick={close}
          aria-hidden
        />
      )}

      {/* Sidebar panel */}
      <aside
        id="dashboard-sidebar"
        // inert removes all closed-mobile content from tab order and AT tree.
        // On desktop the aside is always visible (sm:translate-x-0); isMobile
        // guard prevents applying inert there.
        {...(drawerInert ? { inert: true } : {})}
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-56 flex-col",
          "border-r border-border bg-surface backdrop-blur-panel",
          "transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
        ].join(" ")}
      >
        {/* Mobile header with close button inside the drawer */}
        <div className="flex items-center justify-between px-4 pt-4 sm:hidden">
          <span className="text-base font-semibold text-fg">{APP_NAME}</span>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md text-fg-muted hover:text-fg"
            onClick={close}
            aria-label="Close menu"
          >
            <span className="text-lg leading-none" aria-hidden>
              ✕
            </span>
          </button>
        </div>

        <div className="flex h-full flex-col gap-4 p-4">
          <div className="hidden items-center gap-2 px-1 py-1 sm:flex">
            <span className="text-base font-semibold text-fg">{APP_NAME}</span>
          </div>

          <nav className="flex flex-col gap-0.5" aria-label="Dashboard">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                onClick={close}
              />
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-2 px-1">
            <UserButton />
          </div>
        </div>
      </aside>
    </>
  );
}
