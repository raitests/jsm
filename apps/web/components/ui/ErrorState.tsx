import { cn } from "./utils";
import { Button } from "./Button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface">
        <span className="text-xl text-fg-muted" aria-hidden>
          !
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-fg">Something went wrong</p>
        {message && (
          <p className="max-w-xs text-sm text-fg-muted">{message}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
