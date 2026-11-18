"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "./utils";

export interface TabItem {
  label: string;
  href: string;
}

interface TabsProps {
  tabs: TabItem[];
  className?: string;
}

export function Tabs({ tabs, className }: TabsProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex gap-0 overflow-x-auto border-b border-border",
        className
      )}
      aria-label="Tabs"
    >
      {tabs.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
              active
                ? "border-fg text-fg"
                : "border-transparent text-fg-muted hover:text-fg"
            )}
            aria-current={active ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
