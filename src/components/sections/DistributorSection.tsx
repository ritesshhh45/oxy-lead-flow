import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { LeadForm } from "@/components/forms/LeadForm";
import { waMessages } from "@/config/site";

export function DistributorSection() {
  return (
    <Section id="dealership" tone="deep">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionHeading
            inverted
            eyebrow="Dealership"
            title="Become an OXYTIVE Dealer"
subtitle="Interested in selling OXYTIVE in your area? Join us as an authorised dealer and grow your packaged drinking water business with a premium brand."          />

          <Reveal className="mt-8">
            <div className="max-w-lg rounded-xl border border-brand-foreground/20 bg-brand-foreground/5 p-5">
              <p className="text-sm leading-6 text-brand-foreground/80">
                Dealer opportunities are available for suitable retailers,
                businesses and local partners. Tell us about your business and
                area — our team will get in touch with you.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={100}
          className="min-w-0 rounded-2xl bg-card p-6 text-foreground sm:p-8"
        >
          <h3 className="text-xl">Dealer Enquiry</h3>

          <LeadForm
            className="mt-6"
            eventName="dealer_enquiry"
            submitLabel="Submit Dealer Enquiry"
            waMessage={waMessages.distributor}
            defaults={{
              requirement_type: "Dealership",
            }}
            fields={[
              "name",
              "business_name",
              "phone",
              "city",
              "area",
              "business_type",
              "quantity",
              "message",
            ]}
          />
        </Reveal>
      </div>
    </Section>
  );
}
