import { cn } from "./utils";

interface LoadingStateProps {
  className?: string;
}

export function LoadingState({ className }: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn("flex items-center justify-center py-16", className)}
    >
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-fg"
        aria-hidden
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}
