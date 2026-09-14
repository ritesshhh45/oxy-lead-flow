import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import bottle500 from "@/assets/oxytive-500ml.png.asset.json";

const idealFor = ["Retail", "Travel", "Events", "Restaurants", "Corporate meetings", "Parties"];

export function Feature500() {
  const { openEnquiry } = useEnquiry();

  return (
    <Section tone="deep">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal className="relative min-w-0 overflow-hidden rounded-3xl">
          <img
            src={bottle500.url}
            alt="OXYTIVE 500 mL bottle photographed outdoors in daylight"
            loading="lazy"
            className="aspect-square w-full rounded-3xl object-cover"
          />
        </Reveal>

        <Reveal delay={100} className="min-w-0">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-foreground/60">Signature pack</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">The 500 mL bottle.</h2>
          <p className="mt-4 text-brand-foreground/75">
            One hand, one serving, no waste. The 500 mL is the pack most businesses reorder — easy to
            stack, easy to hand out and easy to brand a moment around.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {idealFor.map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-brand-foreground/85">
                <Check className="h-4 w-4 shrink-0 text-brand-foreground" /> {i}
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            onClick={() =>
              openEnquiry({
                title: "Get 500 mL Bulk Quote",
                description: "Share your requirement and we'll come back with pricing.",
                defaults: { bottle_size: "500 mL", requirement_type: "Bulk Order" },
                eventName: "bulk_order_request",
                fields: ["name", "phone", "city", "quantity", "requirement_type"],
              })
            }
          >
            Get 500 mL Bulk Quote
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
