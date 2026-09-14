import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { LeadForm } from "@/components/forms/LeadForm";
import { eventTypes, waMessages } from "@/config/site";

export function EventSection() {
  return (
    <Section id="events">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionHeading
            eyebrow="Events"
            title="Make Every Event Refreshing."
            subtitle="Guests remember the small things. Clean, well-presented bottles on every table, counter and welcome desk — in the quantity your guest count actually needs."
          />
          <Reveal className="mt-8 grid gap-2 sm:grid-cols-2">
            {eventTypes.map((t) => (
              <div
                key={t}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground/80"
              >
                {t}
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={100} className="min-w-0 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h3 className="text-xl">Plan My Event Order</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Share the basics and we'll send an event quote.
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
    </Section>
  );
}
