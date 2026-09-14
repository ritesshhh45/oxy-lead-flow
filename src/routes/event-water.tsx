import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { LandingShell } from "@/components/site/LandingShell";
import { LeadForm } from "@/components/forms/LeadForm";
import { Reveal } from "@/components/site/Reveal";
import { eventTypes, site, waMessages } from "@/config/site";
import { localBusinessSchema } from "@/lib/schema";
import bottle500 from "@/assets/oxytive-500ml.png.asset.json";

const title = "Water Bottles for Weddings & Events — Get a Quote | OXYTIVE";
const description =
  "Packaged drinking water for weddings, corporate events, conferences and parties. Share your date, guest count and city for an OXYTIVE event quote.";

export const Route = createFileRoute("/event-water")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/event-water" },
    ],
    links: [{ rel: "canonical", href: "/event-water" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusinessSchema) }],
  }),
  component: EventLanding,
});

function EventLanding() {
  return (
    <LandingShell waMessage={waMessages.event}>
      <section className="brand-wash px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal className="min-w-0">
            <h1 className="text-4xl leading-[1.06] sm:text-5xl">
              Water Bottles for Weddings & Events. Quoted to Your Guest Count.
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground sm:text-lg">
              Clean, sealed OXYTIVE bottles for every table, counter and welcome desk — in 500 ml and 1 L,
              delivered against a confirmed date and venue.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {eventTypes.map((t) => (
                <li key={t} className="rounded-full bg-brand-soft px-3 py-1.5 text-sm text-brand-deep">
                  {t}
                </li>
              ))}
            </ul>

            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {[
                "Quantity planned per guest count",
                "500 ml and 1 L bottles",
                "Single-date or multi-day events",
                `Serving ${site.serviceAreaLabel}`,
              ].map((l) => (
                <li key={l} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-brand" /> {l}
                </li>
              ))}
            </ul>

            <img
              src={bottle500.url}
              alt="OXYTIVE 500 ml packaged drinking water bottle for events"
              loading="lazy"
              className="mt-10 hidden w-full max-w-sm rounded-3xl object-cover lg:block"
            />
          </Reveal>

          <Reveal delay={100} className="min-w-0 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl">Get Event Quote</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Tell us the date and guest count — we'll do the maths.
            </p>
            <LeadForm
              className="mt-6"
              eventName="event_enquiry"
              submitLabel="Get Event Quote"
              waMessage={waMessages.event}
              defaults={{ requirement_type: "Event Order" }}
              fields={[
                "name",
                "phone",
                "event_type",
                "event_date",
                "expected_guests",
                "bottle_size",
                "quantity",
                "city",
              ]}
            />
          </Reveal>
        </div>
      </section>
    </LandingShell>
  );
}
