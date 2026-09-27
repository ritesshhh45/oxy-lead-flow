import { createFileRoute } from "@tanstack/react-router";
import { Check, ShieldCheck, Truck, Boxes } from "lucide-react";
import { LandingShell } from "@/components/site/LandingShell";
import { LeadForm } from "@/components/forms/LeadForm";
import { Reveal } from "@/components/site/Reveal";
import { site, waMessages } from "@/config/site";
import { localBusinessSchema } from "@/lib/schema";
import bottle1L from "@/assets/oxytive-1l.png.asset.json";

const title = "Bulk Drinking Water Supply — Get a Quote | OXYTIVE";
const description =
  "Bulk packaged drinking water in 500 ml and 1 L bottles for hotels, restaurants, offices, events and retailers. Send your quantity and get a quote from OXYTIVE.";

export const Route = createFileRoute("/bulk-water")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/bulk-water" },
    ],
    links: [{ rel: "canonical", href: "/bulk-water" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusinessSchema) }],
  }),
  component: BulkLanding,
});

const trust = [
  { icon: ShieldCheck, t: "Quality focused", d: "Treated, purified and checked before sealing." },
  { icon: Boxes, t: "500 ml & 1 L", d: "Two sizes available today, quoted per volume." },
  { icon: Truck, t: "Planned dispatch", d: "Delivery confirmed against your area and schedule." },
];

function BulkLanding() {
  return (
    <LandingShell waMessage={waMessages.bulk}>
      <section className="brand-wash px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal className="min-w-0">
            <h1 className="text-4xl leading-[1.06] sm:text-5xl">
              Bulk Drinking Water. Reliable Supply. Simple Ordering.
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground sm:text-lg">
              OXYTIVE packaged drinking water for hotels, restaurants, offices, events, caterers and
              retailers. Send your quantity and delivery area — we'll come back with pricing.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {trust.map((t) => (
                <li key={t.t} className="rounded-2xl border border-border bg-card p-4">
                  <t.icon className="h-5 w-5 text-brand" aria-hidden />
                  <p className="mt-2 text-sm font-medium">{t.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.d}</p>
                </li>
              ))}
            </ul>

            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {[
                "500 – 1,000 bottles and above",
                "Recurring monthly supply",
                "One-off event volumes",
                `Serving ${site.serviceAreaLabel}`,
              ].map((l) => (
                <li key={l} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-brand" /> {l}
                </li>
              ))}
            </ul>

            <img
              src={bottle1L.url}
              alt="OXYTIVE 1 litre packaged drinking water bottle for bulk supply"
              loading="lazy"
              className="mt-10 hidden h-72 object-contain lg:block"
            />
          </Reveal>

          <Reveal delay={100} className="min-w-0 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl">Get Bulk Quote</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Short form. Our team replies during business hours.
            </p>
            <LeadForm
              className="mt-6"
              eventName="bulk_order_request"
              submitLabel="Get Bulk Quote"
              waMessage={waMessages.bulk}
              defaults={{ requirement_type: "Bulk Order" }}
              fields={["name", "phone", "city", "area", "business_type", "bottle_size", "quantity"]}
            />
          </Reveal>
        </div>
      </section>
    </LandingShell>
  );
}
