import { cn } from "./utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface">
        <span className="text-xl text-fg-muted" aria-hidden>
          ○
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-fg">{title}</p>
        {description && (
          <p className="text-sm text-fg-muted">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
