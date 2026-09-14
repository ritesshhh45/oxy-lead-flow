import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/Reveal";

export function Section({
  id,
  children,
  className,
  tone = "default",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "soft" | "deep";
}) {
  return (
    <section
      id={id}
      className={cn(
        "px-4 py-16 sm:px-6 sm:py-20 lg:py-24",
        tone === "soft" && "bg-brand-soft",
        tone === "deep" && "bg-brand-deep text-brand-foreground",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  inverted = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  inverted?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "text-xs uppercase tracking-[0.24em]",
            inverted ? "text-brand-foreground/60" : "text-brand",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            inverted ? "text-brand-foreground/75" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
