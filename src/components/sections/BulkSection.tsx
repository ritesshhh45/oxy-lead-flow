import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { quantityBands } from "@/config/site";
import { cn } from "@/lib/utils";

const segments = [
  "Hotels",
  "Restaurants",
  "Cafes",
  "Corporate Offices",
  "Events",
  "Weddings",
  "Caterers",
  "Retailers",
  "Gyms",
  "Institutions",
  "Distributors",
];

export function BulkSection() {
  const { openEnquiry } = useEnquiry();
  const [band, setBand] = useState<string>(quantityBands[1]);

  return (
    <Section id="bulk" tone="soft">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0">
          <SectionHeading
            eyebrow="Bulk supply"
            title="Need Water in Bulk? We've Got You Covered."
            subtitle="Tell us the volume, the sizes and where it has to reach. We'll come back with pricing and a delivery plan that fits."
          />
          <Reveal className="mt-8 flex flex-wrap gap-2">
            {segments.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/75"
              >
                {s}
              </span>
            ))}
          </Reveal>
        </div>

        <Reveal delay={120} className="min-w-0 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h3 className="text-xl">How much do you need?</h3>
          <div className="mt-5 grid gap-2">
            {quantityBands.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setBand(q)}
                aria-pressed={band === q}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                  band === q
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border hover:border-brand/50",
                )}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Button
              size="lg"
              onClick={() =>
                openEnquiry({
                  title: "Request Bulk Quote",
                  defaults: { quantity: band, requirement_type: "Bulk Order" },
                  eventName: "bulk_order_request",
                  fields: ["name", "phone", "city", "bottle_size", "quantity", "business_type", "message"],
                })
              }
            >
              Get Custom Pricing
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                openEnquiry({
                  title: "Request Bulk Quote",
                  defaults: { quantity: band, requirement_type: "Bulk Order" },
                  eventName: "bulk_order_request",
                })
              }
            >
              Request Bulk Quote
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
