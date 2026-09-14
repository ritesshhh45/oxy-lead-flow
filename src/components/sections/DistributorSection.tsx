import { useState } from "react";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/forms/LeadForm";
import { waMessages } from "@/config/site";
import { cn } from "@/lib/utils";

export function DistributorSection() {
  const [role, setRole] = useState<"Distribution" | "Retail Partnership">("Distribution");

  return (
    <Section id="partner" tone="deep">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionHeading
            inverted
            eyebrow="Partnership"
            title="Partner With OXYTIVE"
            subtitle="Interested in stocking or distributing OXYTIVE in your area? Let's talk. Commercial terms are discussed case by case — we don't publish margins or territory promises we haven't agreed with you."
          />
          <Reveal className="mt-8 flex flex-wrap gap-3">
            {(["Distribution", "Retail Partnership"] as const).map((r) => (
              <Button
                key={r}
                variant={role === r ? "secondary" : "outline"}
                size="lg"
                onClick={() => setRole(r)}
                className={cn(
                  role !== r && "border-brand-foreground/30 bg-transparent text-brand-foreground",
                )}
              >
                {r === "Distribution" ? "Become a Distributor" : "Become a Retail Partner"}
              </Button>
            ))}
          </Reveal>
        </div>

        <Reveal delay={100} className="min-w-0 rounded-2xl bg-card p-6 text-foreground sm:p-8">
          <h3 className="text-xl">Submit Partnership Enquiry</h3>
          <LeadForm
            className="mt-6"
            eventName="distributor_enquiry"
            submitLabel="Submit Partnership Enquiry"
            waMessage={waMessages.distributor}
            defaults={{ requirement_type: role }}
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
