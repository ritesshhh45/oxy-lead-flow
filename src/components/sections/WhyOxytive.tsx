import { Boxes, Droplets, HeartPulse, PackageCheck, Truck, Handshake } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

const cards = [
  {
    icon: Droplets,
    title: "Quality Focused",
    body: "Water is treated, checked and packed with a process built around consistency — not shortcuts.",
  },
  {
    icon: PackageCheck,
    title: "Clean & Professional Packaging",
    body: "Sealed bottles and a label that looks right on a boardroom table or a wedding buffet.",
  },
  {
    icon: Truck,
    title: "Reliable Supply",
    body: "Planned dispatch against confirmed requirements, so your reorder doesn't become a scramble.",
  },
  {
    icon: HeartPulse,
    title: "Made for Everyday Hydration",
    body: "A neutral, easy-drinking water for homes, desks, gyms and long days out.",
  },
  {
    icon: Boxes,
    title: "Bulk & Event Requirements",
    body: "Volumes quoted per event or per month, with sizes matched to how the water is served.",
  },
  {
    icon: Handshake,
    title: "Business-Friendly Ordering",
    body: "Quick quotes on WhatsApp or call, clear confirmations and a single point of contact.",
  },
];

export function WhyOxytive() {
  return (
    <Section tone="soft">
      <SectionHeading
        eyebrow="Why OXYTIVE"
        title="Why Choose OXYTIVE?"
        subtitle="We're a new brand, so we'd rather earn trust with clear information than with borrowed claims."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal
            key={c.title}
            delay={i * 70}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(76,20,140,0.5)]"
          >
            <c.icon className="h-6 w-6 text-brand" aria-hidden />
            <h3 className="mt-4 text-lg">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
