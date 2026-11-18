import { cn } from "./utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  raised?: boolean;
}

export function GlassPanel({
  className,
  raised = false,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border backdrop-blur-panel",
        raised
          ? "bg-surface-raised shadow-raised"
          : "bg-surface shadow-panel",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
