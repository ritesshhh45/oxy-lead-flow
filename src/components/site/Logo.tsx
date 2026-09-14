import { cn } from "@/lib/utils";

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span
        className={cn(
          "font-display text-2xl leading-none tracking-tight",
          inverted ? "text-brand-foreground" : "text-brand-deep",
        )}
      >
        Oxytive
      </span>
      <span
        className={cn(
          "text-[0.55rem] uppercase tracking-[0.2em]",
          inverted ? "text-brand-foreground/70" : "text-brand",
        )}
      >
        ™
      </span>
    </span>
  );
}
