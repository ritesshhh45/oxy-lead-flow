import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { LeadForm } from "@/components/forms/LeadForm";
import { businessTypes, waMessages } from "@/config/site";
import { useContent } from "@/lib/cms";

export function BusinessSection() {
  const content = useContent<{ title: string; text: string }>("business");

  return (
    <Section id="business">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionHeading
            eyebrow="For business"
            title={content.title || "Your Guests Notice the Details."}
            subtitle={
              content.text ||
              "Hotels, cafes, restaurants, resorts, banquet halls, caterers and offices — clean, well-presented bottles on every table, every day."
            }
          />
          <Reveal className="mt-8 flex flex-wrap gap-2">
            {businessTypes.map((b) => (
              <span
                key={b}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/75"
              >
                {b}
              </span>
            ))}
          </Reveal>
        </div>

        <Reveal delay={100} className="min-w-0 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h3 className="text-xl">Set Up Business Supply</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Tell us your monthly requirement and we'll confirm pricing and a delivery schedule.
          </p>
          <LeadForm
            className="mt-6"
            eventName="business_enquiry"
            submitLabel="Request Business Pricing"
            waMessage={waMessages.business}
            defaults={{ requirement_type: "Hotel" }}
            fields={[
              "name",
              "business_name",
              "phone",
              "business_type",
              "city",
              "area",
              "bottle_size",
              "quantity",
              "message",
            ]}
          />
        </Reveal>
      </div>
    </Section>
  );
}
