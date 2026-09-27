import type { ReactNode } from "react";
import { Reveal } from "@/components/site/Reveal";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="brand-wash px-4 pt-12 pb-14 sm:px-6 sm:pt-16 sm:pb-20">
      <Reveal className="mx-auto max-w-7xl">
        {eyebrow && <p className="text-xs uppercase tracking-[0.24em] text-brand">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.08] sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
        {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>}
      </Reveal>
    </section>
  );
}
